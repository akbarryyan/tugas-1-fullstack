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
    const loadDashboardData = () => {
      try {
        // Get all employees
        const employeesResult = employeesService.getAll(
          {},
          { page: 1, limit: 100 }
        );
        const employees = employeesResult.data;

        // Get all divisions
        const divisions = divisionsService.getAll();

        // Calculate stats
        const totalEmployees = employees.length;
        const totalDivisions = divisions.length;
        const activeEmployees = employees.length; // All employees are considered active for now
        const recentEmployees = employees.slice(0, 5); // Last 5 employees

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
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-lg font-semibold"
              style={{
                color: isDark ? "#ffffff" : "#111827", // white di dark, gray-900 di light
              }}
            >
              Recent Employees
            </h2>
            <Link
              to="/employees"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium"
            >
              View all →
            </Link>
          </div>

          <div className="space-y-4">
            {stats.recentEmployees.map((employee) => (
              <div key={employee.id} className="flex items-center space-x-4">
                <img
                  src={employee.image}
                  alt={employee.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{
                      color: isDark ? "#ffffff" : "#111827", // white di dark, gray-900 di light
                    }}
                  >
                    {employee.name}
                  </p>
                  <p
                    className="text-sm truncate"
                    style={{
                      color: isDark ? "#9ca3af" : "#64748b",
                    }}
                  >
                    {employee.position} • {employee.division.name}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="badge badge-indigo">Active</span>
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
                style={{
                  color: isDark ? "#9ca3af" : "#64748b",
                }}
              >
                No employees found
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
