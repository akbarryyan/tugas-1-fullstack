import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const Navbar = ({ onMenuClick }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const { user, logout } = useAuth();
  const { theme, changeTheme, themes, isDark } = useTheme();

  // Show notification function
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
    setUserDropdownOpen(false);
  };

  const confirmLogout = async () => {
    setLogoutLoading(true);

    try {
      // Simulate API loading delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success notification first before logout
      showNotification("success", "Successfully signed out!");
      setShowLogoutModal(false);

      // Delay the actual logout to show notification first
      setTimeout(() => {
        logout();
        setLogoutLoading(false);
      }, 2000);
    } catch (error) {
      showNotification("error", "Error occurred during sign out");
      setLogoutLoading(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleThemeChange = (newTheme) => {
    console.log("Changing theme to:", newTheme);
    changeTheme(newTheme);
    setThemeDropdownOpen(false);
  };

  const getThemeIcon = (themeValue) => {
    switch (themeValue) {
      case "light":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        );
      case "dark":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden btn-ghost p-2 relative overflow-hidden group transform transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl"></div>
          <svg
            className="w-6 h-6 relative z-10 transform transition-all duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-active:rotate-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
              className="transition-all duration-300 group-hover:stroke-[2.5]"
            />
          </svg>

          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400/20 to-purple-400/20 transform scale-0 group-active:scale-100 transition-transform duration-150"></div>
        </button>

        {/* Page Title */}
        <div className="hidden lg:block">
          {/* Debug info - akan dihapus nanti */}
          {console.log("Navbar Debug:", {
            theme,
            isDark,
            htmlHasDarkClass:
              document.documentElement.classList.contains("dark"),
          })}
          <h1
            className="text-2xl font-semibold"
            style={{
              color: isDark ? "#ffffff" : "#111827", // white di dark, gray-900 di light
            }}
          >
            Employee Management System
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="p-2 relative overflow-hidden group transform transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl border border-transparent shadow-sm hover:shadow-md"
              style={{
                color: isDark ? "#ffffff" : "#111827",
                backgroundColor: "transparent",
                borderColor: "transparent",
              }}
              onMouseEnter={(e) => {
                const button = e.currentTarget;
                button.style.backgroundColor = isDark
                  ? "rgba(79, 70, 229, 0.1)"
                  : "rgba(239, 246, 255, 0.8)";
                button.style.borderColor = isDark
                  ? "rgba(79, 70, 229, 0.3)"
                  : "rgba(99, 102, 241, 0.3)";
                button.style.color = isDark ? "#a5b4fc" : "#4f46e5";
              }}
              onMouseLeave={(e) => {
                const button = e.currentTarget;
                button.style.backgroundColor = "transparent";
                button.style.borderColor = "transparent";
                button.style.color = isDark ? "#ffffff" : "#111827";
              }}
              aria-label="Theme Switcher"
            >
              {/* Background gradient effect */}
              <div
                className="absolute inset-0 bg-gradient-to-r transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl"
                style={{
                  backgroundImage: isDark
                    ? "linear-gradient(to right, rgba(79, 70, 229, 0.1), rgba(147, 51, 234, 0.1))"
                    : "linear-gradient(to right, rgba(239, 246, 255, 0.9), rgba(250, 245, 255, 0.9))",
                }}
              ></div>

              {/* Icon with enhanced styling */}
              <div className="relative z-10 transform transition-all duration-300 group-hover:scale-110">
                {getThemeIcon(theme)}
              </div>

              {/* Ripple effect */}
              <div
                className="absolute inset-0 rounded-xl transform scale-0 group-active:scale-100 transition-transform duration-150"
                style={{
                  backgroundColor: isDark
                    ? "rgba(79, 70, 229, 0.2)"
                    : "rgba(99, 102, 241, 0.2)",
                }}
              ></div>
            </button>

            {themeDropdownOpen && (
              <>
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl border z-50 overflow-hidden backdrop-blur-sm animate-fade-in"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(17, 24, 39, 0.95)"
                      : "rgba(255, 255, 255, 0.95)",
                    borderColor: isDark
                      ? "rgba(75, 85, 99, 0.3)"
                      : "rgba(203, 213, 225, 0.5)",
                  }}
                >
                  {themes.map((themeOption) => (
                    <button
                      key={themeOption.value}
                      onClick={() => handleThemeChange(themeOption.value)}
                      className={`w-full text-left px-4 py-3 text-sm flex items-center space-x-3 first:rounded-t-xl last:rounded-b-xl transition-all duration-200 transform hover:scale-[1.02] border-l-4 border-transparent`}
                      style={{
                        backgroundColor:
                          theme === themeOption.value
                            ? isDark
                              ? "rgba(79, 70, 229, 0.2)"
                              : "rgba(239, 246, 255, 0.8)"
                            : "transparent",
                        borderLeftColor:
                          theme === themeOption.value
                            ? isDark
                              ? "#6366f1"
                              : "#4f46e5"
                            : "transparent",
                        color:
                          theme === themeOption.value
                            ? isDark
                              ? "#a5b4fc"
                              : "#4f46e5"
                            : isDark
                            ? "#d1d5db"
                            : "#374151",
                      }}
                      onMouseEnter={(e) => {
                        if (theme !== themeOption.value) {
                          const button = e.currentTarget;
                          button.style.backgroundColor = isDark
                            ? "rgba(79, 70, 229, 0.1)"
                            : "rgba(239, 246, 255, 0.6)";
                          button.style.color = isDark ? "#a5b4fc" : "#4f46e5";
                          button.style.borderLeftColor = isDark
                            ? "#6366f1"
                            : "#4f46e5";
                          button.style.boxShadow =
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (theme !== themeOption.value) {
                          const button = e.currentTarget;
                          button.style.backgroundColor = "transparent";
                          button.style.color = isDark ? "#d1d5db" : "#374151";
                          button.style.borderLeftColor = "transparent";
                          button.style.boxShadow = "none";
                        }
                      }}
                    >
                      <div className="transform transition-transform duration-200 hover:scale-110">
                        {getThemeIcon(themeOption.value)}
                      </div>
                      <span className="font-medium">{themeOption.label}</span>
                      {theme === themeOption.value && (
                        <svg
                          className="w-4 h-4 ml-auto animate-pulse"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-3 text-sm rounded-xl p-2 transition-all duration-300 border border-transparent shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 group"
              style={{
                backgroundColor: "transparent",
                borderColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark
                  ? "rgba(79, 70, 229, 0.1)"
                  : "rgba(239, 246, 255, 0.8)";
                e.target.style.borderColor = isDark
                  ? "rgba(79, 70, 229, 0.3)"
                  : "rgba(99, 102, 241, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.borderColor = "transparent";
              }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                <span className="text-white font-medium text-sm">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2) || "A"}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p
                  className="font-medium text-gray-900 dark:text-gray-100"
                  style={{
                    color: isDark ? "#ffffff" : "#111827",
                  }}
                >
                  {user?.name}
                </p>
                <p
                  className="text-xs text-gray-500 dark:text-gray-400"
                  style={{
                    color: isDark ? "#ffffff" : "#111827",
                  }}
                >
                  {user?.email}
                </p>
              </div>
              <svg
                className="w-4 h-4 transform transition-transform duration-300 group-hover:rotate-180"
                fill="currentColor"
                viewBox="0 0 20 20"
                style={{
                  color: isDark ? "#9ca3af" : "#64748b",
                }}
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl border z-50 overflow-hidden backdrop-blur-sm animate-fade-in"
                style={{
                  backgroundColor: isDark
                    ? "rgba(17, 24, 39, 0.95)"
                    : "rgba(255, 255, 255, 0.95)",
                  borderColor: isDark
                    ? "rgba(75, 85, 99, 0.3)"
                    : "rgba(203, 213, 225, 0.5)",
                }}
              >
                <div
                  className="px-4 py-3 border-b"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(79, 70, 229, 0.1)"
                      : "rgba(239, 246, 255, 0.5)",
                    borderBottomColor: isDark
                      ? "rgba(75, 85, 99, 0.3)"
                      : "rgba(203, 213, 225, 0.5)",
                  }}
                >
                  <p
                    className="text-sm font-medium text-gray-900 dark:text-gray-100"
                    style={{
                      color: isDark ? "#ffffff" : "#111827",
                    }}
                  >
                    {user?.name}
                  </p>
                  <p
                    className="text-sm text-gray-500 dark:text-gray-400"
                    style={{
                      color: isDark ? "#ffffff" : "#111827",
                    }}
                  >
                    {user?.email}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-sm transition-all duration-200 transform hover:scale-[1.02] border-l-4 border-transparent"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      color: isDark ? "#d1d5db" : "#374151",
                    }}
                    onMouseEnter={(e) => {
                      const link = e.currentTarget;
                      link.style.backgroundColor = isDark
                        ? "rgba(79, 70, 229, 0.1)"
                        : "rgba(239, 246, 255, 0.7)";
                      link.style.color = isDark ? "#a5b4fc" : "#4f46e5";
                      link.style.borderLeftColor = isDark
                        ? "#6366f1"
                        : "#4f46e5";
                      link.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      const link = e.currentTarget;
                      link.style.backgroundColor = "transparent";
                      link.style.color = isDark ? "#d1d5db" : "#374151";
                      link.style.borderLeftColor = "transparent";
                      link.style.boxShadow = "none";
                    }}
                  >
                    <svg
                      className="w-4 h-4 mr-3 transform transition-transform duration-200 hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-medium">Profile Settings</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-3 text-sm transition-all duration-200 transform hover:scale-[1.02] border-l-4 border-transparent"
                    style={{
                      color: isDark ? "#f87171" : "#dc2626",
                    }}
                    onMouseEnter={(e) => {
                      const button = e.currentTarget;
                      button.style.backgroundColor = isDark
                        ? "rgba(239, 68, 68, 0.1)"
                        : "rgba(254, 242, 242, 0.8)";
                      button.style.borderLeftColor = isDark
                        ? "#ef4444"
                        : "#dc2626";
                      button.style.boxShadow =
                        "0 2px 4px rgba(239, 68, 68, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      const button = e.currentTarget;
                      button.style.backgroundColor = "transparent";
                      button.style.borderLeftColor = "transparent";
                      button.style.boxShadow = "none";
                    }}
                  >
                    <svg
                      className="w-4 h-4 mr-3 transform transition-transform duration-200 hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="font-medium">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {(userDropdownOpen || themeDropdownOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:bg-transparent"
          onClick={() => {
            setUserDropdownOpen(false);
            setThemeDropdownOpen(false);
          }}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
        >
          <div
            className="rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 border"
            style={{
              background: isDark
                ? "rgba(31, 41, 55, 0.95)"
                : "rgba(255, 255, 255, 0.98)",
              borderColor: isDark
                ? "rgba(75, 85, 99, 0.6)"
                : "rgba(219, 234, 254, 0.8)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center border"
                  style={{
                    background: isDark
                      ? "rgba(239, 68, 68, 0.2)"
                      : "rgba(254, 226, 226, 0.8)",
                    borderColor: isDark
                      ? "rgba(239, 68, 68, 0.4)"
                      : "rgba(248, 113, 113, 0.6)",
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{
                      color: isDark ? "#f87171" : "#dc2626",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{
                      color: isDark ? "#f9fafb" : "#111827",
                    }}
                  >
                    Are you sure you want to sign out?
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      color: isDark ? "#9ca3af" : "#6b7280",
                    }}
                  >
                    This action will end your current session
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <p
                  className="leading-relaxed"
                  style={{
                    color: isDark ? "#d1d5db" : "#374151",
                  }}
                >
                  You will be redirected to the login page and will need to sign
                  in again to access your account.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={cancelLogout}
                  disabled={logoutLoading}
                  className="px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    background: isDark
                      ? "rgba(75, 85, 99, 0.5)"
                      : "rgba(243, 244, 246, 0.8)",
                    color: isDark ? "#d1d5db" : "#374151",
                    borderColor: isDark
                      ? "rgba(75, 85, 99, 0.6)"
                      : "rgba(209, 213, 219, 0.8)",
                    focusRingColor: "#6b7280",
                    focusRingOffsetColor: isDark ? "#1f2937" : "#ffffff",
                  }}
                  onMouseEnter={(e) => {
                    if (!logoutLoading) {
                      e.target.style.background = isDark
                        ? "rgba(75, 85, 99, 0.7)"
                        : "rgba(229, 231, 235, 0.9)";
                      e.target.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!logoutLoading) {
                      e.target.style.background = isDark
                        ? "rgba(75, 85, 99, 0.5)"
                        : "rgba(243, 244, 246, 0.8)";
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmLogout}
                  disabled={logoutLoading}
                  className="px-6 py-3 text-sm font-medium text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px] shadow-lg focus:outline-none focus:ring-4"
                  style={{
                    background: logoutLoading
                      ? isDark
                        ? "rgba(107, 114, 128, 0.5)"
                        : "rgba(156, 163, 175, 0.5)"
                      : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    boxShadow: logoutLoading
                      ? "none"
                      : isDark
                      ? "0 10px 25px rgba(239, 68, 68, 0.25)"
                      : "0 10px 25px rgba(239, 68, 68, 0.3)",
                    focusRingColor: isDark
                      ? "rgba(239, 68, 68, 0.6)"
                      : "rgba(239, 68, 68, 0.4)",
                    focusRingOffsetColor: isDark ? "#1f2937" : "#ffffff",
                  }}
                  onMouseEnter={(e) => {
                    if (!logoutLoading) {
                      e.target.style.transform = "translateY(-1px) scale(1.02)";
                      e.target.style.boxShadow = isDark
                        ? "0 15px 35px rgba(239, 68, 68, 0.35)"
                        : "0 15px 35px rgba(239, 68, 68, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!logoutLoading) {
                      e.target.style.transform = "translateY(0) scale(1)";
                      e.target.style.boxShadow = isDark
                        ? "0 10px 25px rgba(239, 68, 68, 0.25)"
                        : "0 10px 25px rgba(239, 68, 68, 0.3)";
                    }
                  }}
                >
                  {logoutLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing out...
                    </div>
                  ) : (
                    "Sign Out"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-[80] animate-fade-in">
          <div
            className={`max-w-sm w-full rounded-lg shadow-2xl border-l-4 p-4 border ${
              notification.type === "success"
                ? "bg-green-50 dark:bg-green-900 border-l-green-500 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200"
                : "bg-red-50 dark:bg-red-900 border-l-red-500 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200"
            }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {notification.type === "success" ? (
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-red-600 dark:text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => setNotification(null)}
                  className="inline-flex text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 rounded-sm p-1 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
