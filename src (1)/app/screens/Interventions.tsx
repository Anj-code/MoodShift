import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Wind, Brain, Coffee, Heart, Sparkles, Play } from "lucide-react";
import { getMoodLogs, getVoiceEntries } from "../utils/storage";
import { analyzeBurnout } from "../utils/burnout";
import { InterventionSession } from "../components/InterventionSession";

interface Intervention {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: any;
  gradient: string;
  category: string;
}

const interventions: Intervention[] = [
  {
    id: "breathing",
    title: "4-7-8 Breathing",
    description: "Calm your nervous system with rhythmic breathing",
    duration: "3 min",
    icon: Wind,
    gradient: "from-cyan-400 to-blue-500",
    category: "breathing",
  },
  {
    id: "box-breathing",
    title: "Box Breathing",
    description: "Military technique for stress reduction",
    duration: "5 min",
    icon: Wind,
    gradient: "from-blue-400 to-indigo-500",
    category: "breathing",
  },
  {
    id: "cognitive-reframing",
    title: "Cognitive Reframing",
    description: "Challenge and reframe negative thought patterns",
    duration: "10 min",
    icon: Brain,
    gradient: "from-purple-400 to-pink-500",
    category: "cbt",
  },
  {
    id: "thought-record",
    title: "Thought Record",
    description: "Document and analyze automatic thoughts",
    duration: "8 min",
    icon: Brain,
    gradient: "from-violet-400 to-purple-500",
    category: "cbt",
  },
  {
    id: "microbreak",
    title: "5-Minute Microbreak",
    description: "Quick reset to prevent burnout accumulation",
    duration: "5 min",
    icon: Coffee,
    gradient: "from-amber-400 to-orange-500",
    category: "break",
  },
  {
    id: "walking-break",
    title: "Walking Break",
    description: "Movement to refresh mind and body",
    duration: "10 min",
    icon: Coffee,
    gradient: "from-green-400 to-emerald-500",
    category: "break",
  },
  {
    id: "body-scan",
    title: "Body Scan Meditation",
    description: "Progressive relaxation and awareness",
    duration: "12 min",
    icon: Heart,
    gradient: "from-rose-400 to-pink-500",
    category: "mindfulness",
  },
  {
    id: "mindful-breathing",
    title: "Mindful Breathing",
    description: "Focus on the present moment through breath",
    duration: "7 min",
    icon: Heart,
    gradient: "from-pink-400 to-fuchsia-500",
    category: "mindfulness",
  },
];

export function Interventions() {
  const [riskLevel, setRiskLevel] = useState<"low" | "moderate" | "high" | "critical">("low");
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);
  const [activeIntervention, setActiveIntervention] = useState<Intervention | null>(null);

  useEffect(() => {
    const logs = getMoodLogs();
    const entries = getVoiceEntries();

    if (logs.length > 0) {
      const analysis = analyzeBurnout(logs, entries);
      setRiskLevel(analysis.risk);

      // Recommend interventions based on risk level
      if (analysis.risk === "critical") {
        setRecommendedIds(["breathing", "cognitive-reframing", "microbreak", "body-scan"]);
      } else if (analysis.risk === "high") {
        setRecommendedIds(["breathing", "thought-record", "walking-break"]);
      } else if (analysis.risk === "moderate") {
        setRecommendedIds(["box-breathing", "microbreak", "mindful-breathing"]);
      } else {
        setRecommendedIds(["walking-break", "body-scan"]);
      }
    }
  }, []);

  const getRiskColorScheme = () => {
    switch (riskLevel) {
      case "low":
        return {
          gradient: "from-emerald-400 to-teal-500",
          bg: "from-emerald-50 to-teal-50",
          text: "text-emerald-700",
          border: "border-emerald-300",
        };
      case "moderate":
        return {
          gradient: "from-yellow-400 to-orange-500",
          bg: "from-yellow-50 to-orange-50",
          text: "text-orange-700",
          border: "border-orange-300",
        };
      case "high":
        return {
          gradient: "from-orange-500 to-red-500",
          bg: "from-orange-50 to-red-50",
          text: "text-red-700",
          border: "border-red-300",
        };
      case "critical":
        return {
          gradient: "from-red-500 to-rose-600",
          bg: "from-red-50 to-rose-50",
          text: "text-red-700",
          border: "border-red-400",
        };
      default:
        return {
          gradient: "from-gray-400 to-gray-500",
          bg: "from-gray-50 to-gray-50",
          text: "text-gray-700",
          border: "border-gray-300",
        };
    }
  };

  const colorScheme = getRiskColorScheme();
  const recommended = interventions.filter((i) => recommendedIds.includes(i.id));
  const other = interventions.filter((i) => !recommendedIds.includes(i.id));

  const getRiskMessage = () => {
    switch (riskLevel) {
      case "critical":
        return "⚠️ High stress detected. Consider these urgent interventions.";
      case "high":
        return "⚡ Elevated stress levels. Take action to prevent burnout.";
      case "moderate":
        return "💡 Moderate stress detected. Proactive care recommended.";
      default:
        return "✨ You're doing well! Maintain your wellness routine.";
    }
  };

  return (
    <div className="min-h-full p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Smart Interventions
          </h1>
          <p className="text-gray-600">AI-powered wellness recommendations</p>
        </motion.div>

        {/* Risk Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`bg-gradient-to-r ${colorScheme.bg} rounded-3xl p-6 border-2 ${colorScheme.border} shadow-xl mb-8`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 bg-gradient-to-r ${colorScheme.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Current Status
              </h2>
              <p className={`text-sm font-semibold capitalize ${colorScheme.text}`}>
                {riskLevel} Risk
              </p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">{getRiskMessage()}</p>
        </motion.div>

        {/* Recommended Interventions */}
        {recommended.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              🎯 Recommended for You
            </h2>
            <div className="grid gap-4">
              {recommended.map((intervention, idx) => (
                <InterventionCard
                  key={intervention.id}
                  intervention={intervention}
                  delay={idx * 0.1}
                  priority
                  onClick={() => setActiveIntervention(intervention)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Interventions */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            All Interventions
          </h2>
          <div className="grid gap-4">
            {other.map((intervention, idx) => (
              <InterventionCard
                key={intervention.id}
                intervention={intervention}
                delay={recommended.length * 0.1 + idx * 0.1}
                onClick={() => setActiveIntervention(intervention)}
              />
            ))}
          </div>
        </div>

        {/* Crisis Helpline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-3xl"
        >
          <h3 className="text-lg font-bold text-red-800 mb-2">
            Need Immediate Help?
          </h3>
          <p className="text-sm text-red-700 mb-3">
            If you're experiencing a mental health crisis, please reach out:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-red-800">
                National Crisis Hotline:
              </span>
              <a
                href="tel:988"
                className="text-red-600 font-bold hover:underline"
              >
                988
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-red-800">Crisis Text Line:</span>
              <span className="text-red-600 font-bold">Text HOME to 741741</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Active Intervention Session */}
      {activeIntervention && (
        <InterventionSession
          intervention={activeIntervention}
          onClose={() => setActiveIntervention(null)}
        />
      )}
    </div>
  );
}

function InterventionCard({
  intervention,
  delay,
  priority,
  onClick,
}: {
  intervention: Intervention;
  delay: number;
  priority?: boolean;
  onClick?: () => void;
}) {
  const Icon = intervention.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white/60 backdrop-blur-lg rounded-2xl p-5 border ${
        priority ? "border-violet-300 ring-2 ring-violet-200" : "border-violet-200/50"
      } shadow-lg hover:shadow-xl transition-all cursor-pointer group`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 bg-gradient-to-r ${intervention.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-violet-700 transition-colors">
                {intervention.title}
              </h3>
              <p className="text-xs text-violet-600 font-semibold uppercase tracking-wide">
                {intervention.category}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-600">
                {intervention.duration}
              </span>
              <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                <Play className="w-4 h-4 text-violet-600" />
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {intervention.description}
          </p>
        </div>
      </div>
      {priority && (
        <div className="mt-3 px-3 py-1 bg-gradient-to-r from-violet-100 to-purple-100 rounded-lg inline-block">
          <span className="text-xs font-semibold text-violet-700">
            ⭐ Recommended for your current state
          </span>
        </div>
      )}
    </motion.div>
  );
}