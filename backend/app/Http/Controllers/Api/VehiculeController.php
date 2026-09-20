<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicule;
use Illuminate\Http\Request;

class VehiculeController extends Controller
{
    /**
     * Liste des véhicules.
     */
    public function index()
    {
        return response()->json(
            Vehicule::with('proprietaire')->get()
        );
    }

    /**
     * Enregistrer un nouveau véhicule.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'plaque' => 'required|string|max:255|unique:vehicules,plaque',
            'type' => 'required|string|max:255',
            'marque' => 'nullable|string|max:255',
            'modele' => 'nullable|string|max:255',
            'couleur' => 'nullable|string|max:255',
            'annee' => 'nullable|integer',
            'proprietaire_id' => 'required|exists:proprietaires,id',
            'statut_vol' => 'nullable|string|max:255',
        ]);

        $vehicule = Vehicule::create($validated);

        return response()->json(
            $vehicule->load('proprietaire'),
            201
        );
    }

    /**
     * Afficher un véhicule.
     */
    public function show(Vehicule $vehicule)
    {
        return response()->json(
            $vehicule->load('proprietaire')
        );
    }

    /**
     * Modifier un véhicule.
     */
    public function update(Request $request, Vehicule $vehicule)
    {
        $validated = $request->validate([
            'plaque' => 'sometimes|required|string|max:255|unique:vehicules,plaque,' . $vehicule->id,
            'type' => 'sometimes|required|string|max:255',
            'marque' => 'nullable|string|max:255',
            'modele' => 'nullable|string|max:255',
            'couleur' => 'nullable|string|max:255',
            'annee' => 'nullable|integer',
            'proprietaire_id' => 'sometimes|required|exists:proprietaires,id',
            'statut_vol' => 'nullable|string|max:255',
        ]);

        $vehicule->update($validated);

        return response()->json(
            $vehicule->load('proprietaire')
        );
    }

    /**
     * Supprimer un véhicule.
     */
    public function destroy(Vehicule $vehicule)
    {
        $vehicule->delete();

        return response()->json([
            'message' => 'Véhicule supprimé avec succès.'
        ]);
    }

    /**
     * Rechercher un véhicule par numéro de plaque.
     */
    public function search(Request $request)
    {
        $request->validate([
            'plaque' => 'required|string|max:255',
        ]);

        $vehicule = Vehicule::with('proprietaire')
            ->where('plaque', $request->plaque)
            ->first();

        if (!$vehicule) {
            return response()->json([
                'message' => 'Véhicule introuvable.'
            ], 404);
        }

        return response()->json($vehicule);
    }

    /**
     * Modifier le statut volé/non volé.
     */
    public function stolenStatus(Request $request, Vehicule $vehicule)
    {
        $validated = $request->validate([
            'statut_vol' => 'required|string|max:255',
        ]);

        $vehicule->update($validated);

        return response()->json([
            'message' => 'Statut du véhicule mis à jour.',
            'vehicule' => $vehicule->load('proprietaire')
        ]);
    }
}
