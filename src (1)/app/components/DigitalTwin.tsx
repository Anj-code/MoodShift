import { motion } from "motion/react";
import { AvatarDisplay } from "./AvatarDisplay";
import { AvatarConfig } from "../utils/storage";

interface DigitalTwinProps {
  avatar: AvatarConfig;
  burnoutLevel: number;
}

function getEmotionFromBurnout(level: number) {
  if (level < 25) {
    return { eyes: "happy", mouth: "smile" };
  }
  if (level < 50) {
    return { eyes: "neutral", mouth: "grin" };
  }
  if (level < 75) {
    return { eyes: "sleepy", mouth: "neutral" };
  }
  return { eyes: "sleepy", mouth: "surprised" };
}

export function DigitalTwin({ avatar, burnoutLevel }: DigitalTwinProps) {
  const emotion = getEmotionFromBurnout(burnoutLevel);

  // Merge user avatar + emotion override
  const dynamicAvatar: AvatarConfig = {
    ...avatar,
    eyes: emotion.eyes,
    mouth: emotion.mouth,
  };

  const getColor = () => {
    if (burnoutLevel < 25) return "#10b981";
    if (burnoutLevel < 50) return "#06b6d4";
    if (burnoutLevel < 75) return "#f59e0b";
    return "#ef4444";
  };

  const color = getColor();

  return (
    <div className="w-full h-full flex items-center justify-center relative">

      {/* Aura */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        className="absolute w-56 h-56 rounded-full blur-3xl"
        style={{ background: `${color}40` }}
      />

      {/* Avatar */}
      <motion.div
        animate={{
          scale: [1, burnoutLevel > 70 ? 0.95 : 1.05, 1],
          y: burnoutLevel > 70 ? [0, 5, 0] : [0, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <AvatarDisplay avatar={dynamicAvatar} size="large" />
      </motion.div>

      {/* Stress particles */}
      {burnoutLevel > 50 &&
        Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * 360) / 6;
          return (
            <motion.div
              key={i}
              animate={{
                scale: [0.5, 1, 0.5],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: color,
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-90px)`,
              }}
            />
          );
        })}

      {/* Label */}
      <div className="absolute bottom-4 text-center">
        <p className="text-sm font-semibold text-gray-700 bg-white/80 px-4 py-1 rounded-full shadow">
          {burnoutLevel < 25 && "Thriving ✨"}
          {burnoutLevel >= 25 && burnoutLevel < 50 && "Stable 🌟"}
          {burnoutLevel >= 50 && burnoutLevel < 75 && "Stressed ⚡"}
          {burnoutLevel >= 75 && "Critical ⚠️"}
        </p>
      </div>
    </div>
  );
}