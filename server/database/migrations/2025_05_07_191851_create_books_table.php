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
        // In the migration file
Schema::create('books', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->string('author');
    $table->string('isbn')->nullable();
    $table->text('description')->nullable();
    $table->integer('quantity')->default(1);
    $table->integer('available')->default(1);
    $table->string('image_path')->nullable();
    $table->tinyInteger('status')->default(1)->comment('1=active, 0=deleted');
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
