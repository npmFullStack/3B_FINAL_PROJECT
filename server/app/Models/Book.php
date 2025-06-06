<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'isbn',
        'description',
        'quantity',
        'available',
        'image_path',
        'user_id'
    ];

    public function categories()
    {
        return $this->hasMany(BookCategory::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}