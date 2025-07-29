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
                'division_name' => 'Backend'
            ],
            [
                'name' => 'Siti Nurhaliza',
                'phone' => '081234567891',
                'position' => 'Frontend Developer',
                'division_name' => 'Frontend'
            ],
            [
                'name' => 'Budi Santoso',
                'phone' => '081234567892',
                'position' => 'Mobile Developer',
                'division_name' => 'Mobile Apps'
            ],
            [
                'name' => 'Andi Setiawan',
                'phone' => '081234567893',
                'position' => 'QA Engineer',
                'division_name' => 'QA'
            ],
            [
                'name' => 'Maya Sari',
                'phone' => '081234567894',
                'position' => 'UI/UX Designer',
                'division_name' => 'UI/UX Designer'
            ],
            [
                'name' => 'Rizky Pratama',
                'phone' => '081234567895',
                'position' => 'Full Stack Developer',
                'division_name' => 'Full Stack'
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
                ]);
            }
        }
    }
}
