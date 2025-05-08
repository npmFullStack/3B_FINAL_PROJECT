<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'course',
        'year_level',
        'section'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}