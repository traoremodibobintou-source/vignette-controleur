<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@vignette.test'],
            [
                'name' => 'Administrateur',
                'password' => 'Admin12345',
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'controleur@vignette.test'],
            [
                'name' => 'Contrôleur',
                'password' => 'Controleur123',
                'role' => 'controleur',
                'email_verified_at' => now(),
            ]
        );
    }
}
