<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vignette extends Model
{
    protected $fillable = [
        'numero_vignette',
        'vehicule_id',
        'date_delivrance',
        'date_expiration',
        'statut',
    ];

    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class);
    }
}
