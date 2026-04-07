import { AvatarConfig } from "../utils/storage";

interface AvatarDisplayProps {
  avatar: AvatarConfig;
  size?: "small" | "medium" | "large";
}

export function AvatarDisplay({ avatar, size = "medium" }: AvatarDisplayProps) {
  const sizeMap = {
    small: { container: "w-10 h-10", face: "w-10 h-10", feature: 0.5 },
    medium: { container: "w-16 h-16", face: "w-16 h-16", feature: 0.65 },
    large: { container: "w-32 h-32", face: "w-32 h-32", feature: 1 },
  };

  const dimensions = sizeMap[size];

  const getSkinColor = () => {
    const colors = {
      light: "#FFE0BD",
      medium: "#D4A373",
      tan: "#C68642",
      dark: "#8D5524",
    };
    return colors[avatar.skinTone as keyof typeof colors] || colors.light;
  };

  const getHairColor = () => {
    const colors = {
      black: "#2C2C2C",
      brown: "#8B4513",
      blonde: "#F4D03F",
      red: "#DC143C",
      purple: "#9B59B6",
    };
    return colors[avatar.hairColor as keyof typeof colors] || colors.black;
  };

  const getEyeColor = () => {
    const colors = {
      brown: "#8B4513",
      blue: "#4169E1",
      green: "#228B22",
      hazel: "#B8860B",
    };
    return colors[avatar.eyeColor as keyof typeof colors] || colors.brown;
  };

  const getOutfitColor = () => {
    const colors = {
      blue: "#3B82F6",
      purple: "#8B5CF6",
      pink: "#EC4899",
      green: "#10B981",
      gray: "#6B7280",
    };
    return colors[avatar.outfitColor as keyof typeof colors] || colors.blue;
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className={dimensions.container}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outfit/Body */}
      <path
        d="M 30 70 Q 30 90 50 95 Q 70 90 70 70 L 70 55 L 30 55 Z"
        fill={getOutfitColor()}
        opacity="0.9"
      />

      {/* Head */}
      <circle cx="50" cy="40" r="22" fill={getSkinColor()} />

      {/* Hair */}
      {avatar.hairstyle === "short" && (
        <path
          d="M 28 35 Q 28 18 50 18 Q 72 18 72 35"
          fill={getHairColor()}
        />
      )}
      {avatar.hairstyle === "long" && (
        <>
          <path
            d="M 28 35 Q 28 18 50 18 Q 72 18 72 35"
            fill={getHairColor()}
          />
          <path
            d="M 30 40 Q 25 60 28 70 M 70 40 Q 75 60 72 70"
            stroke={getHairColor()}
            strokeWidth="6"
            fill="none"
          />
        </>
      )}
      {avatar.hairstyle === "curly" && (
        <>
          <circle cx="35" cy="25" r="8" fill={getHairColor()} />
          <circle cx="50" cy="20" r="8" fill={getHairColor()} />
          <circle cx="65" cy="25" r="8" fill={getHairColor()} />
        </>
      )}
      {avatar.hairstyle === "bun" && (
        <>
          <path
            d="M 28 35 Q 28 25 50 25 Q 72 25 72 35"
            fill={getHairColor()}
          />
          <circle cx="50" cy="20" r="6" fill={getHairColor()} />
        </>
      )}

      {/* Eyes */}
      {avatar.eyes === "happy" && (
        <>
          <circle cx="42" cy="38" r="3" fill={getEyeColor()} />
          <circle cx="58" cy="38" r="3" fill={getEyeColor()} />
          <path d="M 38 35 Q 42 33 46 35" stroke="#000" strokeWidth="1" fill="none" />
          <path d="M 54 35 Q 58 33 62 35" stroke="#000" strokeWidth="1" fill="none" />
        </>
      )}
      {avatar.eyes === "sleepy" && (
        <>
          <path d="M 38 38 L 46 38" stroke={getEyeColor()} strokeWidth="2" strokeLinecap="round" />
          <path d="M 54 38 L 62 38" stroke={getEyeColor()} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {avatar.eyes === "excited" && (
        <>
          <circle cx="42" cy="38" r="4" fill={getEyeColor()} />
          <circle cx="58" cy="38" r="4" fill={getEyeColor()} />
          <circle cx="42" cy="37" r="1.5" fill="#fff" />
          <circle cx="58" cy="37" r="1.5" fill="#fff" />
        </>
      )}
      {avatar.eyes === "neutral" && (
        <>
          <circle cx="42" cy="38" r="2.5" fill={getEyeColor()} />
          <circle cx="58" cy="38" r="2.5" fill={getEyeColor()} />
        </>
      )}

      {/* Mouth */}
      {avatar.mouth === "smile" && (
        <path d="M 40 48 Q 50 52 60 48" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}
      {avatar.mouth === "grin" && (
        <path d="M 40 48 Q 50 54 60 48" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {avatar.mouth === "neutral" && (
        <line x1="42" y1="50" x2="58" y2="50" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
      )}
      {avatar.mouth === "surprised" && (
        <ellipse cx="50" cy="50" rx="4" ry="6" fill="#000" opacity="0.7" />
      )}

      {/* Accessories */}
      {avatar.accessory === "glasses" && (
        <>
          <circle cx="42" cy="38" r="6" fill="none" stroke="#333" strokeWidth="1.5" />
          <circle cx="58" cy="38" r="6" fill="none" stroke="#333" strokeWidth="1.5" />
          <line x1="48" y1="38" x2="52" y2="38" stroke="#333" strokeWidth="1.5" />
        </>
      )}
      {avatar.accessory === "sunglasses" && (
        <>
          <rect x="36" y="35" width="12" height="6" rx="3" fill="#1a1a1a" opacity="0.8" />
          <rect x="52" y="35" width="12" height="6" rx="3" fill="#1a1a1a" opacity="0.8" />
          <line x1="48" y1="38" x2="52" y2="38" stroke="#1a1a1a" strokeWidth="1.5" />
        </>
      )}
      {avatar.accessory === "earrings" && (
        <>
          <circle cx="30" cy="45" r="2.5" fill="#FFD700" />
          <circle cx="70" cy="45" r="2.5" fill="#FFD700" />
        </>
      )}
    </svg>
  );
}
