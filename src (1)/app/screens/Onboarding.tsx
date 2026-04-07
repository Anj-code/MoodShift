import { motion } from "motion/react";
import { Brain, Heart, Activity, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { setOnboardingComplete } from "../utils/storage";

export function Onboarding() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setOnboardingComplete(true);
    navigate("/dashboard");
  };

  const features = [
    {
      icon: Brain,
      title: "AI Burnout Prediction",
      description: "Predicts burnout 72 hours early using ML",
      gradient: "from-violet-400 to-purple-500",
    },
    {
      icon: Heart,
      title: "Mood & Sleep Tracking",
      description: "Daily check-ins to monitor your wellbeing",
      gradient: "from-pink-400 to-rose-500",
    },
    {
      icon: Activity,
      title: "Voice Journaling",
      description: "15-second entries with sentiment analysis",
      gradient: "from-blue-400 to-cyan-500",
    },
    {
      icon: Shield,
      title: "Smart Interventions",
      description: "CBT, mindfulness & breathing exercises",
      gradient: "from-emerald-400 to-teal-500",
    },
  ];

  return (
    <div className="size-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-300/30 to-purple-300/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/50">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            MoodShift
          </h1>
          <p className="text-lg text-gray-600">
            Your AI-powered mental wellness companion
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-2 gap-4 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/60 backdrop-blur-lg rounded-3xl p-5 border border-violet-200/50 shadow-lg hover:shadow-xl transition-all"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-3 shadow-lg`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGetStarted}
          className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white rounded-2xl py-4 px-6 font-semibold text-lg shadow-2xl shadow-violet-500/50 hover:shadow-3xl transition-all flex items-center justify-center gap-3 group"
        >
          Get Started
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          Your mental health journey starts here 🌟
        </motion.p>
      </div>
    </div>
  );
}
