import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Calendar,
  Settings,
  Bell,
  Moon,
  Trash2,
  Palette,
  ChevronRight,
  Shield,
} from "lucide-react";
import { getUserProfile, saveUserProfile, clearAllData, AvatarConfig } from "../utils/storage";
import { AvatarDisplay } from "../components/AvatarDisplay";
import { AvatarCustomizer } from "../components/AvatarCustomizer";
import { toast } from "sonner";

const defaultAvatar: AvatarConfig = {
  skinTone: "light",
  hairstyle: "short",
  hairColor: "black",
  eyes: "happy",
  eyeColor: "brown",
  mouth: "smile",
  outfit: "casual",
  outfitColor: "blue",
  accessory: "none",
};

export function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    let userProfile = getUserProfile();
    if (!userProfile) {
      userProfile = {
        name: "Anonymous User",
        email: "user@moodshift.app",
        joinedDate: new Date().toISOString().split("T")[0],
        avatar: defaultAvatar,
      };
      saveUserProfile(userProfile);
    }
    setProfile(userProfile);
  }, []);

  const handleAvatarChange = (newAvatar: AvatarConfig) => {
    const updatedProfile = { ...profile, avatar: newAvatar };
    setProfile(updatedProfile);
    saveUserProfile(updatedProfile);
    toast.success("Avatar updated!");
  };

  const handleClearData = () => {
    if (confirm("Are you sure? This will delete all your mood logs and journal entries.")) {
      clearAllData();
      toast.success("All data cleared");
    }
  };

  if (!profile) return null;

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
            Your Profile
          </h1>
          <p className="text-gray-600">Manage your account & preferences</p>
        </motion.div>

        {/* Avatar Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-violet-200/50 shadow-xl mb-6"
        >
          <div className="flex flex-col items-center">
            {/* Avatar Display */}
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full p-2 shadow-2xl">
                <AvatarDisplay avatar={profile.avatar} size="large" />
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCustomizer(true)}
                className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <Palette className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* User Info */}
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {profile.name}
            </h2>
            <p className="text-gray-600 mb-4">{profile.email}</p>
            <button
              onClick={() => setShowCustomizer(true)}
              className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Customize Avatar
            </button>
          </div>
        </motion.div>

        {/* Account Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-violet-200/50 shadow-xl mb-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Account Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-violet-50 rounded-2xl">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-400 to-purple-500 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-gray-800">{profile.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-800">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-2xl">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-semibold text-gray-800">
                  {new Date(profile.joinedDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-violet-200/50 shadow-xl mb-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Settings</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-violet-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Notifications</p>
                  <p className="text-xs text-gray-600">
                    Push notifications for check-ins
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotificationsEnabled(!notificationsEnabled);
                    toast.success(
                      notificationsEnabled
                        ? "Notifications disabled"
                        : "Notifications enabled"
                    );
                  }}
                  className={`w-12 h-6 rounded-full transition-all ${
                    notificationsEnabled
                      ? "bg-gradient-to-r from-violet-500 to-purple-500"
                      : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    layout
                    className="w-5 h-5 bg-white rounded-full shadow-md"
                    animate={{
                      x: notificationsEnabled ? 24 : 2,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Moon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Dark Mode</p>
                  <p className="text-xs text-gray-600">
                    Switch to dark theme
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDarkMode(!darkMode);
                    toast.info("Dark mode coming soon!");
                  }}
                  className={`w-12 h-6 rounded-full transition-all ${
                    darkMode
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                      : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    layout
                    className="w-5 h-5 bg-white rounded-full shadow-md"
                    animate={{
                      x: darkMode ? 24 : 2,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Privacy</p>
                  <p className="text-xs text-gray-600">Data & security settings</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-violet-200/50 shadow-xl"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Data Management
          </h3>
          <button
            onClick={handleClearData}
            className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-2xl hover:bg-red-100 transition-all group"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-700">Clear All Data</span>
          </button>
        </motion.div>
      </div>

      {/* Avatar Customizer Modal */}
      {showCustomizer && (
        <AvatarCustomizer
          avatar={profile.avatar}
          onChange={handleAvatarChange}
          onClose={() => setShowCustomizer(false)}
        />
      )}
    </div>
  );
}
