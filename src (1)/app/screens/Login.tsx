import { useState } from "react";
import { motion } from "motion/react";
import { Brain, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router";
import { saveUserProfile, setOnboardingComplete } from "../utils/storage";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isLogin && !name) {
      toast.error("Please enter your name");
      return;
    }

    // Save user profile
    const profile = {
      name: name || email.split("@")[0],
      email,
      joinedDate: new Date().toISOString().split("T")[0],
      avatar: {
        skinTone: "light",
        hairstyle: "short",
        hairColor: "black",
        eyes: "happy",
        eyeColor: "brown",
        mouth: "smile",
        outfit: "casual",
        outfitColor: "blue",
        accessory: "none",
      },
    };

    saveUserProfile(profile);
    setOnboardingComplete(true);
    toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
    navigate("/dashboard");
  };

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

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
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

          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            MoodShift
          </h1>
          <p className="text-lg text-gray-600">
            Your AI-powered mental wellness companion
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-violet-200/50 shadow-xl"
        >
          {/* Toggle Login/Signup */}
          <div className="flex gap-2 mb-6 p-1 bg-violet-100/50 rounded-2xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                isLogin
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                !isLogin
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 pl-12 bg-white border-2 border-violet-200 rounded-xl focus:outline-none focus:border-violet-500 transition-colors"
                  />
                  <Brain className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 pl-12 bg-white border-2 border-violet-200 rounded-xl focus:outline-none focus:border-violet-500 transition-colors"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pl-12 pr-12 bg-white border-2 border-violet-200 rounded-xl focus:outline-none focus:border-violet-500 transition-colors"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-violet-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-violet-600 hover:text-violet-700 font-semibold"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white rounded-2xl py-4 px-6 font-semibold text-lg shadow-2xl shadow-violet-500/50 hover:shadow-3xl transition-all flex items-center justify-center gap-3 group"
            >
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          {!isLogin && (
            <p className="text-center text-sm text-gray-600 mt-6">
              By signing up, you agree to our{" "}
              <button className="text-violet-600 font-semibold hover:underline">
                Terms
              </button>{" "}
              and{" "}
              <button className="text-violet-600 font-semibold hover:underline">
                Privacy Policy
              </button>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
