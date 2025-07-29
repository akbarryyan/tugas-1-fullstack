# Integrasi Frontend-Backend - Native Fetch

## Perubahan Yang Dilakukan

### ✅ **Menghapus Dependencies External**

- ❌ Removed: `axios` library
- ✅ Menggunakan: `fetch` API native JavaScript

### ✅ **File Yang Diupdate**

#### **1. employeeService.js** - Full Rewrite

- ✅ Native `fetch` API untuk semua HTTP requests
- ✅ Proper error handling dengan try-catch
- ✅ FormData support untuk file upload
- ✅ Export `divisionsService` dan `employeesService`
- ✅ Backward compatibility dengan existing components

#### **2. AuthContext.jsx** - Updated

- ✅ Native `fetch` untuk login/logout
- ✅ Removed dependency pada `apiClient.js`
- ✅ JSON parsing yang proper

#### **3. Removed Files**

- ❌ `src/utils/apiClient.js` (tidak diperlukan)

### ✅ **API Functions Available**

#### **Divisions**

```javascript
import { divisionsService } from "../services/employeeService.js";

// Get all divisions
const divisions = await divisionsService.getAll();
```

#### **Employees**

```javascript
import { employeesService } from "../services/employeeService.js";

// Get all employees
const result = await employeesService.getAll(filters, pagination);

// Create employee
await employeesService.create(employeeData);

// Update employee
await employeesService.update(id, employeeData);

// Delete employee
await employeesService.delete(id);
```

#### **Authentication**

```javascript
import { useAuth } from "../contexts/AuthContext.jsx";

const { login, logout, user, isAuthenticated } = useAuth();

// Login
const result = await login("admin", "pastibisa");
```

### ✅ **Features Yang Berfungsi**

1. **✅ Login Authentication** - Native fetch ke Laravel API
2. **✅ Employee CRUD** - Create, Read, Update, Delete
3. **✅ File Upload** - Image upload untuk employee
4. **✅ Search & Filter** - By name dan division
5. **✅ Error Handling** - User-friendly error messages
6. **✅ Loading States** - Better UX

### 🚀 **Cara Testing**

1. **Start Backend**: `cd tugas-2-backend && php artisan serve`
2. **Start Frontend**: `cd tugas-1-frontend && npm run dev`
3. **Open Browser**: http://localhost:5173
4. **Login**: admin / pastibisa
5. **Test CRUD**: Tambah, edit, hapus employee

### 🔧 **Technical Details**

#### **Fetch Configuration**

```javascript
// GET Request
const response = await fetch(url, {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// POST Request dengan JSON
const response = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(data),
});

// POST Request dengan FormData (file upload)
const formData = new FormData();
formData.append("file", file);

const response = await fetch(url, {
  method: "POST",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    // Note: Tidak set Content-Type untuk FormData
  },
  body: formData,
});
```

#### **Error Handling**

```javascript
const handleResponse = async (response) => {
  if (response.status === 401) {
    // Auto logout jika unauthorized
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
```

### ✅ **Status Integrasi**

- **Backend API**: ✅ Running on http://127.0.0.1:8000
- **Frontend**: ✅ Running on http://localhost:5173
- **Authentication**: ✅ Working
- **CRUD Operations**: ✅ Working
- **File Upload**: ✅ Working
- **Error Handling**: ✅ Working
- **No External Libraries**: ✅ Pure JavaScript

**🎉 Integrasi berhasil tanpa menggunakan library external!**
