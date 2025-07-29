<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\EmployeeController;

// Route untuk login (tidak memerlukan auth)
Route::post('/login', [AuthController::class, 'login'])->middleware('guest.admin');

// Route yang memerlukan autentikasi
Route::middleware('auth:sanctum')->group(function () {
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Divisions
    Route::get('/divisions', [DivisionController::class, 'index']);
    
    // Employees
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::post('/employees', [EmployeeController::class, 'store']);
    Route::put('/employees/{employee}', [EmployeeController::class, 'update']);
    Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy']);
});
