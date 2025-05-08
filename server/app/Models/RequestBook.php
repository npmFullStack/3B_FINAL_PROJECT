<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestBook extends Model
{
    protected $fillable = ['user_id', 'book_id', 'status'];
    
    // No need for $casts if not using Enum class
    // Just document the possible values in comments
    /**
     * Possible status values:
     * - pending
     * - approved
     * - rejected
     */
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}