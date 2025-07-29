import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  employeesService,
  divisionsService,
} from "../../services/employeeService";
import { useLocalStorageListener } from "../../hooks/useLocalStorageListener";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [divisionCount, setDivisionCount] = useState(0);

  // Listen to localStorage changes
  const employeesData = useLocalStorageListener("employees_data");
  const divisionsData = useLocalStorageListener("divisions_data");

  // Update counts when data changes
  useEffect(() => {
    const updateCounts = () => {
      try {
        // Fetch employees
        const employeesResponse = employeesService.getAll();
        setEmployeeCount(employeesResponse.data?.length || 0);

        // Fetch divisions
        const divisionsResponse = divisionsService.getAll();
        setDivisionCount(divisionsResponse.length || 0);
      } catch (error) {
        console.error("Error fetching counts:", error);
        // Set default values if API fails
        setEmployeeCount(0);
        setDivisionCount(0);
      }
    };

    updateCounts();
  }, [employeesData, divisionsData]); // Re-run when localStorage data changes

  // Add touch handlers for swipe gestures
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    // Close sidebar on left swipe when open
    if (isLeftSwipe && isOpen) {
      onClose();
    }
  };

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Add custom styles for animations
  const customStyles = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    @keyframes slideInFromLeft {
      from { 
        opacity: 0; 
        transform: translateX(-20px); 
      }
      to { 
        opacity: 1; 
        transform: translateX(0); 
      }
    }

    .sidebar-glassmorphism {
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
  `;

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"
          />
        </svg>
      ),
      description: "Overview & Statistics",
    },
    {
      name: "Employees",
      href: "/employees",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      description: "Manage Staff",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
      description: "Account Settings",
    },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <>
      <style>{customStyles}</style>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40"
          onClick={onClose}
          style={{
            animation: "fadeIn 0.3s ease-out forwards",
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-64 sidebar-glassmorphism
        transform transition-all duration-500 ease-out z-50
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full shadow-none"}
        lg:shadow-none lg:backdrop-blur-none
      `}
        style={{
          backgroundColor: isDark
            ? "rgba(17, 24, 39, 0.95)"
            : "rgba(248, 250, 252, 0.98)",
          borderRight: isDark
            ? "1px solid rgba(75, 85, 99, 0.5)"
            : "1px solid rgba(203, 213, 225, 0.7)",
          transitionProperty: "transform, box-shadow, backdrop-filter",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className="flex items-center justify-between p-6"
            style={{
              borderBottom: isDark
                ? "1px solid rgba(75, 85, 99, 0.5)"
                : "1px solid rgba(203, 213, 225, 0.7)",
              animation: isOpen
                ? "slideInFromLeft 0.6s ease-out 0.2s both"
                : "none",
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110">
                <svg
                  className="h-6 w-6 text-white"
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
              <div>
                <h1
                  className="text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent"
                  style={{
                    backgroundImage: isDark
                      ? "linear-gradient(to right, #ffffff, #818cf8)"
                      : "linear-gradient(to right, #1f2937, #4f46e5)",
                  }}
                >
                  EmpManage
                </h1>
                <p
                  className="text-xs"
                  style={{
                    color: isDark ? "#9ca3af" : "#64748b",
                  }}
                >
                  Management System
                </p>
              </div>
            </div>

            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 transform hover:scale-110 active:scale-95"
            >
              <svg
                className="w-6 h-6 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* User Profile Section */}
          <div
            className="px-6 py-4"
            style={{
              borderBottom: isDark
                ? "1px solid rgba(75, 85, 99, 0.5)"
                : "1px solid rgba(203, 213, 225, 0.7)",
              animation: isOpen
                ? "slideInFromLeft 0.6s ease-out 0.3s both"
                : "none",
            }}
          >
            <div
              className="flex items-center space-x-3 p-3 rounded-xl border transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
              style={{
                backgroundColor: isDark
                  ? "rgba(79, 70, 229, 0.1)"
                  : "rgba(239, 246, 255, 0.8)",
                borderColor: isDark
                  ? "rgba(79, 70, 229, 0.3)"
                  : "rgba(99, 102, 241, 0.2)",
              }}
            >
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md transform transition-transform duration-300 hover:scale-110">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0) || "A"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold truncate"
                  style={{
                    color: isDark ? "#ffffff" : "#1f2937",
                  }}
                >
                  {user?.name || "Administrator"}
                </p>
                <p
                  className="text-xs truncate"
                  style={{
                    color: isDark ? "#9ca3af" : "#64748b",
                  }}
                >
                  {user?.email || "admin@company.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav
            className="flex-1 px-4 py-6 space-y-2 overflow-y-auto"
            style={{
              animation: isOpen
                ? "slideInFromLeft 0.6s ease-out 0.4s both"
                : "none",
            }}
          >
            {navigation.map((item, index) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02]
                    ${
                      active
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-[1.02]"
                        : ""
                    }
                  `}
                  style={{
                    backgroundColor: !active
                      ? isDark
                        ? "transparent"
                        : "transparent"
                      : undefined,
                    color: !active
                      ? isDark
                        ? "#d1d5db"
                        : "#374151"
                      : undefined,
                    animation: isOpen
                      ? `slideInFromLeft 0.6s ease-out ${
                          0.5 + index * 0.1
                        }s both`
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.target.style.backgroundColor = isDark
                        ? "rgba(79, 70, 229, 0.1)"
                        : "rgba(239, 246, 255, 0.7)";
                      e.target.style.color = isDark ? "#a5b4fc" : "#4f46e5";
                      e.target.style.boxShadow =
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = isDark ? "#d1d5db" : "#374151";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                >
                  <div
                    className={`
                    mr-3 p-1.5 rounded-lg transition-all duration-300
                    ${active ? "bg-white/20 shadow-sm" : ""}
                  `}
                    style={{
                      backgroundColor: !active
                        ? isDark
                          ? "rgba(79, 70, 229, 0.1)"
                          : "transparent"
                        : undefined,
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.target.style.backgroundColor = isDark
                          ? "rgba(79, 70, 229, 0.2)"
                          : "rgba(239, 246, 255, 0.8)";
                        e.target.style.boxShadow =
                          "0 2px 4px rgba(0, 0, 0, 0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.target.style.backgroundColor = isDark
                          ? "rgba(79, 70, 229, 0.1)"
                          : "transparent";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.name}</span>
                      {active && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></div>
                      )}
                    </div>
                    <p
                      className={`text-xs mt-0.5 transition-colors duration-300 ${
                        active ? "text-white/80" : ""
                      }`}
                      style={{
                        color: !active
                          ? isDark
                            ? "#9ca3af"
                            : "#64748b"
                          : undefined,
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.target.style.color = isDark ? "#a5b4fc" : "#4f46e5";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.target.style.color = isDark ? "#9ca3af" : "#64748b";
                        }
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div
            className="p-4 space-y-3"
            style={{
              borderTop: isDark
                ? "1px solid rgba(75, 85, 99, 0.5)"
                : "1px solid rgba(203, 213, 225, 0.7)",
              animation: isOpen
                ? "slideInFromLeft 0.6s ease-out 0.8s both"
                : "none",
            }}
          >
            {/* System Status */}
            <div
              className="flex items-center justify-between p-3 rounded-lg border"
              style={{
                backgroundColor: isDark
                  ? "rgba(16, 185, 129, 0.1)"
                  : "rgba(236, 253, 245, 0.8)",
                borderColor: isDark
                  ? "rgba(16, 185, 129, 0.3)"
                  : "rgba(16, 185, 129, 0.2)",
              }}
            >
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <span
                  className="text-xs font-medium"
                  style={{
                    color: isDark ? "#10b981" : "#047857",
                  }}
                >
                  System Active
                </span>
              </div>
              <span
                className="text-xs font-mono"
                style={{
                  color: isDark ? "#34d399" : "#059669",
                }}
              >
                v2.1.0
              </span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div
                className="p-2 rounded-lg border"
                style={{
                  backgroundColor: isDark
                    ? "rgba(59, 130, 246, 0.1)"
                    : "rgba(239, 246, 255, 0.8)",
                  borderColor: isDark
                    ? "rgba(59, 130, 246, 0.3)"
                    : "rgba(59, 130, 246, 0.2)",
                }}
              >
                <div className="flex items-center space-x-1.5">
                  <svg
                    className="w-3 h-3 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <div>
                    <p
                      className="text-xs font-bold"
                      style={{
                        color: isDark ? "#60a5fa" : "#2563eb",
                      }}
                    >
                      Employees
                    </p>
                    <p
                      className="text-xs font-mono"
                      style={{
                        color: isDark ? "#93c5fd" : "#1d4ed8",
                      }}
                    >
                      {employeeCount}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="p-2 rounded-lg border"
                style={{
                  backgroundColor: isDark
                    ? "rgba(147, 51, 234, 0.1)"
                    : "rgba(250, 245, 255, 0.8)",
                  borderColor: isDark
                    ? "rgba(147, 51, 234, 0.3)"
                    : "rgba(147, 51, 234, 0.2)",
                }}
              >
                <div className="flex items-center space-x-1.5">
                  <svg
                    className="w-3 h-3 text-purple-600 dark:text-purple-400"
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
                  <div>
                    <p
                      className="text-xs font-bold"
                      style={{
                        color: isDark ? "#a78bfa" : "#7c3aed",
                      }}
                    >
                      Divisions
                    </p>
                    <p
                      className="text-xs font-mono"
                      style={{
                        color: isDark ? "#c4b5fd" : "#6d28d9",
                      }}
                    >
                      {divisionCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="text-center pt-2">
              <p
                className="text-xs mb-1"
                style={{
                  color: isDark ? "#9ca3af" : "#64748b",
                }}
              >
                © 2025 EmpManage
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
