import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    username: user?.username || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);

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
    setSuccess("");
    setLoading(true);

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error("Name is required");
      }
      if (!formData.email.trim()) {
        throw new Error("Email is required");
      }

      // Simulate API loading delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update profile
      updateProfile(formData);
      setSuccess("Profile updated successfully!");
      showNotification("success", "Profile updated successfully!");
    } catch (err) {
      const errorMessage = err.message || "Failed to update profile";
      setError(errorMessage);
      showNotification("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold"
          style={{
            color: isDark ? "#f9fafb" : "#111827",
          }}
        >
          Profile Settings
        </h1>
        <p
          className="mt-2"
          style={{
            color: isDark ? "#9ca3af" : "#6b7280",
          }}
        >
          Manage your account information and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <div className="lg:col-span-1">
          <div
            className="rounded-2xl shadow-lg border transition-all duration-300"
            style={{
              background: isDark
                ? "rgba(31, 41, 55, 0.8)"
                : "rgba(255, 255, 255, 0.95)",
              borderColor: isDark
                ? "rgba(75, 85, 99, 0.6)"
                : "rgba(219, 234, 254, 0.8)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="p-6">
              <div className="text-center">
                <div
                  className="mx-auto h-24 w-24 rounded-full flex items-center justify-center mb-4 shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    boxShadow: isDark
                      ? "0 8px 25px rgba(99, 102, 241, 0.3)"
                      : "0 8px 25px rgba(99, 102, 241, 0.4)",
                  }}
                >
                  <span className="text-white font-bold text-2xl">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2) || "A"}
                  </span>
                </div>
                <h3
                  className="text-lg font-medium mb-1"
                  style={{
                    color: isDark ? "#f9fafb" : "#111827",
                  }}
                >
                  {user?.name}
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{
                    color: isDark ? "#9ca3af" : "#6b7280",
                  }}
                >
                  {user?.email}
                </p>
                <div className="mt-4">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: isDark
                        ? "rgba(99, 102, 241, 0.2)"
                        : "rgba(99, 102, 241, 0.1)",
                      color: isDark ? "#c7d2fe" : "#4f46e5",
                      border: isDark
                        ? "1px solid rgba(99, 102, 241, 0.3)"
                        : "1px solid rgba(99, 102, 241, 0.2)",
                    }}
                  >
                    Administrator
                  </span>
                </div>
              </div>

              <div
                className="mt-6 pt-6"
                style={{
                  borderTop: isDark
                    ? "1px solid rgba(75, 85, 99, 0.6)"
                    : "1px solid rgba(229, 231, 235, 0.8)",
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <svg
                      className="w-4 h-4 mr-3 flex-shrink-0"
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
                    <span
                      style={{
                        color: isDark ? "#d1d5db" : "#374151",
                      }}
                    >
                      ID: {user?.id}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg
                      className="w-4 h-4 mr-3 flex-shrink-0"
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
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <span
                      style={{
                        color: isDark ? "#d1d5db" : "#374151",
                      }}
                    >
                      {user?.phone}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg
                      className="w-4 h-4 mr-3 flex-shrink-0"
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span
                      style={{
                        color: isDark ? "#d1d5db" : "#374151",
                      }}
                    >
                      Active since 2024
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl shadow-lg border transition-all duration-300"
            style={{
              background: isDark
                ? "rgba(31, 41, 55, 0.8)"
                : "rgba(255, 255, 255, 0.95)",
              borderColor: isDark
                ? "rgba(75, 85, 99, 0.6)"
                : "rgba(219, 234, 254, 0.8)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="p-6">
              <h2
                className="text-lg font-semibold mb-6"
                style={{
                  color: isDark ? "#f9fafb" : "#111827",
                }}
              >
                Edit Profile Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: isDark ? "#d1d5db" : "#374151",
                      }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
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
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: isDark ? "#d1d5db" : "#374151",
                      }}
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="w-full px-4 py-3 rounded-xl border transition-all duration-200 cursor-not-allowed"
                      style={{
                        background: isDark
                          ? "rgba(75, 85, 99, 0.5)"
                          : "rgba(249, 250, 251, 0.8)",
                        borderColor: isDark
                          ? "rgba(75, 85, 99, 0.6)"
                          : "rgba(209, 213, 219, 0.8)",
                        color: isDark ? "#9ca3af" : "#6b7280",
                      }}
                      placeholder="Username"
                      value={formData.username}
                      disabled
                      readOnly
                    />
                    <p
                      className="text-xs mt-1"
                      style={{
                        color: isDark ? "#9ca3af" : "#6b7280",
                      }}
                    >
                      Username cannot be changed
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: isDark ? "#d1d5db" : "#374151",
                      }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
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
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: isDark ? "#d1d5db" : "#374151",
                      }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
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
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div
                  className="pt-6"
                  style={{
                    borderTop: isDark
                      ? "1px solid rgba(75, 85, 99, 0.6)"
                      : "1px solid rgba(229, 231, 235, 0.8)",
                  }}
                >
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          name: user?.name || "",
                          email: user?.email || "",
                          phone: user?.phone || "",
                          username: user?.username || "",
                        });
                        setError("");
                        setSuccess("");
                      }}
                      className="px-6 py-3 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{
                        background: isDark
                          ? "rgba(75, 85, 99, 0.5)"
                          : "rgba(243, 244, 246, 0.8)",
                        color: isDark ? "#d1d5db" : "#374151",
                        border: isDark
                          ? "1px solid rgba(75, 85, 99, 0.6)"
                          : "1px solid rgba(209, 213, 219, 0.8)",
                        focusRingColor: "#6b7280",
                        focusRingOffsetColor: isDark ? "#1f2937" : "#ffffff",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = isDark
                          ? "rgba(75, 85, 99, 0.7)"
                          : "rgba(229, 231, 235, 0.9)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = isDark
                          ? "rgba(75, 85, 99, 0.5)"
                          : "rgba(243, 244, 246, 0.8)";
                      }}
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 disabled:cursor-not-allowed"
                      style={{
                        background: loading
                          ? isDark
                            ? "rgba(107, 114, 128, 0.5)"
                            : "rgba(156, 163, 175, 0.5)"
                          : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        color: "white",
                        transform: loading ? "none" : "scale(1)",
                        boxShadow: loading
                          ? "none"
                          : isDark
                          ? "0 10px 25px rgba(99, 102, 241, 0.25)"
                          : "0 10px 25px rgba(99, 102, 241, 0.3)",
                        focusRingColor: isDark
                          ? "rgba(99, 102, 241, 0.8)"
                          : "rgba(99, 102, 241, 0.6)",
                        focusRingOffsetColor: isDark ? "#1f2937" : "#ffffff",
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.target.style.transform = "scale(1.02)";
                          e.target.style.boxShadow = isDark
                            ? "0 15px 35px rgba(99, 102, 241, 0.35)"
                            : "0 15px 35px rgba(99, 102, 241, 0.4)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) {
                          e.target.style.transform = "scale(1)";
                          e.target.style.boxShadow = isDark
                            ? "0 10px 25px rgba(99, 102, 241, 0.25)"
                            : "0 10px 25px rgba(99, 102, 241, 0.3)";
                        }
                      }}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Update Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Security Section */}
          <div
            className="rounded-2xl shadow-lg border transition-all duration-300 mt-6"
            style={{
              background: isDark
                ? "rgba(31, 41, 55, 0.8)"
                : "rgba(255, 255, 255, 0.95)",
              borderColor: isDark
                ? "rgba(75, 85, 99, 0.6)"
                : "rgba(219, 234, 254, 0.8)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="p-6">
              <h2
                className="text-lg font-semibold mb-4"
                style={{
                  color: isDark ? "#f9fafb" : "#111827",
                }}
              >
                Security Information
              </h2>
              <div
                className="rounded-lg p-4 border"
                style={{
                  background: isDark
                    ? "rgba(180, 83, 9, 0.1)"
                    : "rgba(254, 252, 232, 0.8)",
                  borderColor: isDark
                    ? "rgba(217, 119, 6, 0.3)"
                    : "rgba(253, 230, 138, 0.8)",
                }}
              >
                <div className="flex">
                  <svg
                    className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{
                      color: isDark ? "#fbbf24" : "#d97706",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div>
                    <h3
                      className="text-sm font-medium mb-1"
                      style={{
                        color: isDark ? "#fbbf24" : "#92400e",
                      }}
                    >
                      Password Management
                    </h3>
                    <p
                      className="text-sm"
                      style={{
                        color: isDark ? "#fcd34d" : "#a16207",
                      }}
                    >
                      This is a demo application. Password change functionality
                      is not available in the current version. In a production
                      environment, you would have secure password management
                      features here.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default Profile;
