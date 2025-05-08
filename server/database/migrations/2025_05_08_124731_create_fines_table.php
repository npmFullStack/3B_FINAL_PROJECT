<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
 /**
  * Run the migrations.
  */
 public function up(): void
 {
  Schema::create("fines", function (Blueprint $table) {
   $table->id();
   $table
    ->foreignId("request_id")
    ->constrained("request_books")
    ->onDelete("cascade");
   $table->decimal("amount", 8, 2);
   $table->string("reason"); // "late_return", "damage", "lost"
   $table->enum("status", ["pending", "paid", "waived"])->default("pending");
   $table->dateTime("paid_at")->nullable();
   $table->text("notes")->nullable();
   $table->timestamps();
  });
 }

 /**
  * Reverse the migrations.
  */
 public function down(): void
 {
  Schema::dropIfExists("fines");
 }
};
