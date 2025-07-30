# Tugas 3 - Fullstack Integration

Integrasi antara frontend Tugas 1 (React + Vite) dan backend Tugas 2 (Laravel) untuk sistem manajemen karyawan.

## Prerequisites

- PHP 8.1+
- Composer
- Node.js 18+
- NPM/Yarn
- MySQL

## Installation & Setup

### Backend (Laravel)

1. Navigate to backend directory:

```bash
cd tugas-2-backend
```

2. Install dependencies:

```bash
composer install
```

3. Setup environment:

```bash
cp .env.example .env
```

4. Generate application key:

```bash
php artisan key:generate
```

5. Configure database in `.env` file:

```env
DB_CONNECTION=mysql
```

6. Run migrations and seeders:

```bash
php artisan migrate --seed
```

7. Start Laravel server:

```bash
php artisan serve
```

Backend akan berjalan di: http://127.0.0.1:8000

### Frontend (React)

1. Navigate to frontend directory:

```bash
cd tugas-1-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

Frontend akan berjalan di: http://localhost:5173

## API Integration

### Authentication

- **Endpoint**: `POST /api/login`
- **Credentials**:
  - Username: `admin`
  - Password: `pastibisa`

### Available APIs

1. **Login**: `POST /api/login`
2. **Divisions**: `GET /api/divisions`
3. **Employees**:
   - `GET /api/employees` - List employees
   - `POST /api/employees` - Create employee
   - `PUT /api/employees/{id}` - Update employee
   - `DELETE /api/employees/{id}` - Delete employee

### Features Implemented

✅ **Authentication Integration**

- Frontend login form connected to Laravel Sanctum API
- JWT token management
- Automatic logout on token expiration

✅ **Employee Management**

- Real-time CRUD operations via API
- Image upload support
- Search and filter functionality
- Pagination support

✅ **Division Management**

- Fetch divisions from API
- Used in employee form dropdown

✅ **Error Handling**

- API error responses handled gracefully
- User-friendly error messages
- Loading states during API calls

✅ **CORS Configuration**

- Proper CORS setup for cross-origin requests
- Supports development and production environments

## Technologies Used

### Frontend

- React 19
- Vite
- Tailwind CSS 4
- React Router DOM

### Backend

- Laravel 11
- Laravel Sanctum for authentication
- MySQL Database
- CORS middleware

## Usage

1. Start both backend and frontend servers
2. Open http://localhost:5173 in browser
3. Login with credentials: admin / pastibisa
4. Navigate to Employee Management page
5. Perform CRUD operations on employees

## API Documentation

Detailed API documentation is available in `tugas-2-backend/API_DOCUMENTATION.md`

## File Structure

```
tugas-3-fullstack/
├── tugas-1-frontend/          # React frontend
│   ├── src/
│   │   ├── config/           # API configuration
│   │   ├── utils/            # HTTP client
│   │   ├── services/         # API services
│   │   ├── contexts/         # React contexts
│   │   ├── components/       # React components
│   │   └── pages/           # Page components
│   └── package.json
├── tugas-2-backend/          # Laravel backend
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   └── composer.json
└── README.md                # This file
```

## Changes Made for Integration

### Frontend Changes

1. **Added HTTP Client**:

   - `src/config/api.js` - API configuration

2. **Updated Services**:

   - `src/services/employeeService.js` - API integration for CRUD operations
   - Replaced localStorage with real API calls

3. **Updated Authentication**:

   - `src/contexts/AuthContext.jsx` - Laravel Sanctum integration
   - Real login API call with token management

4. **Updated Components**:
   - `src/pages/Employees.jsx` - Async/await for API calls
   - Error handling and loading states

### Backend Changes

1. **Added CORS Configuration**:

   - `config/cors.php` - CORS settings
   - `bootstrap/app.php` - CORS middleware registration

2. **API Routes**:
   - All routes properly configured in `routes/api.php`
   - Authentication middleware applied correctly

## Testing the Integration

1. **Login Test**:

   - Try login with correct and incorrect credentials
   - Verify token storage and API authorization

2. **Employee CRUD**:

   - Add new employee with image upload
   - Edit existing employee
   - Delete employee
   - Search and filter functionality

3. **Error Handling**:
   - Test network errors
   - Test validation errors
   - Test authentication failures

## Troubleshooting

### Common Issues

1. **CORS Errors**:

   - Ensure backend CORS is configured properly
   - Check if frontend URL is in allowed origins

2. **Authentication Issues**:

   - Clear localStorage if tokens are corrupted
   - Ensure backend is running and reachable

3. **API Connection**:
   - Verify backend URL in `src/config/api.js`
   - Check if both servers are running

### Development Notes

- Backend runs on port 8000
- Frontend runs on port 5173
- Database uses SQLite for development simplicity
- All API calls include proper error handling
- Loading states provide better UX
