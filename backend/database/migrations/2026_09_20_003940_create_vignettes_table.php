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
    Schema::create('vignettes', function (Blueprint $table) {
        $table->id();

        $table->string('numero_vignette')->unique();

        $table->foreignId('vehicule_id')
              ->constrained('vehicules')
              ->cascadeOnDelete();

        $table->date('date_delivrance');
        $table->date('date_expiration');

        $table->string('statut')->default('valide');

        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vignettes');
    }
};
