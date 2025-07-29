<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        try {
            Log::info('Employee index called');
            
            $query = Employee::with('division');

            if ($request->has('name') && $request->name) {
                $query->where('name', 'like', '%' . $request->name . '%');
            }

            if ($request->has('division_id') && $request->division_id) {
                $query->where('division_id', $request->division_id);
            }

            Log::info('Before pagination');
            $employees = $query->paginate(10);
            Log::info('After pagination, count: ' . $employees->count());

            $employeesData = $employees->getCollection()->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'image' => $employee->image, // Now it's already a URL string
                    'name' => $employee->name,
                    'phone' => $employee->phone,
                    'division' => [
                        'id' => $employee->division->id,
                        'name' => $employee->division->name,
                    ],
                    'position' => $employee->position,
                ];
            });

            Log::info('Data mapped successfully');

            return response()->json([
                'status' => 'success',
                'message' => 'Data karyawan berhasil diambil',
                'data' => [
                    'employees' => $employeesData,
                ],
                'pagination' => [
                    'current_page' => $employees->currentPage(),
                    'last_page' => $employees->lastPage(),
                    'per_page' => $employees->perPage(),
                    'total' => $employees->total(),
                    'from' => $employees->firstItem(),
                    'to' => $employees->lastItem(),
                    'prev_page_url' => $employees->previousPageUrl(),
                    'next_page_url' => $employees->nextPageUrl(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Employee index error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Server error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(StoreEmployeeRequest $request)
    {
        $validated = $request->validated();

        // Image is now a URL string, no file processing needed

        Employee::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Karyawan berhasil ditambahkan',
        ], 201);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $validated = $request->validated();

        // Image is now a URL string, no file processing needed

        $employee->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Data karyawan berhasil diperbarui',
        ]);
    }

    public function destroy(Employee $employee)
    {
        // Note: No need to delete image files since we're using URLs now
        
        $employee->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Karyawan berhasil dihapus',
        ]);
    }
}
