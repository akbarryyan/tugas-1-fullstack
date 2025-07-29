<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with('division');

        if ($request->has('name') && $request->name) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->has('division_id') && $request->division_id) {
            $query->where('division_id', $request->division_id);
        }

        $employees = $query->paginate(10);

        $employeesData = $employees->getCollection()->map(function ($employee) {
            return [
                'id' => $employee->id,
                'image' => $employee->image ? url('storage/' . $employee->image) : null,
                'name' => $employee->name,
                'phone' => $employee->phone,
                'division' => [
                    'id' => $employee->division->id,
                    'name' => $employee->division->name,
                ],
                'position' => $employee->position,
            ];
        });

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
    }

    public function store(StoreEmployeeRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('employees', 'public');
        }

        Employee::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Karyawan berhasil ditambahkan',
        ], 201);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($employee->image) {
                Storage::disk('public')->delete($employee->image);
            }
            $validated['image'] = $request->file('image')->store('employees', 'public');
        }

        $employee->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Karyawan berhasil diupdate',
        ]);
    }

    public function destroy(Employee $employee)
    {
        // Delete image if exists
        if ($employee->image) {
            Storage::disk('public')->delete($employee->image);
        }

        $employee->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Karyawan berhasil dihapus',
        ]);
    }
}
