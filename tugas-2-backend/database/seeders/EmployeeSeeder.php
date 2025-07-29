<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Division;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $divisions = Division::all();

        if ($divisions->isEmpty()) {
            $this->command->warn('No divisions found. Please run DivisionSeeder first.');
            return;
        }

        $employees = [
            [
                'name' => 'Akbar Ryyan Saputra',
                'phone' => '081234567890',
                'position' => 'Backend Developer',
                'division_name' => 'Backend',
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60'
            ],
            [
                'name' => 'Siti Nurhaliza',
                'phone' => '081234567891',
                'position' => 'Frontend Developer',
                'division_name' => 'Frontend',
                'image' => 'https://images.unsplash.com/photo-1494790108755-2616b332c3c5?w=400&auto=format&fit=crop&q=60'
            ],
            [
                'name' => 'Budi Santoso',
                'phone' => '081234567892',
                'position' => 'Mobile Developer',
                'division_name' => 'Mobile Apps',
                'image' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60'
            ],
            [
                'name' => 'Andi Setiawan',
                'phone' => '081234567893',
                'position' => 'QA Engineer',
                'division_name' => 'QA',
                'image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60'
            ],
            [
                'name' => 'Maya Sari',
                'phone' => '081234567894',
                'position' => 'UI/UX Designer',
                'division_name' => 'UI/UX Designer',
                'image' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60'
            ],
            [
                'name' => 'Rizky Pratama',
                'phone' => '081234567895',
                'position' => 'Full Stack Developer',
                'division_name' => 'Full Stack',
                'image' => 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&auto=format&fit=crop&q=60'
            ],
        ];

        foreach ($employees as $employeeData) {
            $division = $divisions->where('name', $employeeData['division_name'])->first();
            
            if ($division) {
                Employee::create([
                    'name' => $employeeData['name'],
                    'phone' => $employeeData['phone'],
                    'position' => $employeeData['position'],
                    'division_id' => $division->id,
                    'image' => $employeeData['image'],
                ]);
            }
        }
    }
}
