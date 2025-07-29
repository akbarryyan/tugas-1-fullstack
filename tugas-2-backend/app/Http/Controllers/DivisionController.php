<?php

namespace App\Http\Controllers;

use App\Models\Division;
use Illuminate\Http\Request;

class DivisionController extends Controller
{
    public function index(Request $request)
    {
        $query = Division::query();

        if ($request->has('name') && $request->name) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        $divisions = $query->paginate(10);

        return response()->json([
            'status' => 'success',
            'message' => 'Data divisi berhasil diambil',
            'data' => [
                'divisions' => $divisions->items(),
            ],
            'pagination' => [
                'current_page' => $divisions->currentPage(),
                'last_page' => $divisions->lastPage(),
                'per_page' => $divisions->perPage(),
                'total' => $divisions->total(),
                'from' => $divisions->firstItem(),
                'to' => $divisions->lastItem(),
                'prev_page_url' => $divisions->previousPageUrl(),
                'next_page_url' => $divisions->nextPageUrl(),
            ],
        ]);
    }
}
