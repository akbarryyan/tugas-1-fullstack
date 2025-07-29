import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  employeesService,
  divisionsService,
} from "../services/employeeService";
import { useTheme } from "../contexts/ThemeContext";

const Employees = () => {
  const { isDark } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    division: "",
    position: "",
    image: "",
  });
  const [filters, setFilters] = useState({
    name: searchParams.get("name") || "",
    division_id: searchParams.get("division_id") || "",
  });
  const [pagination, setPagination] = useState({
    current_page: parseInt(searchParams.get("page")) || 1,
    per_page: 6,
    total: 0,
    last_page: 1,
  });

  // Load data
  useEffect(() => {
    loadEmployees();
    loadDivisions();
  }, [filters, pagination.current_page]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.name) params.set("name", filters.name);
    if (filters.division_id) params.set("division_id", filters.division_id);
    if (pagination.current_page > 1)
      params.set("page", pagination.current_page.toString());

    setSearchParams(params);
  }, [filters, pagination.current_page, setSearchParams]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const result = employeesService.getAll(filters, {
        page: pagination.current_page,
        limit: pagination.per_page,
      });
      setEmployees(result.data);
      setPagination((prev) => ({ ...prev, ...result.pagination }));
    } catch (error) {
      console.error("Error loading employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDivisions = () => {
    try {
      const result = divisionsService.getAll();
      setDivisions(result);
    } catch (error) {
      console.error("Error loading divisions:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    loadEmployees();
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
  };

  // Show notification function
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      // Simulate API loading delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (editingEmployee) {
        employeesService.update(editingEmployee.id, formData);
        setShowModal(false);
        setEditingEmployee(null);
        setFormData({
          name: "",
          phone: "",
          division: "",
          position: "",
          image: "",
        });
        loadEmployees();
        showNotification("success", "Employee updated successfully!");
      } else {
        employeesService.create(formData);
        setShowModal(false);
        setEditingEmployee(null);
        setFormData({
          name: "",
          phone: "",
          division: "",
          position: "",
          image: "",
        });
        loadEmployees();
        showNotification("success", "Employee added successfully!");
      }
    } catch (error) {
      showNotification("error", "Error saving employee: " + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      phone: employee.phone,
      division: employee.division.id,
      position: employee.position,
      image: employee.image,
    });
    setShowModal(true);
  };

  const handleView = (employee) => {
    setViewingEmployee(employee);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingEmployee(null);
  };

  const handleDelete = (employee) => {
    setDeletingEmployee(employee);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingEmployee) return;

    setDeleteLoading(true);
    try {
      // Simulate API loading delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      employeesService.delete(deletingEmployee.id);
      setShowDeleteModal(false);
      setDeletingEmployee(null);
      loadEmployees();
      showNotification(
        "success",
        `${deletingEmployee.name} has been deleted successfully!`
      );
    } catch (error) {
      showNotification("error", "Error deleting employee: " + error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingEmployee(null);
  };

  const resetForm = () => {
    setFormData({ name: "", phone: "", division: "", position: "", image: "" });
    setEditingEmployee(null);
    setShowModal(false);
  };

  if (loading && employees.length === 0) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <style>
        {`
          .filter-input::placeholder {
            color: ${isDark ? "#9ca3af" : "#6b7280"};
          }
        `}
      </style>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{
              color: isDark ? "#ffffff" : "#111827",
            }}
          >
            Employees
          </h1>
          <p
            className="mt-2"
            style={{
              color: isDark ? "#9ca3af" : "#4b5563",
            }}
          >
            Manage your employee records
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-6 py-3 mt-4 sm:mt-0 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800"
        >
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Employee
        </button>
      </div>

      {/* Filters */}
      <div
        className="p-6 rounded-xl shadow-lg border"
        style={{
          backgroundColor: isDark
            ? "rgba(17, 24, 39, 0.8)"
            : "rgba(248, 250, 252, 0.9)",
          borderColor: isDark
            ? "rgba(75, 85, 99, 0.5)"
            : "rgba(203, 213, 225, 0.7)",
        }}
      >
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: isDark ? "#d1d5db" : "#374151",
              }}
            >
              Search by Name
            </label>
            <input
              type="text"
              className="filter-input w-full px-4 py-3 rounded-xl border shadow-sm transition-all duration-200 focus:outline-none focus:ring-4"
              style={{
                backgroundColor: isDark ? "#374151" : "#ffffff",
                borderColor: isDark ? "#4b5563" : "#d1d5db",
                color: isDark ? "#ffffff" : "#111827",
              }}
              placeholder="Employee name..."
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = isDark
                  ? "#818cf8"
                  : "#4f46e5";
                e.currentTarget.style.boxShadow = `0 0 0 4px ${
                  isDark ? "rgba(129, 140, 248, 0.2)" : "rgba(79, 70, 229, 0.1)"
                }`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = isDark
                  ? "#4b5563"
                  : "#d1d5db";
                e.currentTarget.style.boxShadow =
                  "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
              }}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: isDark ? "#d1d5db" : "#374151",
              }}
            >
              Filter by Division
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border shadow-sm transition-all duration-200 focus:outline-none focus:ring-4"
              style={{
                backgroundColor: isDark ? "#374151" : "#ffffff",
                borderColor: isDark ? "#4b5563" : "#d1d5db",
                color: isDark ? "#ffffff" : "#111827",
              }}
              value={filters.division_id}
              onChange={(e) =>
                handleFilterChange("division_id", e.target.value)
              }
              onFocus={(e) => {
                e.currentTarget.style.borderColor = isDark
                  ? "#818cf8"
                  : "#4f46e5";
                e.currentTarget.style.boxShadow = `0 0 0 4px ${
                  isDark ? "rgba(129, 140, 248, 0.2)" : "rgba(79, 70, 229, 0.1)"
                }`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = isDark
                  ? "#4b5563"
                  : "#d1d5db";
                e.currentTarget.style.boxShadow =
                  "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
              }}
            >
              <option
                value=""
                style={{
                  backgroundColor: isDark ? "#374151" : "#ffffff",
                  color: isDark ? "#ffffff" : "#111827",
                }}
              >
                All Divisions
              </option>
              {divisions.map((division) => (
                <option
                  key={division.id}
                  value={division.id}
                  style={{
                    backgroundColor: isDark ? "#374151" : "#ffffff",
                    color: isDark ? "#ffffff" : "#111827",
                  }}
                >
                  {division.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800"
            >
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </button>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setFilters({ name: "", division_id: "" });
                setPagination((prev) => ({ ...prev, current_page: 1 }));
              }}
              className="w-full flex items-center justify-center px-6 py-3 font-semibold rounded-xl border shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4"
              style={{
                backgroundColor: isDark ? "#374151" : "#f1f5f9",
                borderColor: isDark ? "#4b5563" : "#cbd5e1",
                color: isDark ? "#d1d5db" : "#475569",
                "--focus-ring-color": isDark
                  ? "rgba(156, 163, 175, 0.5)"
                  : "rgba(148, 163, 184, 0.5)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark
                  ? "#4b5563"
                  : "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDark
                  ? "#374151"
                  : "#f1f5f9";
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 4px ${
                  isDark
                    ? "rgba(156, 163, 175, 0.5)"
                    : "rgba(148, 163, 184, 0.5)"
                }`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
              }}
            >
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div
        className="p-4 sm:p-6 lg:p-8 backdrop-blur-sm shadow-xl rounded-xl border"
        style={{
          backgroundColor: isDark
            ? "rgba(17, 24, 39, 0.95)"
            : "rgba(248, 250, 252, 0.95)",
          borderColor: isDark
            ? "rgba(75, 85, 99, 0.5)"
            : "rgba(203, 213, 225, 0.7)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2.5 sm:p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="text-base sm:text-lg font-semibold"
                style={{
                  color: isDark ? "#ffffff" : "#111827",
                }}
              >
                Employee Directory
              </h3>
              <p
                className="text-xs sm:text-sm mt-0.5"
                style={{
                  color: isDark ? "#9ca3af" : "#64748b",
                }}
              >
                Showing {pagination.from || 0} to {pagination.to || 0} of{" "}
                <span
                  className="font-semibold"
                  style={{
                    color: isDark ? "#818cf8" : "#4f46e5",
                  }}
                >
                  {pagination.total}
                </span>{" "}
                employees
              </p>
            </div>
          </div>

          {employees.length > 0 && (
            <div className="flex items-center justify-center sm:justify-end">
              <div
                className="flex items-center space-x-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border"
                style={{
                  backgroundColor: isDark
                    ? "rgba(16, 185, 129, 0.1)"
                    : "rgba(236, 253, 245, 0.8)",
                  borderColor: isDark
                    ? "rgba(16, 185, 129, 0.3)"
                    : "rgba(16, 185, 129, 0.2)",
                }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span
                  className="text-xs font-medium"
                  style={{
                    color: isDark ? "#10b981" : "#047857",
                  }}
                >
                  Live Data
                </span>
              </div>
            </div>
          )}
        </div>

        {employees.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-30 scale-150"
                style={{
                  background: isDark
                    ? "linear-gradient(to right, rgba(79, 70, 229, 0.2), rgba(147, 51, 234, 0.2))"
                    : "linear-gradient(to right, rgba(165, 180, 252, 0.3), rgba(196, 181, 253, 0.3))",
                }}
              ></div>
              <div
                className="relative p-8 rounded-2xl border mx-auto max-w-md"
                style={{
                  backgroundColor: isDark
                    ? "rgba(17, 24, 39, 0.8)"
                    : "rgba(248, 250, 252, 0.9)",
                  borderColor: isDark
                    ? "rgba(75, 85, 99, 0.5)"
                    : "rgba(203, 213, 225, 0.7)",
                }}
              >
                <div className="relative mb-6">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                    style={{
                      background: isDark
                        ? "linear-gradient(to bottom right, rgba(79, 70, 229, 0.4), rgba(147, 51, 234, 0.4))"
                        : "linear-gradient(to bottom right, rgba(165, 180, 252, 0.6), rgba(196, 181, 253, 0.6))",
                    }}
                  >
                    <svg
                      className="w-10 h-10"
                      style={{
                        color: isDark ? "#818cf8" : "#4f46e5",
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-3 h-3 text-yellow-800"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                <h3
                  className="text-xl font-bold mb-3"
                  style={{
                    color: isDark ? "#ffffff" : "#111827",
                  }}
                >
                  {filters.name || filters.division_id
                    ? "No matching employees"
                    : "No employees yet"}
                </h3>
                <p
                  className="mb-6 leading-relaxed"
                  style={{
                    color: isDark ? "#9ca3af" : "#64748b",
                  }}
                >
                  {filters.name || filters.division_id
                    ? "We couldn't find any employees matching your search criteria. Try adjusting your filters or search terms."
                    : "Your employee directory is empty. Start building your team by adding your first employee."}
                </p>

                <div className="space-y-4">
                  <button
                    onClick={() => setShowModal(true)}
                    style={{
                      background: isDark
                        ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                        : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      border: "none",
                      borderRadius: "16px",
                      color: "white",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      padding: "14px 20px",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: isDark
                        ? "0 10px 25px rgba(99, 102, 241, 0.25), 0 4px 12px rgba(79, 70, 229, 0.15)"
                        : "0 10px 25px rgba(99, 102, 241, 0.3), 0 4px 12px rgba(139, 92, 246, 0.2)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px) scale(1.02)";
                      e.target.style.boxShadow = isDark
                        ? "0 15px 35px rgba(99, 102, 241, 0.35), 0 6px 16px rgba(79, 70, 229, 0.25)"
                        : "0 15px 35px rgba(99, 102, 241, 0.4), 0 6px 16px rgba(139, 92, 246, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0) scale(1)";
                      e.target.style.boxShadow = isDark
                        ? "0 10px 25px rgba(99, 102, 241, 0.25), 0 4px 12px rgba(79, 70, 229, 0.15)"
                        : "0 10px 25px rgba(99, 102, 241, 0.3), 0 4px 12px rgba(139, 92, 246, 0.2)";
                    }}
                    onMouseDown={(e) => {
                      e.target.style.transform = "translateY(0) scale(0.98)";
                    }}
                    onMouseUp={(e) => {
                      e.target.style.transform = "translateY(-2px) scale(1.02)";
                    }}
                  >
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="whitespace-nowrap">
                      Add First Employee
                    </span>
                  </button>

                  {(filters.name || filters.division_id) && (
                    <button
                      onClick={() => {
                        setFilters({ name: "", division_id: "" });
                        setPagination((prev) => ({ ...prev, current_page: 1 }));
                      }}
                      style={{
                        background: isDark
                          ? "rgba(31, 41, 55, 0.8)"
                          : "rgba(255, 255, 255, 0.9)",
                        border: isDark
                          ? "2px solid rgba(99, 102, 241, 0.6)"
                          : "2px solid rgba(99, 102, 241, 0.8)",
                        borderRadius: "14px",
                        color: isDark ? "#e5e7eb" : "#374151",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        padding: "12px 18px",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: isDark
                          ? "0 4px 12px rgba(0, 0, 0, 0.25)"
                          : "0 4px 12px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(10px)",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = isDark
                          ? "rgba(99, 102, 241, 0.15)"
                          : "rgba(99, 102, 241, 0.05)";
                        e.target.style.borderColor = isDark
                          ? "rgba(99, 102, 241, 0.8)"
                          : "rgba(99, 102, 241, 1)";
                        e.target.style.transform =
                          "translateY(-1px) scale(1.01)";
                        e.target.style.boxShadow = isDark
                          ? "0 6px 18px rgba(0, 0, 0, 0.35)"
                          : "0 6px 18px rgba(0, 0, 0, 0.15)";
                        e.target.style.color = isDark ? "#f3f4f6" : "#1f2937";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = isDark
                          ? "rgba(31, 41, 55, 0.8)"
                          : "rgba(255, 255, 255, 0.9)";
                        e.target.style.borderColor = isDark
                          ? "rgba(99, 102, 241, 0.6)"
                          : "rgba(99, 102, 241, 0.8)";
                        e.target.style.transform = "translateY(0) scale(1)";
                        e.target.style.boxShadow = isDark
                          ? "0 4px 12px rgba(0, 0, 0, 0.25)"
                          : "0 4px 12px rgba(0, 0, 0, 0.1)";
                        e.target.style.color = isDark ? "#e5e7eb" : "#374151";
                      }}
                      onMouseDown={(e) => {
                        e.target.style.transform = "translateY(0) scale(0.98)";
                      }}
                      onMouseUp={(e) => {
                        e.target.style.transform =
                          "translateY(-1px) scale(1.01)";
                      }}
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span className="whitespace-nowrap">Clear Filters</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {employees.map((employee, index) => (
              <div
                key={employee.id}
                className={`group card p-4 sm:p-6 card-hover relative overflow-hidden transition-all duration-300 animate-slide-in-left ${
                  isDark
                    ? "bg-gray-800/50 border border-gray-700/50 hover:border-indigo-500/50 hover:bg-gray-800/70"
                    : "bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-lg"
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
                onMouseEnter={(e) => {
                  if (!isDark) {
                    e.target.style.transform = "translateY(-2px)";
                  } else {
                    e.target.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                }}
              >
                {/* Background Pattern */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isDark
                      ? "bg-gradient-to-br from-indigo-900/20 to-purple-900/20"
                      : "bg-gradient-to-br from-indigo-50/80 to-purple-50/80"
                  }`}
                ></div>

                {/* Content */}
                <div className="relative">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="relative">
                      <img
                        src={employee.image}
                        alt={employee.name}
                        className={`w-16 h-16 rounded-2xl object-cover shadow-lg ring-4 transition-all duration-300 ${
                          isDark
                            ? "ring-gray-800 group-hover:ring-indigo-600"
                            : "ring-white group-hover:ring-indigo-300"
                        }`}
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 shadow-sm ${
                          isDark ? "border-gray-800" : "border-white"
                        }`}
                      >
                        <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-lg font-bold truncate transition-colors duration-200 ${
                          isDark
                            ? "text-white group-hover:text-indigo-400"
                            : "text-gray-900 group-hover:text-indigo-600"
                        }`}
                      >
                        {employee.name}
                      </h3>
                      <p
                        className={`text-sm font-medium truncate ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {employee.position}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-0 mb-6">
                    <div
                      className={`flex items-center text-sm rounded-lg p-3 transition-colors duration-200 ${
                        isDark
                          ? "bg-gray-800/50 text-gray-400 group-hover:bg-indigo-900/20"
                          : "bg-slate-50 text-slate-600 group-hover:bg-indigo-50"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-lg mr-3 ${
                          isDark ? "bg-indigo-900/40" : "bg-indigo-100"
                        }`}
                      >
                        <svg
                          className={`w-3.5 h-3.5 ${
                            isDark ? "text-indigo-400" : "text-indigo-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">{employee.phone}</span>
                    </div>

                    <div
                      className={`flex items-center text-sm rounded-lg p-3 transition-colors duration-200 ${
                        isDark
                          ? "bg-gray-800/50 text-gray-400 group-hover:bg-purple-900/20"
                          : "bg-slate-50 text-slate-600 group-hover:bg-purple-50"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-lg mr-3 ${
                          isDark ? "bg-purple-900/40" : "bg-purple-100"
                        }`}
                      >
                        <svg
                          className={`w-3.5 h-3.5 ${
                            isDark ? "text-purple-400" : "text-purple-600"
                          }`}
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
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold border shadow-sm ${
                          isDark
                            ? "bg-purple-900/30 text-purple-300 border-purple-800"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}
                      >
                        {employee.division.name}
                      </span>
                    </div>
                  </div>{" "}
                  <div className="flex flex-col xs:flex-row gap-2 xs:gap-2">
                    <button
                      onClick={() => handleView(employee)}
                      className={`flex-1 flex items-center justify-center px-2.5 sm:px-3 py-2 font-semibold text-xs sm:text-sm rounded-lg border shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 ${
                        isDark
                          ? "bg-gray-800/20 text-gray-300 border-gray-700 hover:bg-gray-800/30 hover:border-gray-600 hover:text-gray-200 focus:ring-gray-900/50"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-700 focus:ring-slate-100"
                      }`}
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1"
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
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(employee)}
                      className={`flex-1 flex items-center justify-center px-2.5 sm:px-3 py-2 font-semibold text-xs sm:text-sm rounded-lg border shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 ${
                        isDark
                          ? "bg-blue-900/20 text-blue-300 border-blue-800 hover:bg-blue-900/30 hover:border-blue-700 hover:text-blue-200 focus:ring-blue-900/50"
                          : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700 focus:ring-blue-100"
                      }`}
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1"
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
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(employee)}
                      className={`flex-1 flex items-center justify-center px-2.5 sm:px-3 py-2 font-semibold text-xs sm:text-sm rounded-lg border shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 ${
                        isDark
                          ? "bg-red-900/20 text-red-300 border-red-800 hover:bg-red-900/30 hover:border-red-700 hover:text-red-200 focus:ring-red-900/50"
                          : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300 hover:text-red-700 focus:ring-red-100"
                      }`}
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="mt-6 sm:mt-8 lg:mt-10 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              <div className="flex flex-col space-y-4">
                {/* Page Info */}
                <div className="flex justify-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() =>
                      handlePageChange(pagination.current_page - 1)
                    }
                    disabled={pagination.current_page === 1}
                    className="flex items-center justify-center px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800 transition-colors duration-200 min-w-[70px]"
                  >
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Prev
                  </button>

                  {/* Mobile page numbers - simplified */}
                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: Math.min(3, pagination.last_page) },
                      (_, i) => {
                        let page;
                        if (pagination.last_page <= 3) {
                          page = i + 1;
                        } else if (pagination.current_page <= 2) {
                          page = i + 1;
                        } else if (
                          pagination.current_page >=
                          pagination.last_page - 1
                        ) {
                          page = pagination.last_page - 2 + i;
                        } else {
                          page = pagination.current_page - 1 + i;
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 min-w-[36px] ${
                              page === pagination.current_page
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                                : "text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    onClick={() =>
                      handlePageChange(pagination.current_page + 1)
                    }
                    disabled={pagination.current_page === pagination.last_page}
                    className="flex items-center justify-center px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800 transition-colors duration-200 min-w-[70px]"
                  >
                    Next
                    <svg
                      className="w-3 h-3 ml-1"
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
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800 transition-colors duration-200 min-w-[100px]"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from(
                    { length: Math.min(5, pagination.last_page) },
                    (_, i) => {
                      let page;
                      if (pagination.last_page <= 5) {
                        page = i + 1;
                      } else if (pagination.current_page <= 3) {
                        page = i + 1;
                      } else if (
                        pagination.current_page >=
                        pagination.last_page - 2
                      ) {
                        page = pagination.last_page - 4 + i;
                      } else {
                        page = pagination.current_page - 2 + i;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 min-w-[40px] ${
                            page === pagination.current_page
                              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105"
                              : "text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800 transition-colors duration-200 min-w-[100px]"
                >
                  Next
                  <svg
                    className="w-4 h-4 ml-2"
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
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div
            className="backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border animate-scale-in relative"
            style={{
              backgroundColor: isDark
                ? "rgba(31, 41, 55, 0.95)"
                : "rgba(255, 255, 255, 0.98)",
              borderColor: isDark
                ? "rgba(75, 85, 99, 0.5)"
                : "rgba(219, 234, 254, 0.8)",
            }}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2
                    className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
                    style={{
                      backgroundImage: isDark
                        ? "linear-gradient(to right, #ffffff, #a5b4fc)"
                        : "linear-gradient(to right, #1f2937, #4f46e5)",
                    }}
                  >
                    {editingEmployee ? "Edit Employee" : "Add Employee"}
                  </h2>
                  <p
                    className="text-sm mt-1"
                    style={{
                      color: isDark ? "#9ca3af" : "#6b7280",
                    }}
                  >
                    {editingEmployee
                      ? "Update employee information"
                      : "Add a new team member"}
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4"
                  style={{
                    color: isDark ? "#9ca3af" : "#6b7280",
                    backgroundColor: "transparent",
                    "--hover-bg": isDark
                      ? "rgba(55, 65, 81, 0.5)"
                      : "rgba(243, 244, 246, 0.8)",
                    "--focus-ring": isDark
                      ? "rgba(156, 163, 175, 0.3)"
                      : "rgba(209, 213, 219, 0.5)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      e.currentTarget.style.getPropertyValue("--hover-bg");
                    e.currentTarget.style.color = isDark
                      ? "#d1d5db"
                      : "#374151";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = isDark
                      ? "#9ca3af"
                      : "#6b7280";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 0 4px ${e.currentTarget.style.getPropertyValue(
                      "--focus-ring"
                    )}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: isDark ? "#d1d5db" : "#374151",
                      }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border shadow-sm transition-all duration-200 focus:outline-none focus:ring-4"
                      style={{
                        backgroundColor: isDark ? "#374151" : "#ffffff",
                        borderColor: isDark ? "#4b5563" : "#d1d5db",
                        color: isDark ? "#ffffff" : "#111827",
                        "--focus-border": isDark ? "#818cf8" : "#4f46e5",
                        "--focus-ring": isDark
                          ? "rgba(129, 140, 248, 0.2)"
                          : "rgba(79, 70, 229, 0.1)",
                      }}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          e.currentTarget.style.getPropertyValue(
                            "--focus-border"
                          );
                        e.currentTarget.style.boxShadow = `0 0 0 4px ${e.currentTarget.style.getPropertyValue(
                          "--focus-ring"
                        )}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = isDark
                          ? "#4b5563"
                          : "#d1d5db";
                        e.currentTarget.style.boxShadow =
                          "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: isDark ? "#d1d5db" : "#374151",
                      }}
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 rounded-xl border shadow-sm transition-all duration-200 focus:outline-none focus:ring-4"
                      style={{
                        backgroundColor: isDark ? "#374151" : "#ffffff",
                        borderColor: isDark ? "#4b5563" : "#d1d5db",
                        color: isDark ? "#ffffff" : "#111827",
                        "--focus-border": isDark ? "#818cf8" : "#4f46e5",
                        "--focus-ring": isDark
                          ? "rgba(129, 140, 248, 0.2)"
                          : "rgba(79, 70, 229, 0.1)",
                      }}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          e.currentTarget.style.getPropertyValue(
                            "--focus-border"
                          );
                        e.currentTarget.style.boxShadow = `0 0 0 4px ${e.currentTarget.style.getPropertyValue(
                          "--focus-ring"
                        )}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = isDark
                          ? "#4b5563"
                          : "#d1d5db";
                        e.currentTarget.style.boxShadow =
                          "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: isDark ? "#d1d5db" : "#374151",
                      }}
                    >
                      Division *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 rounded-xl border shadow-sm transition-all duration-200 focus:outline-none focus:ring-4"
                      style={{
                        backgroundColor: isDark ? "#374151" : "#ffffff",
                        borderColor: isDark ? "#4b5563" : "#d1d5db",
                        color: isDark ? "#ffffff" : "#111827",
                        "--focus-border": isDark ? "#818cf8" : "#4f46e5",
                        "--focus-ring": isDark
                          ? "rgba(129, 140, 248, 0.2)"
                          : "rgba(79, 70, 229, 0.1)",
                      }}
                      value={formData.division}
                      onChange={(e) =>
                        setFormData({ ...formData, division: e.target.value })
                      }
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          e.currentTarget.style.getPropertyValue(
                            "--focus-border"
                          );
                        e.currentTarget.style.boxShadow = `0 0 0 4px ${e.currentTarget.style.getPropertyValue(
                          "--focus-ring"
                        )}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = isDark
                          ? "#4b5563"
                          : "#d1d5db";
                        e.currentTarget.style.boxShadow =
                          "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                      }}
                    >
                      <option
                        value=""
                        style={{
                          backgroundColor: isDark ? "#374151" : "#ffffff",
                          color: isDark ? "#ffffff" : "#111827",
                        }}
                      >
                        Select Division
                      </option>
                      {divisions.map((division) => (
                        <option
                          key={division.id}
                          value={division.id}
                          style={{
                            backgroundColor: isDark ? "#374151" : "#ffffff",
                            color: isDark ? "#ffffff" : "#111827",
                          }}
                        >
                          {division.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: isDark ? "#d1d5db" : "#374151",
                      }}
                    >
                      Position *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border shadow-sm transition-all duration-200 focus:outline-none focus:ring-4"
                      style={{
                        backgroundColor: isDark ? "#374151" : "#ffffff",
                        borderColor: isDark ? "#4b5563" : "#d1d5db",
                        color: isDark ? "#ffffff" : "#111827",
                        "--focus-border": isDark ? "#818cf8" : "#4f46e5",
                        "--focus-ring": isDark
                          ? "rgba(129, 140, 248, 0.2)"
                          : "rgba(79, 70, 229, 0.1)",
                      }}
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          e.currentTarget.style.getPropertyValue(
                            "--focus-border"
                          );
                        e.currentTarget.style.boxShadow = `0 0 0 4px ${e.currentTarget.style.getPropertyValue(
                          "--focus-ring"
                        )}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = isDark
                          ? "#4b5563"
                          : "#d1d5db";
                        e.currentTarget.style.boxShadow =
                          "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: isDark ? "#d1d5db" : "#374151",
                    }}
                  >
                    Photo URL
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 rounded-xl border shadow-sm transition-all duration-200 focus:outline-none focus:ring-4"
                    placeholder="https://example.com/photo.jpg"
                    style={{
                      backgroundColor: isDark ? "#374151" : "#ffffff",
                      borderColor: isDark ? "#4b5563" : "#d1d5db",
                      color: isDark ? "#ffffff" : "#111827",
                      "--focus-border": isDark ? "#818cf8" : "#4f46e5",
                      "--focus-ring": isDark
                        ? "rgba(129, 140, 248, 0.2)"
                        : "rgba(79, 70, 229, 0.1)",
                      "--placeholder-color": isDark ? "#9ca3af" : "#6b7280",
                    }}
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        e.currentTarget.style.getPropertyValue(
                          "--focus-border"
                        );
                      e.currentTarget.style.boxShadow = `0 0 0 4px ${e.currentTarget.style.getPropertyValue(
                        "--focus-ring"
                      )}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = isDark
                        ? "#4b5563"
                        : "#d1d5db";
                      e.currentTarget.style.boxShadow =
                        "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                    }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 flex items-center justify-center px-6 py-3 font-semibold rounded-xl border shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4"
                    style={{
                      backgroundColor: isDark ? "#374151" : "#f1f5f9",
                      borderColor: isDark ? "#4b5563" : "#cbd5e1",
                      color: isDark ? "#d1d5db" : "#475569",
                      "--hover-bg": isDark ? "#4b5563" : "#e2e8f0",
                      "--focus-ring": isDark
                        ? "rgba(156, 163, 175, 0.3)"
                        : "rgba(148, 163, 184, 0.3)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        e.currentTarget.style.getPropertyValue("--hover-bg");
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isDark
                        ? "#374151"
                        : "#f1f5f9";
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 0 4px ${e.currentTarget.style.getPropertyValue(
                        "--focus-ring"
                      )}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                    }}
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800"
                  >
                    {submitLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {editingEmployee ? "Updating..." : "Adding..."}
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
                            d={
                              editingEmployee
                                ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                : "M12 6v6m0 0v6m0-6h6m-6 0H6"
                            }
                          />
                        </svg>
                        {editingEmployee ? "Update" : "Add"} Employee
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div
            className="backdrop-blur-xl rounded-2xl max-w-md w-full shadow-2xl border animate-scale-in"
            style={{
              backgroundColor: isDark
                ? "rgba(31, 41, 55, 0.95)"
                : "rgba(255, 255, 255, 0.98)",
              borderColor: isDark
                ? "rgba(75, 85, 99, 0.5)"
                : "rgba(219, 234, 254, 0.8)",
            }}
          >
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(239, 68, 68, 0.2)"
                      : "rgba(254, 226, 226, 0.8)",
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    style={{
                      color: isDark ? "#f87171" : "#dc2626",
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{
                      color: isDark ? "#ffffff" : "#111827",
                    }}
                  >
                    Delete Employee
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      color: isDark ? "#9ca3af" : "#6b7280",
                    }}
                  >
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="mb-6 sm:mb-8">
                <p
                  className="text-sm sm:text-base leading-relaxed"
                  style={{
                    color: isDark ? "#d1d5db" : "#374151",
                  }}
                >
                  Are you sure you want to delete{" "}
                  <span
                    className="font-semibold"
                    style={{
                      color: isDark ? "#ffffff" : "#111827",
                    }}
                  >
                    {deletingEmployee?.name}
                  </span>
                  ? This will permanently remove the employee from your records.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={cancelDelete}
                  disabled={deleteLoading}
                  className="flex-1 flex items-center justify-center px-4 sm:px-6 py-3 sm:py-2.5 font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl border shadow-sm hover:shadow-md transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-4 min-h-[48px] touch-manipulation"
                  style={{
                    backgroundColor: isDark ? "#374151" : "#f1f5f9",
                    borderColor: isDark ? "#4b5563" : "#cbd5e1",
                    color: isDark ? "#d1d5db" : "#475569",
                    "--hover-bg": isDark ? "#4b5563" : "#e2e8f0",
                    "--focus-ring": isDark
                      ? "rgba(156, 163, 175, 0.3)"
                      : "rgba(148, 163, 184, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      e.currentTarget.style.getPropertyValue("--hover-bg");
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark
                      ? "#374151"
                      : "#f1f5f9";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 0 4px ${e.currentTarget.style.getPropertyValue(
                      "--focus-ring"
                    )}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <svg
                    className="w-4 h-4 mr-2 sm:mr-1.5"
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
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="flex-1 flex items-center justify-center px-4 sm:px-6 py-3 sm:py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-200 dark:focus:ring-red-800 min-h-[48px] touch-manipulation"
                >
                  {deleteLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden xs:inline">Deleting...</span>
                      <span className="xs:hidden">Delete...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2 sm:mr-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span className="hidden xs:inline">Delete Employee</span>
                      <span className="xs:hidden">Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {showViewModal && viewingEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div
            className="backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border animate-scale-in"
            style={{
              backgroundColor: isDark
                ? "rgba(31, 41, 55, 0.95)"
                : "rgba(255, 255, 255, 0.98)",
              borderColor: isDark
                ? "rgba(75, 85, 99, 0.5)"
                : "rgba(219, 234, 254, 0.8)",
            }}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
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
                  </div>
                  <div>
                    <h2
                      className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
                      style={{
                        backgroundImage: isDark
                          ? "linear-gradient(to right, #ffffff, #a5b4fc)"
                          : "linear-gradient(to right, #1f2937, #4f46e5)",
                      }}
                    >
                      Employee Details
                    </h2>
                    <p
                      className="text-sm mt-1"
                      style={{
                        color: isDark ? "#9ca3af" : "#6b7280",
                      }}
                    >
                      View employee information
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeViewModal}
                  className="p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4"
                  style={{
                    color: isDark ? "#9ca3af" : "#6b7280",
                    backgroundColor: "transparent",
                    "--hover-bg": isDark
                      ? "rgba(55, 65, 81, 0.5)"
                      : "rgba(243, 244, 246, 0.8)",
                    "--focus-ring": isDark
                      ? "rgba(156, 163, 175, 0.3)"
                      : "rgba(209, 213, 219, 0.5)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      e.currentTarget.style.getPropertyValue("--hover-bg");
                    e.currentTarget.style.color = isDark
                      ? "#d1d5db"
                      : "#374151";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = isDark
                      ? "#9ca3af"
                      : "#6b7280";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 0 4px ${e.currentTarget.style.getPropertyValue(
                      "--focus-ring"
                    )}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Employee Photo Section */}
              <div
                className="flex flex-col items-center mb-8 p-6 rounded-2xl border"
                style={{
                  background: isDark
                    ? "linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(147, 51, 234, 0.15))"
                    : "linear-gradient(135deg, rgba(239, 246, 255, 0.8), rgba(245, 243, 255, 0.8))",
                  borderColor: isDark
                    ? "rgba(79, 70, 229, 0.3)"
                    : "rgba(199, 210, 254, 0.6)",
                }}
              >
                <div className="relative mb-4">
                  <img
                    src={viewingEmployee.image}
                    alt={viewingEmployee.name}
                    className="w-24 h-24 rounded-2xl object-cover shadow-xl ring-4"
                    style={{
                      ringColor: isDark ? "#374151" : "#ffffff",
                    }}
                  />
                  <div
                    className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 shadow-lg"
                    style={{
                      borderColor: isDark ? "#374151" : "#ffffff",
                    }}
                  >
                    <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h3
                  className="text-2xl font-bold mb-1"
                  style={{
                    color: isDark ? "#ffffff" : "#111827",
                  }}
                >
                  {viewingEmployee.name}
                </h3>
                <p
                  className="font-medium"
                  style={{
                    color: isDark ? "#9ca3af" : "#6b7280",
                  }}
                >
                  {viewingEmployee.position}
                </p>
              </div>

              {/* Employee Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: isDark ? "#9ca3af" : "#6b7280",
                      }}
                    >
                      Full Name
                    </label>
                    <div
                      className="p-3 rounded-lg border"
                      style={{
                        backgroundColor: isDark ? "#374151" : "#f8fafc",
                        borderColor: isDark ? "#4b5563" : "#e2e8f0",
                      }}
                    >
                      <p
                        className="font-medium"
                        style={{
                          color: isDark ? "#ffffff" : "#1e293b",
                        }}
                      >
                        {viewingEmployee.name}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: isDark ? "#9ca3af" : "#6b7280",
                      }}
                    >
                      Phone Number
                    </label>
                    <div
                      className="p-3 rounded-lg border"
                      style={{
                        backgroundColor: isDark ? "#374151" : "#f8fafc",
                        borderColor: isDark ? "#4b5563" : "#e2e8f0",
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-indigo-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <p
                          className="font-medium"
                          style={{
                            color: isDark ? "#ffffff" : "#1e293b",
                          }}
                        >
                          {viewingEmployee.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: isDark ? "#9ca3af" : "#6b7280",
                      }}
                    >
                      Division
                    </label>
                    <div
                      className="p-3 rounded-lg border"
                      style={{
                        backgroundColor: isDark ? "#374151" : "#f8fafc",
                        borderColor: isDark ? "#4b5563" : "#e2e8f0",
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-purple-500"
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
                        <p
                          className="font-medium"
                          style={{
                            color: isDark ? "#ffffff" : "#1e293b",
                          }}
                        >
                          {viewingEmployee.division.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: isDark ? "#9ca3af" : "#6b7280",
                      }}
                    >
                      Position
                    </label>
                    <div
                      className="p-3 rounded-lg border"
                      style={{
                        backgroundColor: isDark ? "#374151" : "#f8fafc",
                        borderColor: isDark ? "#4b5563" : "#e2e8f0",
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2M8 6v2m0 0v8a2 2 0 002 2h4a2 2 0 002-2v-8m-6 0h4"
                          />
                        </svg>
                        <p
                          className="font-medium"
                          style={{
                            color: isDark ? "#ffffff" : "#1e293b",
                          }}
                        >
                          {viewingEmployee.position}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-8">
                <button
                  onClick={closeViewModal}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-[60] animate-fade-in">
          <div
            className={`max-w-sm w-full rounded-lg shadow-2xl border-l-4 p-4 ${
              notification.type === "success"
                ? "bg-green-50 dark:bg-green-900 border-green-500 text-green-800 dark:text-green-200"
                : "bg-red-50 dark:bg-red-900 border-red-500 text-red-800 dark:text-red-200"
            }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {notification.type === "success" ? (
                  <svg
                    className="w-5 h-5 text-green-500"
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
                    className="w-5 h-5 text-red-500"
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
                  className="inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
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

export default Employees;
