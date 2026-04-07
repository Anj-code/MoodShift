import { MoodLog, VoiceEntry } from "./storage";

export interface BurnoutAnalysis {
  coefficient: number; // 0-100
  risk: "low" | "moderate" | "high" | "critical";
  trend: "improving" | "stable" | "declining";
  primaryStressors: { name: string; count: number }[];
  prediction72h: number;
}

// Calculate Burnout Coefficient using weighted algorithm
// Bc = (Mood × 0.4) + (Sleep × 0.3) + (Sentiment × 0.3)
export const calculateBurnoutCoefficient = (
  mood: number, // 1-5
  sleep: number, // hours
  sentiment: number // -1 to 1
): number => {
  // Normalize mood to 0-1 (invert so higher burnout = worse mood)
  const moodScore = (5 - mood) / 4;

  // Normalize sleep to 0-1 (optimal = 7-9 hours, invert so less sleep = higher burnout)
  const optimalSleep = 8;
  const sleepDeviation = Math.abs(sleep - optimalSleep) / optimalSleep;
  const sleepScore = Math.min(sleepDeviation, 1);

  // Normalize sentiment to 0-1 (invert so negative = higher burnout)
  const sentimentScore = (1 - sentiment) / 2;

  // Calculate weighted coefficient
  const coefficient = moodScore * 0.4 + sleepScore * 0.3 + sentimentScore * 0.3;

  return Math.round(coefficient * 100);
};

export const getBurnoutRisk = (coefficient: number): "low" | "moderate" | "high" | "critical" => {
  if (coefficient < 25) return "low";
  if (coefficient < 50) return "moderate";
  if (coefficient < 75) return "high";
  return "critical";
};

export const analyzeBurnout = (
  logs: MoodLog[],
  entries: VoiceEntry[]
): BurnoutAnalysis => {
  if (logs.length === 0) {
    return {
      coefficient: 0,
      risk: "low",
      trend: "stable",
      primaryStressors: [],
      prediction72h: 0,
    };
  }

  // Get most recent data
  const recentLog = logs[logs.length - 1];
  const recentEntry = entries.length > 0 ? entries[entries.length - 1] : null;

  // Calculate current coefficient
  const currentCoefficient = calculateBurnoutCoefficient(
    recentLog.mood,
    recentLog.sleep,
    recentEntry?.sentiment || 0
  );

  // Calculate trend (compare last 3 days)
  let trend: "improving" | "stable" | "declining" = "stable";
  if (logs.length >= 3) {
    const recent3 = logs.slice(-3);
    const coefficients = recent3.map((log, idx) => {
      const entry = entries[entries.length - 3 + idx];
      return calculateBurnoutCoefficient(
        log.mood,
        log.sleep,
        entry?.sentiment || 0
      );
    });

    const avgChange = (coefficients[2] - coefficients[0]) / 2;
    if (avgChange < -5) trend = "improving";
    else if (avgChange > 5) trend = "declining";
  }

  // Extract stressors from voice entries
  const stressorKeywords = [
    "stress", "stressed", "anxiety", "anxious", "overwhelm", "overwhelmed",
    "burnout", "tired", "exhausted", "deadline", "pressure", "worry",
    "conflict", "difficult", "struggle", "struggling"
  ];

  const stressorCounts = new Map<string, number>();
  entries.forEach((entry) => {
    entry.keywords.forEach((keyword) => {
      const lower = keyword.toLowerCase();
      if (stressorKeywords.some((s) => lower.includes(s))) {
        const normalized = stressorKeywords.find((s) => lower.includes(s)) || keyword;
        stressorCounts.set(normalized, (stressorCounts.get(normalized) || 0) + 1);
      }
    });
  });

  const primaryStressors = Array.from(stressorCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Predict 72h burnout (simple linear projection)
  const prediction72h = Math.min(
    Math.max(currentCoefficient + (trend === "declining" ? 15 : trend === "improving" ? -10 : 0), 0),
    100
  );

  return {
    coefficient: currentCoefficient,
    risk: getBurnoutRisk(currentCoefficient),
    trend,
    primaryStressors,
    prediction72h,
  };
};
