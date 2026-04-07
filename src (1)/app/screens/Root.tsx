import { Outlet, useLocation, useNavigate } from "react-router";
import { Home, ClipboardCheck, Activity, Shield, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { isOnboardingComplete } from "../utils/storage";

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const showNav = location.pathname !== "/";

  useEffect(() => {
    // Redirect to dashboard if onboarding is complete
    if (location.pathname === "/" && isOnboardingComplete()) {
      navigate("/dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/checkin", icon: ClipboardCheck, label: "Check-in" },
    { path: "/journal", icon: Activity, label: "Journal" },
    { path: "/interventions", icon: Shield, label: "Care" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="size-full flex flex-col bg-gradient-to-br from-violet-50 via-blue-50 to-pink-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      {showNav && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="border-t border-violet-200/50 bg-white/80 backdrop-blur-xl px-2 py-2 safe-area-inset-bottom"
        >
          <div className="flex items-center justify-around max-w-2xl mx-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all relative"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-violet-100 to-blue-100 rounded-2xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative">
                    <Icon
                      className={`w-6 h-6 transition-colors ${
                        isActive
                          ? "text-violet-600"
                          : "text-gray-400"
                      }`}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="nav-dot"
                        className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
                      />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium transition-colors ${
                      isActive
                        ? "text-violet-700"
                        : "text-gray-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.nav>
      )}
    </div>
  );
}