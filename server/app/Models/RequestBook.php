<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestBook extends Model
{
    protected $fillable = [
        'user_id', 
        'book_id', 
        'status',
        'internal_status',
        'checked_out_at',
        'due_date',
        'returned_at'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}