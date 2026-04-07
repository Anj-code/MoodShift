import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getMoodLogs,
  getVoiceEntries,
  getUserProfile,
  generateDemoData,
  AvatarConfig,
} from "../utils/storage";
import {
  analyzeBurnout,
  calculateBurnoutCoefficient,
} from "../utils/burnout";
import { DigitalTwin } from "../components/DigitalTwin";
import { toast } from "sonner";

export function Dashboard() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);

  // ✅ Avatar state
  const defaultAvatar: AvatarConfig = {
    skinTone: "light",
    hairColor: "black",
    hairstyle: "short",
    eyes: "neutral",
    eyeColor: "brown",
    mouth: "neutral",
    outfit: "casual",
    outfitColor: "blue",
    accessory: "none",
  };

  const [avatar, setAvatar] = useState(defaultAvatar);

  const profile = getUserProfile();

  useEffect(() => {
    loadData();

    // ✅ Load avatar from localStorage
    const stored = localStorage.getItem("avatar");
    if (stored) {
      setAvatar(JSON.parse(stored));
    }
  }, []);

  const loadData = () => {
    const logs = getMoodLogs();
    const entries = getVoiceEntries();

    if (logs.length === 0) {
      setAnalysis({
        coefficient: 0,
        risk: "low",
        trend: "stable",
        primaryStressors: [],
        prediction72h: 0,
      });
      return;
    }

    const burnoutAnalysis = analyzeBurnout(logs, entries);
    setAnalysis(burnoutAnalysis);

    const last7Days = logs.slice(-7);
    const trend = last7Days.map((log, idx) => {
      const entry = entries[entries.length - 7 + idx];
      return {
        date: new Date(log.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        burnout: calculateBurnoutCoefficient(
          log.mood,
          log.sleep,
          entry?.sentiment || 0
        ),
        mood: log.mood * 20,
      };
    });

    setTrendData(trend);
  };

  const handleGenerateDemo = () => {
    generateDemoData();
    loadData();
    toast.success("Demo data generated! Check out your trends.");
  };

  if (!analysis) return null;

  const getRiskColor = () => {
    switch (analysis.risk) {
      case "low":
        return "from-emerald-400 to-teal-500";
      case "moderate":
        return "from-yellow-400 to-orange-500";
      case "high":
        return "from-orange-500 to-red-500";
      case "critical":
        return "from-red-500 to-rose-600";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const getRiskLabel = () => {
    return analysis.risk.charAt(0).toUpperCase() + analysis.risk.slice(1);
  };

  const getTrendIcon = () => {
    switch (analysis.trend) {
      case "improving":
        return <TrendingDown className="w-5 h-5 text-emerald-600" />;
      case "declining":
        return <TrendingUp className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-full p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Mental Wellness Dashboard
          </h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </motion.div>

        {/* ✅ Digital Twin with synced avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-violet-200/50 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-violet-600" />
            <h2 className="text-xl font-bold text-gray-800">Digital Twin</h2>
          </div>

          <div className="h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-100/50 to-blue-100/50">
            <DigitalTwin
              avatar={avatar}
              burnoutLevel={analysis.coefficient}
            />
          </div>

          <p className="text-sm text-gray-600 text-center mt-3">
            Your avatar reflects your current mental state
          </p>
        </motion.div>

        {/* Burnout Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-violet-200/50 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${getRiskColor()} rounded-2xl flex items-center justify-center shadow-lg`}>
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Burnout Coefficient
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {getTrendIcon()}
                  <span className="capitalize">{analysis.trend}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-4xl font-bold bg-gradient-to-r ${getRiskColor()} bg-clip-text text-transparent`}>
                {analysis.coefficient}
              </div>
              <div className="text-sm font-semibold text-gray-600">
                {getRiskLabel()} Risk
              </div>
            </div>
          </div>

          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${analysis.coefficient}%` }}
              transition={{ duration: 1 }}
              className={`h-full bg-gradient-to-r ${getRiskColor()}`}
            />
          </div>

          <div className="mt-4 p-4 bg-violet-50 rounded-2xl">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span className="font-semibold text-violet-700">
                72h Prediction:
              </span>
              <span className="text-gray-700">
                {analysis.prediction72h}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Trend Chart */}
        {trendData.length > 0 && (
          <motion.div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-violet-200/50 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              7-Day Trend
            </h2>

            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="burnout"
                  stroke="#8B5CF6"
                  fill="#C4B5FD"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Demo Button */}
        {trendData.length === 0 && (
          <motion.button
            onClick={handleGenerateDemo}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl py-4 font-semibold"
          >
            Generate Demo Data
          </motion.button>
        )}
      </div>
    </div>
  );
}