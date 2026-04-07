import { motion, AnimatePresence } from "motion/react";
import { X, Check } from "lucide-react";
import { AvatarConfig } from "../utils/storage";
import { AvatarDisplay } from "./AvatarDisplay";

interface AvatarCustomizerProps {
  avatar: AvatarConfig;
  onChange: (avatar: AvatarConfig) => void;
  onClose: () => void;
}

export function AvatarCustomizer({
  avatar,
  onChange,
  onClose,
}: AvatarCustomizerProps) {
  const categories = [
    {
      name: "Skin Tone",
      key: "skinTone" as keyof AvatarConfig,
      options: [
        { value: "light", color: "#FFE0BD", label: "Light" },
        { value: "medium", color: "#D4A373", label: "Medium" },
        { value: "tan", color: "#C68642", label: "Tan" },
        { value: "dark", color: "#8D5524", label: "Dark" },
      ],
    },
    {
      name: "Hairstyle",
      key: "hairstyle" as keyof AvatarConfig,
      options: [
        { value: "short", label: "Short" },
        { value: "long", label: "Long" },
        { value: "curly", label: "Curly" },
        { value: "bun", label: "Bun" },
        { value: "bald", label: "Bald" },
      ],
    },
    {
      name: "Hair Color",
      key: "hairColor" as keyof AvatarConfig,
      options: [
        { value: "black", color: "#2C2C2C", label: "Black" },
        { value: "brown", color: "#8B4513", label: "Brown" },
        { value: "blonde", color: "#F4D03F", label: "Blonde" },
        { value: "red", color: "#DC143C", label: "Red" },
        { value: "purple", color: "#9B59B6", label: "Purple" },
      ],
    },
    {
      name: "Eyes",
      key: "eyes" as keyof AvatarConfig,
      options: [
        { value: "happy", label: "Happy" },
        { value: "sleepy", label: "Sleepy" },
        { value: "excited", label: "Excited" },
        { value: "neutral", label: "Neutral" },
      ],
    },
    {
      name: "Eye Color",
      key: "eyeColor" as keyof AvatarConfig,
      options: [
        { value: "brown", color: "#8B4513", label: "Brown" },
        { value: "blue", color: "#4169E1", label: "Blue" },
        { value: "green", color: "#228B22", label: "Green" },
        { value: "hazel", color: "#B8860B", label: "Hazel" },
      ],
    },
    {
      name: "Mouth",
      key: "mouth" as keyof AvatarConfig,
      options: [
        { value: "smile", label: "Smile" },
        { value: "grin", label: "Grin" },
        { value: "neutral", label: "Neutral" },
        { value: "surprised", label: "Surprised" },
      ],
    },
    {
      name: "Outfit",
      key: "outfit" as keyof AvatarConfig,
      options: [
        { value: "casual", label: "Casual" },
        { value: "formal", label: "Formal" },
        { value: "sporty", label: "Sporty" },
        { value: "cozy", label: "Cozy" },
      ],
    },
    {
      name: "Outfit Color",
      key: "outfitColor" as keyof AvatarConfig,
      options: [
        { value: "blue", color: "#3B82F6", label: "Blue" },
        { value: "purple", color: "#8B5CF6", label: "Purple" },
        { value: "pink", color: "#EC4899", label: "Pink" },
        { value: "green", color: "#10B981", label: "Green" },
        { value: "gray", color: "#6B7280", label: "Gray" },
      ],
    },
    {
      name: "Accessory",
      key: "accessory" as keyof AvatarConfig,
      options: [
        { value: "none", label: "None" },
        { value: "glasses", label: "Glasses" },
        { value: "sunglasses", label: "Sunglasses" },
        { value: "earrings", label: "Earrings" },
      ],
    },
  ];

  const updateAvatar = (key: keyof AvatarConfig, value: string) => {
  const updatedAvatar = { ...avatar, [key]: value };

  onChange(updatedAvatar);

  // 🔥 ADD THIS LINE (THIS IS THE MAGIC)
  localStorage.setItem("avatar", JSON.stringify(updatedAvatar));
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
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Customize Avatar</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Avatar Preview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex justify-center">
              <AvatarDisplay avatar={avatar} size="large" />
            </div>
          </div>

          {/* Customization Options */}
          <div className="p-6 overflow-y-auto max-h-[50vh]">
            {categories.map((category) => (
              <div key={category.name} className="mb-6 last:mb-0">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.options.map((option) => {
                    const isSelected = avatar[category.key] === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() => updateAvatar(category.key, option.value)}
                        className={`px-4 py-2 rounded-xl border-2 transition-all relative ${
                          isSelected
                            ? "border-violet-500 bg-violet-50"
                            : "border-gray-200 bg-white hover:border-violet-300"
                        }`}
                      >
                        {option.color && (
                          <div
                            className="w-6 h-6 rounded-full mr-2 inline-block border-2 border-white shadow-sm"
                            style={{ backgroundColor: option.color }}
                          />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            isSelected ? "text-violet-700" : "text-gray-700"
                          }`}
                        >
                          {option.label}
                        </span>
                        {isSelected && (
                          <motion.div
                            layoutId={`check-${category.key}`}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl py-3 font-semibold hover:shadow-lg transition-all"
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
