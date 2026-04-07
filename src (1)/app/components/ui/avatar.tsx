import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface InterventionSessionProps {
  intervention: any;
  onClose: () => void;
}

export function InterventionSession({ intervention, onClose }: InterventionSessionProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [phase, setPhase] = useState("");
  const [instruction, setInstruction] = useState("");

  useEffect(() => {
    // Initialize based on intervention type
    const duration = parseInt(intervention.duration) * 60; // Convert to seconds
    setTotalTime(duration);
    setTimeLeft(duration);

    if (intervention.id === "breathing" || intervention.id === "box-breathing") {
      setPhase("Ready");
      setInstruction("Click Play to begin");
    } else {
      setPhase("Ready");
      setInstruction("Click Play to start");
    }
  }, [intervention]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          setPhase("Complete");
          setInstruction("Great job! Session complete.");
          toast.success("Session completed!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Breathing exercise logic
  useEffect(() => {
    if (!isActive) return;

    if (intervention.id === "breathing") {
      // 4-7-8 Breathing
      const cycleTime = 19; // 4 + 7 + 8
      const elapsed = totalTime - timeLeft;
      const position = elapsed % cycleTime;

      if (position < 4) {
        setPhase("Breathe In");
        setInstruction("Inhale through your nose for 4 seconds");
      } else if (position < 11) {
        setPhase("Hold");
        setInstruction("Hold your breath for 7 seconds");
      } else {
        setPhase("Breathe Out");
        setInstruction("Exhale slowly through your mouth for 8 seconds");
      }
    } else if (intervention.id === "box-breathing") {
      // Box Breathing: 4-4-4-4
      const cycleTime = 16;
      const elapsed = totalTime - timeLeft;
      const position = elapsed % cycleTime;

      if (position < 4) {
        setPhase("Breathe In");
        setInstruction("Inhale for 4 seconds");
      } else if (position < 8) {
        setPhase("Hold");
        setInstruction("Hold for 4 seconds");
      } else if (position < 12) {
        setPhase("Breathe Out");
        setInstruction("Exhale for 4 seconds");
      } else {
        setPhase("Hold");
        setInstruction("Hold for 4 seconds");
      }
    } else if (intervention.category === "cbt") {
      const progress = ((totalTime - timeLeft) / totalTime) * 100;
      
      if (progress < 25) {
        setPhase("Identify");
        setInstruction("Identify the negative thought or situation");
      } else if (progress < 50) {
        setPhase("Examine");
        setInstruction("Examine the evidence for and against this thought");
      } else if (progress < 75) {
        setPhase("Reframe");
        setInstruction("Reframe with a more balanced perspective");
      } else {
        setPhase("Practice");
        setInstruction("Practice applying this new perspective");
      }
    } else if (intervention.category === "mindfulness") {
      const progress = ((totalTime - timeLeft) / totalTime) * 100;
      
      if (progress < 20) {
        setPhase("Settle");
        setInstruction("Find a comfortable position and close your eyes");
      } else if (progress < 40) {
        setPhase("Focus");
        setInstruction("Focus on your breath, notice each inhale and exhale");
      } else if (progress < 60) {
        setPhase("Observe");
        setInstruction("Observe thoughts without judgment, let them pass");
      } else if (progress < 80) {
        setPhase("Scan");
        setInstruction("Scan your body from head to toe, releasing tension");
      } else {
        setPhase("Return");
        setInstruction("Gently bring your awareness back to the present");
      }
    } else if (intervention.category === "break") {
      const progress = ((totalTime - timeLeft) / totalTime) * 100;
      
      if (progress < 33) {
        setPhase("Step Away");
        setInstruction("Step away from your work area");
      } else if (progress < 66) {
        setPhase("Move");
        setInstruction("Stretch or take a short walk");
      } else {
        setPhase("Refresh");
        setInstruction("Drink water and prepare to return refreshed");
      }
    }
  }, [isActive, timeLeft, totalTime, intervention]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(totalTime);
    setPhase("Ready");
    setInstruction("Click Play to begin");
  };

  const getPhaseColor = () => {
    if (phase === "Breathe In" || phase === "Inhale") return "from-blue-400 to-cyan-500";
    if (phase === "Breathe Out" || phase === "Exhale") return "from-green-400 to-emerald-500";
    if (phase === "Hold") return "from-purple-400 to-pink-500";
    if (phase === "Complete") return "from-emerald-400 to-teal-500";
    return "from-violet-400 to-purple-500";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${intervention.gradient} p-6 text-white`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{intervention.title}</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white/90">{intervention.description}</p>
          </div>

          {/* Timer Display */}
          <div className="p-8">
            <div className="text-center mb-8">
              <motion.div
                animate={{
                  scale: isActive && (phase === "Breathe In" || phase === "Inhale") ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 4,
                  repeat: isActive && (phase === "Breathe In" || phase === "Inhale") ? Infinity : 0,
                  ease: "easeInOut",
                }}
                className={`w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center shadow-2xl relative overflow-hidden`}
              >
                {/* Animated ring for breathing */}
                {isActive && (phase === "Breathe In" || phase === "Breathe Out") && (
                  <motion.div
                    animate={{
                      scale: phase === "Breathe In" ? [0.8, 1.2] : [1.2, 0.8],
                      opacity: [0.5, 0],
                    }}
                    transition={{
                      duration: phase === "Breathe In" ? 4 : 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 border-4 border-white rounded-full"
                  />
                )}
                
                <div className="text-center z-10">
                  <div className="text-5xl font-bold text-white mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-white/80 text-sm font-semibold">
                    {phase}
                  </div>
                </div>
              </motion.div>

              <motion.p
                key={instruction}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg text-gray-700 font-medium mb-6 min-h-[3rem]"
              >
                {instruction}
              </motion.p>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((totalTime - timeLeft) / totalTime) * 100}%` }}
                  className={`h-full bg-gradient-to-r ${intervention.gradient}`}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : `bg-gradient-to-r ${intervention.gradient} text-white hover:shadow-lg`
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    {timeLeft === totalTime ? "Start" : "Resume"}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
