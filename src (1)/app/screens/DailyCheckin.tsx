import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Smile, Frown, Meh, Laugh, Angry, Moon, Battery, Zap, Dumbbell, Users, Briefcase, Mic } from "lucide-react";
import { saveMoodLog } from "../utils/storage";
import { toast } from "sonner";

const moodOptions = [
  { value: 1, label: "Terrible", icon: Angry, color: "from-red-400 to-rose-500" },
  { value: 2, label: "Bad", icon: Frown, color: "from-orange-400 to-red-400" },
  { value: 3, label: "Okay", icon: Meh, color: "from-yellow-400 to-orange-400" },
  { value: 4, label: "Good", icon: Smile, color: "from-green-400 to-emerald-500" },
  { value: 5, label: "Excellent", icon: Laugh, color: "from-emerald-400 to-teal-500" },
];

const energyOptions = [
  { value: 1, label: "Exhausted" },
  { value: 2, label: "Low" },
  { value: 3, label: "Moderate" },
  { value: 4, label: "High" },
  { value: 5, label: "Energized" },
];

const stressOptions = [
  { value: 1, label: "Very Low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Moderate" },
  { value: 4, label: "High" },
  { value: 5, label: "Extreme" },
];

const activityOptions = [
  { value: "none", label: "No Exercise", icon: Battery },
  { value: "light", label: "Light Activity", icon: Dumbbell },
  { value: "moderate", label: "Moderate Exercise", icon: Dumbbell },
  { value: "intense", label: "Intense Workout", icon: Zap },
];

const socialOptions = [
  { value: 1, label: "Very Isolated" },
  { value: 2, label: "Little Interaction" },
  { value: 3, label: "Some Interaction" },
  { value: 4, label: "Good Socializing" },
  { value: 5, label: "Very Social" },
];

const workOptions = [
  { value: 1, label: "Very Low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Moderate" },
  { value: 4, label: "High" },
  { value: 5, label: "Overwhelming" },
];

export function DailyCheckin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<number | null>(null);
  const [sleep, setSleep] = useState(7);
  const [energy, setEnergy] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);
  const [activity, setActivity] = useState<string>("none");
  const [social, setSocial] = useState<number | null>(null);
  const [workload, setWorkload] = useState<number | null>(null);
  const [description, setDescription] = useState("");

  const totalSteps = 7;

  const handleNext = () => {
    if (step === 1 && !mood) {
      toast.error("Please select your mood");
      return;
    }
    if (step === 3 && !energy) {
      toast.error("Please select your energy level");
      return;
    }
    if (step === 4 && !stress) {
      toast.error("Please select your stress level");
      return;
    }
    if (step === 6 && !social) {
      toast.error("Please rate your social interaction");
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = () => {
    if (!mood) {
      toast.error("Please complete all required fields");
      return;
    }

    const log = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      mood,
      moodLabel: moodOptions[mood - 1].label,
      sleep,
      energy: energy || 3,
      stress: stress || 3,
      activity,
      social: social || 3,
      workload: workload || 3,
      description,
      timestamp: Date.now(),
    };

    saveMoodLog(log);
    toast.success("Check-in saved successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-full p-6 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Daily Check-in
          </h1>
          <p className="text-gray-600">Complete wellness assessment</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i + 1 <= step ? "w-8 bg-gradient-to-r from-violet-500 to-purple-500" : "w-6 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Mood */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-violet-200/50 shadow-xl mb-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  How's your mood?
                </h2>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {moodOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = mood === option.value;

                  return (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMood(option.value)}
                      className="relative"
                    >
                      <div
                        className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                          isSelected
                            ? `bg-gradient-to-br ${option.color} shadow-lg scale-110`
                            : "bg-white border-2 border-gray-200 hover:border-violet-300"
                        }`}
                      >
                        <Icon
                          className={`w-8 h-8 ${
                            isSelected ? "text-white" : "text-gray-600"
                          }`}
                        />
                      </div>
                      <p
                        className={`text-xs font-medium mt-1 text-center ${
                          isSelected ? "text-violet-700" : "text-gray-600"
                        }`}
                      >
                        {option.label}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!mood}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl py-4 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </motion.div>
        )}

        {/* Step 2: Sleep */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-violet-200/50 shadow-xl mb-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Hours of sleep?
                </h2>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <Moon className="w-12 h-12 text-violet-600" />
                  <span className="text-5xl font-bold text-violet-700 ml-4">
                    {sleep.toFixed(1)}
                  </span>
                  <span className="text-2xl text-gray-600 ml-2">hrs</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={sleep}
                  onChange={(e) => setSleep(parseFloat(e.target.value))}
                  className="w-full h-3 bg-violet-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-violet-500 [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                />

                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>0h</span>
                  <span>12h</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-white border-2 border-violet-300 text-violet-700 rounded-2xl py-4 font-semibold hover:bg-violet-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl py-4 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Energy Level */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-violet-200/50 shadow-xl mb-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Energy Level?
                </h2>
              </div>

              <div className="space-y-3">
                {energyOptions.map((option) => {
                  const isSelected = energy === option.value;

                  return (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEnergy(option.value)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "border-violet-500 bg-violet-50"
                          : "border-gray-200 bg-white hover:border-violet-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-semibold ${
                            isSelected ? "text-violet-700" : "text-gray-700"
                          }`}
                        >
                          {option.label}
                        </span>
                        <div className="flex gap-1">
                          {Array.from({ length: option.value }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-6 rounded ${
                                isSelected ? "bg-violet-500" : "bg-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-white border-2 border-violet-300 text-violet-700 rounded-2xl py-4 font-semibold hover:bg-violet-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!energy}
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl py-4 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Stress Level */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-violet-200/50 shadow-xl mb-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  4
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Stress Level?
                </h2>
              </div>

              <div className="space-y-3">
                {stressOptions.map((option) => {
                  const isSelected = stress === option.value;

                  return (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStress(option.value)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "border-violet-500 bg-violet-50"
                          : "border-gray-200 bg-white hover:border-violet-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-semibold ${
                            isSelected ? "text-violet-700" : "text-gray-700"
                          }`}
                        >
                          {option.label}
                        </span>
                        <div className="flex gap-1">
                          {Array.from({ length: option.value }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-6 rounded ${
                                isSelected
                                  ? option.value >= 4
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                                  : "bg-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-white border-2 border-violet-300 text-violet-700 rounded-2xl py-4 font-semibold hover:bg-violet-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!stress}
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl py-4 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Physical Activity */}
        {step === 5 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-violet-200/50 shadow-xl mb-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  5
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Physical Activity?
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {activityOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = activity === option.value;

                  return (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActivity(option.value)}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "border-violet-500 bg-violet-50"
                          : "border-gray-200 bg-white hover:border-violet-300"
                      }`}
                    >
                      <Icon
                        className={`w-10 h-10 mx-auto mb-3 ${
                          isSelected ? "text-violet-600" : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`text-sm font-semibold text-center ${
                          isSelected ? "text-violet-700" : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(4)}
                className="flex-1 bg-white border-2 border-violet-300 text-violet-700 rounded-2xl py-4 font-semibold hover:bg-violet-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl py-4 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 6: Social Interaction */}
        {step === 6 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-violet-200/50 shadow-xl mb-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  6
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Social Interaction?
                </h2>
              </div>

              <div className="space-y-3">
                {socialOptions.map((option) => {
                  const isSelected = social === option.value;

                  return (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSocial(option.value)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "border-violet-500 bg-violet-50"
                          : "border-gray-200 bg-white hover:border-violet-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-semibold ${
                            isSelected ? "text-violet-700" : "text-gray-700"
                          }`}
                        >
                          {option.label}
                        </span>
                        <Users
                          className={`w-5 h-5 ${
                            isSelected ? "text-violet-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(5)}
                className="flex-1 bg-white border-2 border-violet-300 text-violet-700 rounded-2xl py-4 font-semibold hover:bg-violet-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!social}
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl py-4 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 7: Notes */}
        {step === 7 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-violet-200/50 shadow-xl mb-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  7
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Additional Notes
                </h2>
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's on your mind? (optional)"
                className="w-full h-32 p-4 bg-white border-2 border-violet-200 rounded-2xl resize-none focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(6)}
                className="flex-1 bg-white border-2 border-violet-300 text-violet-700 rounded-2xl py-4 font-semibold hover:bg-violet-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl py-4 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Complete
              </button>
            </div>
          </motion.div>
        )}

        {/* Floating Microphone Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/journal")}
          className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center z-50"
        >
          <Mic className="w-7 h-7 text-white" />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          />
        </motion.button>
      </div>
    </div>
  );
}
