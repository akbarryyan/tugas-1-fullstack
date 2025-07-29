<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::create([
            'name' => 'Administrator',
            'username' => 'admin',
            'phone' => '081234567890',
            'email' => 'admin@aksamedia.co.id',
            'password' => Hash::make('pastibisa'),
        ]);
    }
}
