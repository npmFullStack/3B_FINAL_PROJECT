<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('request_books', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('book_id')->constrained()->onDelete('cascade');
    
    // Student-facing status (shown in UI)
    $table->enum('status', ['pending', 'approved', 'rejected'])
          ->default('pending');
    
    // Internal tracking (not shown to students)
    $table->enum('internal_status', ['on_loan', 'overdue', 'returned'])
          ->nullable();
    
    $table->dateTime('checked_out_at')->nullable();
    $table->dateTime('due_date')->nullable();
    $table->dateTime('returned_at')->nullable();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_books');
    }
};
