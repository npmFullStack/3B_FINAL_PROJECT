<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class LibrarianSeeder extends Seeder
{
 public function run()
 {
  User::create([
   "first_name" => "Admin",
   "last_name" => "Librarian",
   "id_number" => "LIB001", 
   "user_type" => "librarian",
   "password" => Hash::make("password"), 
  ]);
 }
}
