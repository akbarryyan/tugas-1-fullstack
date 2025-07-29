import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import {
  employeesService,
  divisionsService,
} from "../services/employeeService";

const Dashboard = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDivisions: 0,
    activeEmployees: 0,
    recentEmployees: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add custom CSS for animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .scrollbar-thin {
        scrollbar-width: thin;
      }
      
      .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
        background-color: #d1d5db;
        border-radius: 6px;
      }
      
      .dark .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
        background-color: #4b5563;
        border-radius: 6px;
      }
      
      .scrollbar-track-transparent::-webkit-scrollbar-track {
        background: transparent;
      }
      
      ::-webkit-scrollbar {
        width: 6px;
      }
      
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      
      ::-webkit-scrollbar-thumb {
        background-color: #d1d5db;
        border-radius: 6px;
      }
      
      .dark ::-webkit-scrollbar-thumb {
        background-color: #4b5563;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background-color: #9ca3af;
      }
      
      .dark ::-webkit-scrollbar-thumb:hover {
        background-color: #6b7280;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        console.log("Loading dashboard data...");

        // Get all employees
        const employeesResult = await employeesService.getAll(
          {},
          { page: 1, limit: 100 }
        );
        console.log("Employees result:", employeesResult);
        const employees = employeesResult.data || [];
        console.log("Employees array:", employees);

        // Get all divisions
        const divisionsResult = await divisionsService.getAll();
        console.log("Divisions result:", divisionsResult);
        const divisions = Array.isArray(divisionsResult) ? divisionsResult : [];
        console.log("Divisions array:", divisions);

        // Calculate stats
        const totalEmployees = employees ? employees.length : 0;
        const totalDivisions = divisions ? divisions.length : 0;
        const activeEmployees = employees ? employees.length : 0; // All employees are considered active for now
        const recentEmployees = employees ? employees.slice(0, 5) : []; // Last 5 employees

        console.log("Calculated stats:", {
          totalEmployees,
          totalDivisions,
          activeEmployees,
          recentEmployees,
        });

        setStats({
          totalEmployees,
          totalDivisions,
          activeEmployees,
          recentEmployees,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Active Divisions",
      value: stats.totalDivisions,
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      color: "bg-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Active Employees",
      value: stats.activeEmployees,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "bg-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold"
          style={{
            color: isDark ? "#ffffff" : "#111827", // white di dark, gray-900 di light
          }}
        >
          Dashboard
        </h1>
        <p
          className="mt-2"
          style={{
            color: isDark ? "#9ca3af" : "#4b5563", // gray-400 di dark, gray-600 di light
          }}
        >
          Welcome back! Here's an overview of your employee management system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="p-6 card-hover rounded-xl border transform transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: isDark
                ? "rgba(17, 24, 39, 0.8)"
                : "rgba(255, 255, 255, 0.9)",
              borderColor: isDark
                ? "rgba(75, 85, 99, 0.3)"
                : "rgba(203, 213, 225, 0.5)",
              boxShadow: isDark
                ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
            }}
          >
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 p-3 rounded-lg shadow-sm transform transition-transform duration-300 hover:scale-110`}
                style={{
                  backgroundColor: isDark
                    ? stat.bgColor.replace("bg-", "").includes("indigo")
                      ? "rgba(79, 70, 229, 0.2)"
                      : stat.bgColor.replace("bg-", "").includes("purple")
                      ? "rgba(147, 51, 234, 0.2)"
                      : "rgba(59, 130, 246, 0.2)"
                    : stat.bgColor.replace("bg-", "").includes("indigo")
                    ? "rgba(239, 246, 255, 0.8)"
                    : stat.bgColor.replace("bg-", "").includes("purple")
                    ? "rgba(250, 245, 255, 0.8)"
                    : "rgba(239, 246, 255, 0.8)",
                }}
              >
                <div
                  className={`w-6 h-6`}
                  style={{
                    color: isDark
                      ? stat.textColor.includes("indigo")
                        ? "#a5b4fc"
                        : stat.textColor.includes("purple")
                        ? "#c4b5fd"
                        : "#93c5fd"
                      : stat.textColor.includes("indigo")
                      ? "#4f46e5"
                      : stat.textColor.includes("purple")
                      ? "#7c3aed"
                      : "#2563eb",
                  }}
                >
                  {stat.icon}
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p
                  className="text-sm font-medium"
                  style={{
                    color: isDark ? "#9ca3af" : "#4b5563", // gray-400 di dark, gray-600 di light
                  }}
                >
                  {stat.title}
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{
                    color: isDark ? "#ffffff" : "#111827", // white di dark, gray-900 di light
                  }}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Employees List */}
        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: isDark
              ? "rgba(17, 24, 39, 0.8)"
              : "rgba(255, 255, 255, 0.9)",
            borderColor: isDark
              ? "rgba(75, 85, 99, 0.3)"
              : "rgba(203, 213, 225, 0.5)",
            boxShadow: isDark
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
          }}
        >
          <div
            className="flex items-center justify-between mb-6 pb-3 border-b"
            style={{
              borderColor: isDark
                ? "rgba(75, 85, 99, 0.3)"
                : "rgba(203, 213, 225, 0.4)",
            }}
          >
            <div>
              <h2
                className="text-lg font-semibold flex items-center"
                style={{
                  color: isDark ? "#ffffff" : "#111827",
                }}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    color: isDark ? "#a5b4fc" : "#4f46e5",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Recent Employees
              </h2>
              <p
                className="text-xs mt-1"
                style={{
                  color: isDark ? "#9ca3af" : "#64748b",
                }}
              >
                Latest 5 employees
              </p>
            </div>
            <Link
              to="/employees"
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: isDark
                  ? "rgba(79, 70, 229, 0.2)"
                  : "rgba(239, 246, 255, 0.8)",
                color: isDark ? "#a5b4fc" : "#4f46e5",
                border: `1px solid ${
                  isDark ? "rgba(99, 102, 241, 0.3)" : "rgba(79, 70, 229, 0.2)"
                }`,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark
                  ? "rgba(79, 70, 229, 0.3)"
                  : "rgba(219, 234, 254, 0.9)";
                e.target.style.boxShadow = "0 4px 12px rgba(79, 70, 229, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDark
                  ? "rgba(79, 70, 229, 0.2)"
                  : "rgba(239, 246, 255, 0.8)";
                e.target.style.boxShadow = "none";
              }}
            >
              View all
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div
            className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent space-y-4 pr-2"
            style={{
              maxHeight: "320px", // Limit height to enable scrolling
            }}
          >
            {stats.recentEmployees.map((employee, index) => (
              <div
                key={employee.id}
                className="flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                style={{
                  backgroundColor: isDark
                    ? "rgba(55, 65, 81, 0.3)"
                    : "rgba(248, 250, 252, 0.6)",
                  animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark
                    ? "rgba(55, 65, 81, 0.5)"
                    : "rgba(241, 245, 249, 0.8)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDark
                    ? "rgba(55, 65, 81, 0.3)"
                    : "rgba(248, 250, 252, 0.6)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="relative">
                  <img
                    src={
                      employee.image ||
                      "https://via.placeholder.com/40x40?text=👤"
                    }
                    alt={employee.name}
                    className="w-12 h-12 rounded-full object-cover border-2 transition-all duration-200"
                    style={{
                      borderColor: isDark
                        ? "rgba(75, 85, 99, 0.4)"
                        : "rgba(203, 213, 225, 0.6)",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/40x40?text=👤";
                    }}
                  />
                  <div
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 bg-green-400"
                    style={{
                      borderColor: isDark ? "#111827" : "#ffffff",
                    }}
                    title="Active"
                  ></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate mb-1"
                    style={{
                      color: isDark ? "#ffffff" : "#111827",
                    }}
                  >
                    {employee.name}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{
                      color: isDark ? "#9ca3af" : "#64748b",
                    }}
                  >
                    {employee.position}
                  </p>
                  <p
                    className="text-xs truncate mt-1"
                    style={{
                      color: isDark ? "#6b7280" : "#94a3b8",
                    }}
                  >
                    📂 {employee.division.name}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(34, 197, 94, 0.2)"
                        : "rgba(220, 252, 231, 0.8)",
                      color: isDark ? "#4ade80" : "#16a34a",
                    }}
                  >
                    ✓ Active
                  </span>
                </div>
              </div>
            ))}
          </div>

          {stats.recentEmployees.length === 0 && (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  color: isDark ? "#6b7280" : "#9ca3af",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p
                className="text-sm font-medium mb-2"
                style={{
                  color: isDark ? "#9ca3af" : "#64748b",
                }}
              >
                No employees found
              </p>
              <p
                className="text-xs"
                style={{
                  color: isDark ? "#6b7280" : "#94a3b8",
                }}
              >
                Start by adding your first employee
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: isDark
              ? "rgba(17, 24, 39, 0.8)"
              : "rgba(255, 255, 255, 0.9)",
            borderColor: isDark
              ? "rgba(75, 85, 99, 0.3)"
              : "rgba(203, 213, 225, 0.5)",
            boxShadow: isDark
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
          }}
        >
          <h2
            className="text-lg font-semibold mb-6"
            style={{
              color: isDark ? "#ffffff" : "#111827", // white di dark, gray-900 di light
            }}
          >
            Quick Actions
          </h2>

          <div className="space-y-4">
            <Link
              to="/employees?action=add"
              className="flex items-center p-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
              style={{
                backgroundColor: isDark
                  ? "rgba(79, 70, 229, 0.1)"
                  : "rgba(239, 246, 255, 0.7)",
                borderLeft: isDark
                  ? "4px solid rgba(99, 102, 241, 0.6)"
                  : "4px solid rgba(79, 70, 229, 0.8)",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark
                  ? "rgba(79, 70, 229, 0.2)"
                  : "rgba(219, 234, 254, 0.8)";
                e.target.style.boxShadow = "0 4px 12px rgba(79, 70, 229, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDark
                  ? "rgba(79, 70, 229, 0.1)"
                  : "rgba(239, 246, 255, 0.7)";
                e.target.style.boxShadow = "none";
              }}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p
                  className="text-sm font-medium"
                  style={{
                    color: isDark ? "#a5b4fc" : "#4f46e5",
                  }}
                >
                  Add New Employee
                </p>
                <p
                  className="text-xs"
                  style={{
                    color: isDark ? "#818cf8" : "#6366f1",
                  }}
                >
                  Create a new employee record
                </p>
              </div>
            </Link>

            <Link
              to="/employees"
              className="flex items-center p-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
              style={{
                backgroundColor: isDark
                  ? "rgba(147, 51, 234, 0.1)"
                  : "rgba(250, 245, 255, 0.7)",
                borderLeft: isDark
                  ? "4px solid rgba(168, 85, 247, 0.6)"
                  : "4px solid rgba(147, 51, 234, 0.8)",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark
                  ? "rgba(147, 51, 234, 0.2)"
                  : "rgba(243, 232, 255, 0.8)";
                e.target.style.boxShadow =
                  "0 4px 12px rgba(147, 51, 234, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDark
                  ? "rgba(147, 51, 234, 0.1)"
                  : "rgba(250, 245, 255, 0.7)";
                e.target.style.boxShadow = "none";
              }}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p
                  className="text-sm font-medium"
                  style={{
                    color: isDark ? "#c4b5fd" : "#7c3aed",
                  }}
                >
                  Search Employees
                </p>
                <p
                  className="text-xs"
                  style={{
                    color: isDark ? "#a78bfa" : "#8b5cf6",
                  }}
                >
                  Find and manage employee records
                </p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="flex items-center p-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
              style={{
                backgroundColor: isDark
                  ? "rgba(59, 130, 246, 0.1)"
                  : "rgba(239, 246, 255, 0.7)",
                borderLeft: isDark
                  ? "4px solid rgba(96, 165, 250, 0.6)"
                  : "4px solid rgba(59, 130, 246, 0.8)",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark
                  ? "rgba(59, 130, 246, 0.2)"
                  : "rgba(219, 234, 254, 0.8)";
                e.target.style.boxShadow =
                  "0 4px 12px rgba(59, 130, 246, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDark
                  ? "rgba(59, 130, 246, 0.1)"
                  : "rgba(239, 246, 255, 0.7)";
                e.target.style.boxShadow = "none";
              }}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
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
              <div className="ml-4">
                <p
                  className="text-sm font-medium"
                  style={{
                    color: isDark ? "#93c5fd" : "#2563eb",
                  }}
                >
                  Update Profile
                </p>
                <p
                  className="text-xs"
                  style={{
                    color: isDark ? "#60a5fa" : "#3b82f6",
                  }}
                >
                  Manage your account settings
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
