<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicule extends Model
{
    protected $fillable = [
        'plaque',
        'type',
        'marque',
        'modele',
        'couleur',
        'annee',
        'proprietaire_id',
        'statut_vol',
    ];

    public function proprietaire()
    {
        return $this->belongsTo(Proprietaire::class);
    }

    public function vignette()
    {
        return $this->hasOne(Vignette::class);
    }
}
