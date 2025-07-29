// Employee service for API integration using native fetch
import { API_CONFIG, ENDPOINTS } from "../config/api.js";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

// Helper function to create headers
const createHeaders = (isFormData = false) => {
  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  headers["Accept"] = "application/json";

  const token = getAuthToken();
  console.log(
    "Auth token from getAuthToken():",
    token ? "exists" : "not found"
  );
  console.log("Token value:", token);

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Helper function to handle fetch response
const handleResponse = async (response) => {
  if (response.status === 401) {
    // Token expired or invalid, clear storage and redirect to login
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    window.location.href = "/";
    throw new Error("Unauthorized");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

// Helper function to trigger storage change event
const triggerStorageChange = (key, newValue) => {
  const event = new CustomEvent("localStorageChange", {
    detail: { key, newValue },
  });
  window.dispatchEvent(event);
};

// Get all divisions from API
export const getDivisions = async (name = "") => {
  try {
    console.log("getDivisions called with name:", name);

    const url = new URL(`${API_CONFIG.BASE_URL}${ENDPOINTS.DIVISIONS}`);
    if (name) {
      url.searchParams.append("name", name);
    }

    console.log("Making request to:", url.toString());

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    });

    console.log("Response status:", response.status);

    const data = await handleResponse(response);
    console.log("Raw divisions response data:", data);

    if (data.status === "success") {
      console.log("Divisions success, returning:", data.data.divisions);
      return {
        success: true,
        data: data.data.divisions,
        pagination: data.pagination,
      };
    }

    return { success: false, message: data.message };
  } catch (error) {
    console.error("Error fetching divisions:", error);
    return {
      success: false,
      message: error.message || "Gagal mengambil data divisi",
    };
  }
};

// Get all employees from API
export const getEmployees = async (filters = {}) => {
  try {
    const url = new URL(`${API_CONFIG.BASE_URL}${ENDPOINTS.EMPLOYEES}`);

    if (filters.name) {
      url.searchParams.append("name", filters.name);
    }
    if (filters.division_id) {
      url.searchParams.append("division_id", filters.division_id);
    }

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    });

    const data = await handleResponse(response);

    if (data.status === "success") {
      return {
        success: true,
        data: data.data.employees,
        pagination: data.pagination,
      };
    }

    return { success: false, message: data.message };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return {
      success: false,
      message: error.message || "Gagal mengambil data karyawan",
    };
  }
};

// Create new employee via API
export const createEmployee = async (employeeData) => {
  try {
    const formData = new FormData();

    if (employeeData.image) {
      formData.append("image", employeeData.image);
    }
    formData.append("name", employeeData.name);
    formData.append("phone", employeeData.phone);
    formData.append("division", employeeData.division);
    formData.append("position", employeeData.position);

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${ENDPOINTS.EMPLOYEES}`,
      {
        method: "POST",
        headers: createHeaders(true), // isFormData = true
        body: formData,
      }
    );

    const data = await handleResponse(response);

    if (data.status === "success") {
      // Trigger storage change event to update UI
      triggerStorageChange("employees_data", Date.now());

      return {
        success: true,
        message: data.message,
      };
    }

    return { success: false, message: data.message };
  } catch (error) {
    console.error("Error creating employee:", error);

    // Handle validation errors
    if (error.message.includes("422") || error.message.includes("validation")) {
      return {
        success: false,
        message: "Data tidak valid. Periksa kembali input Anda.",
      };
    }

    return {
      success: false,
      message: error.message || "Gagal menambahkan karyawan",
    };
  }
};

// Update employee via API
export const updateEmployee = async (id, employeeData) => {
  try {
    const formData = new FormData();

    if (employeeData.image && typeof employeeData.image !== "string") {
      formData.append("image", employeeData.image);
    }
    formData.append("name", employeeData.name);
    formData.append("phone", employeeData.phone);
    formData.append("division", employeeData.division);
    formData.append("position", employeeData.position);
    formData.append("_method", "PUT");

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${ENDPOINTS.EMPLOYEES}/${id}`,
      {
        method: "POST", // Laravel form spoofing requires POST with _method
        headers: createHeaders(true), // isFormData = true
        body: formData,
      }
    );

    const data = await handleResponse(response);

    if (data.status === "success") {
      // Trigger storage change event to update UI
      triggerStorageChange("employees_data", Date.now());

      return {
        success: true,
        message: data.message,
      };
    }

    return { success: false, message: data.message };
  } catch (error) {
    console.error("Error updating employee:", error);

    return {
      success: false,
      message: error.message || "Gagal mengupdate karyawan",
    };
  }
};

// Delete employee via API
export const deleteEmployee = async (id) => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${ENDPOINTS.EMPLOYEES}/${id}`,
      {
        method: "DELETE",
        headers: createHeaders(),
      }
    );

    const data = await handleResponse(response);

    if (data.status === "success") {
      // Trigger storage change event to update UI
      triggerStorageChange("employees_data", Date.now());

      return {
        success: true,
        message: data.message,
      };
    }

    return { success: false, message: data.message };
  } catch (error) {
    console.error("Error deleting employee:", error);
    return {
      success: false,
      message: error.message || "Gagal menghapus karyawan",
    };
  }
};

// Legacy support - backwards compatibility for existing components
export const divisionsService = {
  getAll: async (filters = {}) => {
    const result = await getDivisions(filters.name);
    return result.success ? result.data : [];
  },
};

export const employeesService = {
  getAll: async (filters = {}, pagination = { page: 1, limit: 6 }) => {
    const result = await getEmployees(filters);
    if (result.success) {
      return {
        data: result.data,
        pagination: result.pagination,
      };
    }
    return {
      data: [],
      pagination: {
        current_page: 1,
        per_page: pagination.limit,
        total: 0,
        last_page: 1,
        from: 0,
        to: 0,
      },
    };
  },

  getById: async (id) => {
    const result = await getEmployees();
    if (result.success) {
      return result.data.find((emp) => emp.id === id);
    }
    return null;
  },

  create: async (data) => {
    const result = await createEmployee(data);
    if (!result.success) {
      throw new Error(result.message);
    }
    return result;
  },

  update: async (id, data) => {
    const result = await updateEmployee(id, data);
    if (!result.success) {
      throw new Error(result.message);
    }
    return result;
  },

  delete: async (id) => {
    const result = await deleteEmployee(id);
    if (!result.success) {
      throw new Error(result.message);
    }
    return result;
  },
};
