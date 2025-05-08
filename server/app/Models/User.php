<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'id_number',
        'password',
        'user_type',
        'status'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function student()
    {
        return $this->hasOne(Student::class);
    }

    // Helper method to check if user is librarian
    public function isLibrarian()
    {
        return $this->user_type === 'librarian';
    }

    // Helper method to check if user is student
    public function isStudent()
    {
        return $this->user_type === 'student';
    }
}