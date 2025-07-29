// Employee service for local storage management
const STORAGE_KEY = "employees_data";
const DIVISIONS_KEY = "divisions_data";

// Helper function to trigger storage change event
const triggerStorageChange = (key, newValue) => {
  const event = new CustomEvent("localStorageChange", {
    detail: { key, newValue },
  });
  window.dispatchEvent(event);
};

// Mock divisions data
const defaultDivisions = [
  { id: "div-001", name: "Mobile Apps" },
  { id: "div-002", name: "QA" },
  { id: "div-003", name: "Full Stack" },
  { id: "div-004", name: "Backend" },
  { id: "div-005", name: "Frontend" },
  { id: "div-006", name: "UI/UX Designer" },
];

// Mock employees data
const defaultEmployees = [
  {
    id: "emp-001",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "John Anderson",
    phone: "+62 812-3456-7891",
    division: { id: "div-005", name: "Frontend" },
    position: "Senior Frontend Developer",
  },
  {
    id: "emp-002",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b9e65a05?w=150&h=150&fit=crop&crop=face",
    name: "Sarah Wilson",
    phone: "+62 812-3456-7892",
    division: { id: "div-006", name: "UI/UX Designer" },
    position: "Lead UI/UX Designer",
  },
  {
    id: "emp-003",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Michael Chen",
    phone: "+62 812-3456-7893",
    division: { id: "div-004", name: "Backend" },
    position: "Backend Developer",
  },
  {
    id: "emp-004",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    name: "Emily Rodriguez",
    phone: "+62 812-3456-7894",
    division: { id: "div-001", name: "Mobile Apps" },
    position: "Mobile Developer",
  },
  {
    id: "emp-005",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "David Kim",
    phone: "+62 812-3456-7895",
    division: { id: "div-002", name: "QA" },
    position: "QA Engineer",
  },
  {
    id: "emp-006",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Lisa Thompson",
    phone: "+62 812-3456-7896",
    division: { id: "div-003", name: "Full Stack" },
    position: "Full Stack Developer",
  },
];

// Initialize data if not exists
const initializeData = () => {
  if (!localStorage.getItem(DIVISIONS_KEY)) {
    localStorage.setItem(DIVISIONS_KEY, JSON.stringify(defaultDivisions));
  }

  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEmployees));
  }
};

// Divisions service
export const divisionsService = {
  getAll: (filters = {}) => {
    const divisions = JSON.parse(localStorage.getItem(DIVISIONS_KEY) || "[]");

    let filtered = divisions;

    if (filters.name) {
      filtered = filtered.filter((div) =>
        div.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    return filtered;
  },
};

// Employees service
export const employeesService = {
  getAll: (filters = {}, pagination = { page: 1, limit: 6 }) => {
    initializeData();

    const employees = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    let filtered = employees;

    // Apply filters
    if (filters.name) {
      filtered = filtered.filter((emp) =>
        emp.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.division_id) {
      filtered = filtered.filter(
        (emp) => emp.division.id === filters.division_id
      );
    }

    // Calculate pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / pagination.limit);
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedData = filtered.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        current_page: pagination.page,
        per_page: pagination.limit,
        total: total,
        last_page: totalPages,
        from: startIndex + 1,
        to: Math.min(endIndex, total),
      },
    };
  },

  getById: (id) => {
    const employees = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return employees.find((emp) => emp.id === id);
  },

  create: (data) => {
    initializeData();
    const employees = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const divisions = JSON.parse(localStorage.getItem(DIVISIONS_KEY) || "[]");

    const division = divisions.find((div) => div.id === data.division);
    if (!division) {
      throw new Error("Division not found");
    }

    const newEmployee = {
      id: "emp-" + Date.now().toString(),
      image:
        data.image ||
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      name: data.name,
      phone: data.phone,
      division: division,
      position: data.position,
    };

    employees.push(newEmployee);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    triggerStorageChange(STORAGE_KEY, employees);

    return newEmployee;
  },

  update: (id, data) => {
    const employees = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const divisions = JSON.parse(localStorage.getItem(DIVISIONS_KEY) || "[]");

    const index = employees.findIndex((emp) => emp.id === id);
    if (index === -1) {
      throw new Error("Employee not found");
    }

    if (data.division) {
      const division = divisions.find((div) => div.id === data.division);
      if (!division) {
        throw new Error("Division not found");
      }
      data.division = division;
    }

    employees[index] = { ...employees[index], ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    triggerStorageChange(STORAGE_KEY, employees);

    return employees[index];
  },

  delete: (id) => {
    const employees = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const filtered = employees.filter((emp) => emp.id !== id);

    if (filtered.length === employees.length) {
      throw new Error("Employee not found");
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    triggerStorageChange(STORAGE_KEY, filtered);
    return true;
  },
};

// Initialize data on module load
initializeData();
