import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState("");
  const [notification, setNotification] = useState(null);
  const { login } = useAuth();
  const { isDark } = useTheme();

  // Show notification function
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simulate API loading delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // First validate credentials without setting user state
      if (formData.username === "admin" && formData.password === "pastibisa") {
        showNotification("success", "Login successful! Redirecting...");

        // Delay the actual login to show notification first
        setTimeout(() => {
          const result = login(formData.username, formData.password);
          setLoading(false);
        }, 2000);
      } else {
        const errorMessage = "Invalid username or password!";
        setError(errorMessage);
        showNotification("error", errorMessage);
        setLoading(false);
      }
    } catch (err) {
      const errorMessage = "An error occurred during login";
      setError(errorMessage);
      showNotification("error", errorMessage);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(`${type} copied!`);
      setTimeout(() => setCopyFeedback(""), 2000);
    } catch (err) {
      setCopyFeedback("Failed to copy");
      setTimeout(() => setCopyFeedback(""), 2000);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #1f2937 0%, #111827 100%)"
          : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          {/* Enhanced Company Logo */}
          <div
            className="mx-auto h-20 w-20 rounded-2xl flex items-center justify-center mb-8 shadow-2xl transform hover:scale-105 transition-transform duration-300"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: isDark
                ? "0 20px 40px rgba(99, 102, 241, 0.3)"
                : "0 20px 40px rgba(99, 102, 241, 0.4)",
            }}
          >
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>

          <h2
            className="text-4xl font-bold"
            style={{
              color: isDark ? "#ffffff" : "#111827",
            }}
          >
            Employee Management
          </h2>
          <p
            className="mt-3 text-lg"
            style={{
              color: isDark ? "#9ca3af" : "#6b7280",
            }}
          >
            Sign in to access your dashboard
          </p>
        </div>

        <div
          className="rounded-2xl p-8 shadow-2xl border"
          style={{
            background: isDark
              ? "rgba(31, 41, 55, 0.9)"
              : "rgba(255, 255, 255, 0.95)",
            borderColor: isDark
              ? "rgba(75, 85, 99, 0.6)"
              : "rgba(219, 234, 254, 0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div
                className="animate-scale-in border-2 px-4 py-3 rounded-xl text-sm shadow-lg"
                style={{
                  background: isDark
                    ? "rgba(239, 68, 68, 0.1)"
                    : "rgba(254, 242, 242, 0.8)",
                  borderColor: isDark
                    ? "rgba(239, 68, 68, 0.4)"
                    : "rgba(248, 113, 113, 0.6)",
                  color: isDark ? "#fca5a5" : "#dc2626",
                }}
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold mb-2"
                  style={{
                    color: isDark ? "#d1d5db" : "#374151",
                  }}
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{
                        color: isDark ? "#9ca3af" : "#6b7280",
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full px-3 py-3 pl-12 pr-4 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      background: isDark
                        ? "rgba(55, 65, 81, 0.5)"
                        : "rgba(255, 255, 255, 0.8)",
                      borderColor: isDark
                        ? "rgba(75, 85, 99, 0.6)"
                        : "rgba(209, 213, 219, 0.8)",
                      color: isDark ? "#f9fafb" : "#111827",
                      focusRingColor: "#6366f1",
                      focusRingOffsetColor: isDark ? "#1f2937" : "#ffffff",
                    }}
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold mb-2"
                  style={{
                    color: isDark ? "#d1d5db" : "#374151",
                  }}
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{
                        color: isDark ? "#9ca3af" : "#6b7280",
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-3 py-3 pl-12 pr-12 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      background: isDark
                        ? "rgba(55, 65, 81, 0.5)"
                        : "rgba(255, 255, 255, 0.8)",
                      borderColor: isDark
                        ? "rgba(75, 85, 99, 0.6)"
                        : "rgba(209, 213, 219, 0.8)",
                      color: isDark ? "#f9fafb" : "#111827",
                      focusRingColor: "#6366f1",
                      focusRingOffsetColor: isDark ? "#1f2937" : "#ffffff",
                    }}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 z-10 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      color: isDark ? "#9ca3af" : "#6b7280",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = isDark ? "#d1d5db" : "#374151";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = isDark ? "#9ca3af" : "#6b7280";
                    }}
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5 transition-colors duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l4.242 4.242M14.12 14.12L15.536 15.536M14.12 14.12L9.878 9.878"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 transition-colors duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-lg py-4 font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:cursor-not-allowed focus:outline-none focus:ring-4"
              style={{
                background: loading
                  ? isDark
                    ? "rgba(107, 114, 128, 0.5)"
                    : "rgba(156, 163, 175, 0.5)"
                  : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "white",
                opacity: loading ? 0.5 : 1,
                transform: loading ? "none" : "scale(1)",
                boxShadow: loading
                  ? "none"
                  : isDark
                  ? "0 10px 25px rgba(99, 102, 241, 0.25)"
                  : "0 10px 25px rgba(99, 102, 241, 0.3)",
                focusRingColor: isDark
                  ? "rgba(99, 102, 241, 0.6)"
                  : "rgba(99, 102, 241, 0.4)",
                focusRingOffsetColor: isDark ? "#1f2937" : "#ffffff",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(-2px) scale(1.02)";
                  e.target.style.boxShadow = isDark
                    ? "0 15px 35px rgba(99, 102, 241, 0.35)"
                    : "0 15px 35px rgba(99, 102, 241, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(0) scale(1)";
                  e.target.style.boxShadow = isDark
                    ? "0 10px 25px rgba(99, 102, 241, 0.25)"
                    : "0 10px 25px rgba(99, 102, 241, 0.3)";
                }
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign in
                </div>
              )}
            </button>

            <div
              className="mt-8 p-4 sm:p-6 rounded-2xl border-2 shadow-xl backdrop-blur-sm"
              style={{
                background: isDark
                  ? "linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)"
                  : "linear-gradient(135deg, rgba(249, 250, 251, 0.9) 0%, rgba(243, 244, 246, 0.9) 50%, rgba(239, 246, 255, 0.9) 100%)",
                borderColor: isDark
                  ? "rgba(99, 102, 241, 0.3)"
                  : "rgba(219, 234, 254, 0.8)",
              }}
            >
              {/* Copy Feedback */}
              {copyFeedback && (
                <div
                  className="mb-4 p-3 border rounded-lg text-center"
                  style={{
                    background: isDark
                      ? "rgba(5, 150, 105, 0.2)"
                      : "rgba(236, 253, 245, 0.8)",
                    borderColor: isDark
                      ? "rgba(5, 150, 105, 0.4)"
                      : "rgba(167, 243, 208, 0.8)",
                  }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{
                        color: isDark ? "#6ee7b7" : "#059669",
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: isDark ? "#6ee7b7" : "#047857",
                      }}
                    >
                      {copyFeedback}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center mb-4">
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p
                    className="text-base font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent"
                    style={{
                      background: isDark
                        ? "linear-gradient(to right, #a5b4fc, #c4b5fd, #93c5fd)"
                        : "linear-gradient(to right, #4f46e5, #7c3aed, #2563eb)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Demo Credentials
                  </p>
                  <p
                    className="text-xs mt-1 truncate"
                    style={{
                      color: isDark ? "#9ca3af" : "#6b7280",
                    }}
                  >
                    Use these credentials to test the application
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="group relative overflow-hidden">
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: isDark
                        ? "linear-gradient(to right, rgba(31, 41, 55, 0.8), rgba(79, 70, 229, 0.2))"
                        : "linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(239, 246, 255, 0.8))",
                    }}
                  ></div>
                  <div
                    className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]"
                    style={{
                      background: isDark
                        ? "rgba(55, 65, 81, 0.6)"
                        : "rgba(255, 255, 255, 0.6)",
                      borderColor: isDark
                        ? "rgba(99, 102, 241, 0.3)"
                        : "rgba(219, 234, 254, 0.8)",
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 text-white"
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
                      </div>
                      <span
                        className="font-semibold text-sm sm:text-base"
                        style={{
                          color: isDark ? "#d1d5db" : "#374151",
                        }}
                      >
                        Username:
                      </span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-2">
                      <code className="font-mono bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-shadow duration-200 flex-1 sm:flex-none text-center">
                        admin
                      </code>
                      <button
                        type="button"
                        className="p-2 transition-colors duration-200 flex-shrink-0"
                        onClick={() => handleCopy("admin", "Username")}
                        title="Copy username"
                        style={{
                          color: isDark ? "#9ca3af" : "#6b7280",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = isDark ? "#6366f1" : "#4f46e5";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = isDark ? "#9ca3af" : "#6b7280";
                        }}
                      >
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
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden">
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: isDark
                        ? "linear-gradient(to right, rgba(31, 41, 55, 0.8), rgba(147, 51, 234, 0.2))"
                        : "linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(250, 245, 255, 0.8))",
                    }}
                  ></div>
                  <div
                    className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]"
                    style={{
                      background: isDark
                        ? "rgba(55, 65, 81, 0.6)"
                        : "rgba(255, 255, 255, 0.6)",
                      borderColor: isDark
                        ? "rgba(147, 51, 234, 0.3)"
                        : "rgba(233, 213, 255, 0.8)",
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <span
                        className="font-semibold text-sm sm:text-base"
                        style={{
                          color: isDark ? "#d1d5db" : "#374151",
                        }}
                      >
                        Password:
                      </span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-2">
                      <code className="font-mono bg-gradient-to-r from-purple-500 to-pink-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-shadow duration-200 flex-1 sm:flex-none text-center">
                        pastibisa
                      </code>
                      <button
                        type="button"
                        className="p-2 transition-colors duration-200 flex-shrink-0"
                        onClick={() => handleCopy("pastibisa", "Password")}
                        title="Copy password"
                        style={{
                          color: isDark ? "#9ca3af" : "#6b7280",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = isDark ? "#a855f7" : "#7c2d12";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = isDark ? "#9ca3af" : "#6b7280";
                        }}
                      >
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
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="mt-4 pt-4"
                style={{
                  borderTop: isDark
                    ? "1px solid rgba(99, 102, 241, 0.3)"
                    : "1px solid rgba(219, 234, 254, 0.8)",
                }}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span
                      style={{
                        color: isDark ? "#9ca3af" : "#6b7280",
                      }}
                    >
                      Ready for testing
                    </span>
                  </div>
                  <div
                    className="hidden sm:block w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: isDark ? "#6b7280" : "#9ca3af",
                    }}
                  ></div>
                  <span
                    className="text-center"
                    style={{
                      color: isDark ? "#9ca3af" : "#6b7280",
                    }}
                  >
                    Click to copy credentials
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Custom Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-[60] animate-fade-in">
          <div
            className="max-w-sm w-full rounded-lg shadow-2xl border-l-4 p-4"
            style={{
              background:
                notification.type === "success"
                  ? isDark
                    ? "rgba(5, 46, 22, 0.9)"
                    : "rgba(240, 253, 244, 0.95)"
                  : isDark
                  ? "rgba(69, 10, 10, 0.9)"
                  : "rgba(254, 242, 242, 0.95)",
              borderLeftColor:
                notification.type === "success" ? "#10b981" : "#ef4444",
              color:
                notification.type === "success"
                  ? isDark
                    ? "#86efac"
                    : "#065f46"
                  : isDark
                  ? "#fca5a5"
                  : "#991b1b",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {notification.type === "success" ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{
                      color: "#10b981",
                    }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{
                      color: "#ef4444",
                    }}
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
                  className="inline-flex rounded-md p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    color: isDark ? "#9ca3af" : "#6b7280",
                    focusRingColor: "#6366f1",
                    focusRingOffsetColor: isDark ? "#1f2937" : "#ffffff",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = isDark ? "#d1d5db" : "#374151";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = isDark ? "#9ca3af" : "#6b7280";
                  }}
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
    </div>
  );
};

export default LoginForm;
