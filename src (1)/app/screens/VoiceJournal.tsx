import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Play, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import {
  saveVoiceEntry,
  getVoiceEntries,
} from "../utils/storage";
import { toast } from "sonner";
import Sentiment from "sentiment";

const sentiment = new Sentiment();

export function VoiceJournal() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const entries = getVoiceEntries().reverse();

  const sampleTranscripts = [
    "Today was really challenging. Work has been piling up and I feel like I can't catch a break. Need to find better ways to manage stress and prioritize self-care.",
    
    "Feeling anxious about the upcoming deadline. My sleep hasn't been great and I'm noticing it affecting my mood and productivity throughout the day.",

    "Work-life balance is becoming difficult. Need to set better boundaries and make time for activities that bring me joy and help me recharge.",
  ];

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);

    // Simulate 15-second recording
    const interval = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 15) {
          clearInterval(interval);
          stopRecording();
          return 15;
        }
        return prev + 0.1;
      });
    }, 100);
  };

  const stopRecording = () => {
    setIsRecording(false);

    // Simulate transcription with sample text
    const randomTranscript =
      sampleTranscripts[
        Math.floor(Math.random() * sampleTranscripts.length)
      ];
    setTranscript(randomTranscript);
    setShowTranscript(true);
  };

  const saveEntry = () => {
    if (!transcript) return;

    // Perform sentiment analysis
    const analysis = sentiment.analyze(transcript);
    const normalizedSentiment = Math.max(
      -1,
      Math.min(1, analysis.score / 10),
    );

    // Extract keywords
    const keywords =
      transcript
        .toLowerCase()
        .match(
          /\b(stress|work|anxious|grateful|mindfulness|burnout|overwhelm|happy|sad|tired|energy)\w*/g,
        ) || [];

    const entry = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      duration: 15,
      transcript,
      sentiment: normalizedSentiment,
      keywords: [...new Set(keywords)],
      timestamp: Date.now(),
    };

    saveVoiceEntry(entry);
    toast.success("Voice journal saved!");
    setShowTranscript(false);
    setTranscript("");
    navigate("/dashboard");
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.3)
      return {
        label: "Positive",
        emoji: "😊",
        color: "from-green-400 to-emerald-500",
      };
    if (score < -0.3)
      return {
        label: "Negative",
        emoji: "😔",
        color: "from-red-400 to-rose-500",
      };
    return {
      label: "Neutral",
      emoji: "😐",
      color: "from-yellow-400 to-orange-400",
    };
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
            Voice Journal
          </h1>
          <p className="text-gray-600">
            Record your thoughts in 15 seconds
          </p>
        </motion.div>

        {/* Recording Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-violet-200/50 shadow-xl mb-8"
        >
          <div className="flex flex-col items-center">
            {/* Recording Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={
                isRecording ? stopRecording : startRecording
              }
              className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 relative ${
                isRecording
                  ? "bg-gradient-to-r from-red-500 to-rose-600"
                  : "bg-gradient-to-r from-purple-500 to-pink-500"
              } shadow-2xl`}
            >
              {isRecording ? (
                <MicOff className="w-12 h-12 text-white" />
              ) : (
                <Mic className="w-12 h-12 text-white" />
              )}

              {/* Pulsing animation */}
              {isRecording && (
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-red-500 rounded-full"
                />
              )}
            </motion.button>

            {/* Timer */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-4"
              >
                <div className="text-4xl font-bold text-violet-700">
                  {recordingTime.toFixed(1)}s
                </div>
                <div className="text-sm text-gray-600">
                  of 15 seconds
                </div>
              </motion.div>
            )}

            {/* Progress Bar */}
            {isRecording && (
              <div className="w-full max-w-xs h-2 bg-violet-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(recordingTime / 15) * 100}%`,
                  }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                />
              </div>
            )}

            {!isRecording && !showTranscript && (
              <p className="text-gray-600 text-center">
                Tap to start recording
              </p>
            )}
          </div>
        </motion.div>

        {/* Transcript & Analysis */}
        <AnimatePresence>
          {showTranscript && transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-violet-200/50 shadow-xl mb-8"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Transcription & Analysis
              </h3>

              <div className="bg-white/80 rounded-2xl p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {transcript}
                </p>
              </div>

              {/* Sentiment Badge */}
              {(() => {
                const analysis = sentiment.analyze(transcript);
                const normalizedSentiment = Math.max(
                  -1,
                  Math.min(1, analysis.score / 10),
                );
                const sentimentData = getSentimentLabel(
                  normalizedSentiment,
                );

                return (
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`px-4 py-2 bg-gradient-to-r ${sentimentData.color} rounded-xl text-white font-semibold flex items-center gap-2`}
                    >
                      <span>{sentimentData.emoji}</span>
                      <span>{sentimentData.label}</span>
                      <span className="text-sm opacity-90">
                        (
                        {(normalizedSentiment > 0 ? "+" : "") +
                          normalizedSentiment.toFixed(2)}
                        )
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Keywords */}
              {(() => {
                const keywords =
                  transcript
                    .toLowerCase()
                    .match(
                      /\b(stress|work|anxious|grateful|mindfulness|burnout|overwhelm|happy|sad|tired|energy)\w*/g,
                    ) || [];

                if (keywords.length > 0) {
                  return (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Key Themes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {[...new Set(keywords)].map(
                          (keyword, idx) => (
                            <motion.span
                              key={idx}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.1 }}
                              className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium"
                            >
                              {keyword}
                            </motion.span>
                          ),
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowTranscript(false);
                    setTranscript("");
                  }}
                  className="flex-1 bg-white border-2 border-violet-300 text-violet-700 rounded-2xl py-3 font-semibold hover:bg-violet-50 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Discard
                </button>
                <button
                  onClick={saveEntry}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Save Entry
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Previous Entries */}
        {entries.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Recent Entries
            </h2>
            <div className="space-y-3">
              {entries.slice(0, 5).map((entry, idx) => {
                const sentimentData = getSentimentLabel(
                  entry.sentiment,
                );

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 border border-violet-200/50 shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                          <Play className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">
                            {new Date(
                              entry.timestamp,
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-600">
                            {entry.duration}s recording
                          </div>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 bg-gradient-to-r ${sentimentData.color} rounded-lg text-white text-xs font-semibold`}
                      >
                        {sentimentData.emoji}{" "}
                        {sentimentData.label}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {entry.transcript}
                    </p>
                    {entry.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.keywords
                          .slice(0, 3)
                          .map((keyword, kidx) => (
                            <span
                              key={kidx}
                              className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-xs"
                            >
                              {keyword}
                            </span>
                          ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}