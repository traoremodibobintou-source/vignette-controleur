<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proprietaire extends Model
{
    protected $fillable = [
        'nom',
        'prenom',
        'telephone',
        'adresse',
    ];

    /**
     * Un propriétaire peut avoir plusieurs véhicules.
     */
    public function vehicules(): HasMany
    {
        return $this->hasMany(Vehicule::class);
    }
}
