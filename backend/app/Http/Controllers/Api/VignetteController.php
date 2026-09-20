<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vignette;
use Illuminate\Http\Request;

class VignetteController extends Controller
{
    /**
     * Afficher toutes les vignettes.
     */
    public function index()
    {
        return response()->json(
            Vignette::with('vehicule')->get()
        );
    }

    /**
     * Rechercher une vignette par son numéro.
     */
    public function search(Request $request)
    {
        $request->validate([
            'number' => 'required|string|max:255',
        ]);

        $vignette = Vignette::with('vehicule.proprietaire')
            ->where('numero_vignette', $request->number)
            ->first();

        if (!$vignette) {
            return response()->json([
                'message' => 'Vignette introuvable.'
            ], 404);
        }

        return response()->json($vignette);
    }

    /**
     * Ajouter une vignette.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'numero_vignette' => 'required|string|max:255|unique:vignettes,numero_vignette',
            'vehicule_id' => 'required|exists:vehicules,id',
            'date_delivrance' => 'required|date',
            'date_expiration' => 'required|date|after_or_equal:date_delivrance',
            'statut' => 'required|string|max:255',
        ]);

        $vignette = Vignette::create($validated);

        return response()->json(
            $vignette->load('vehicule'),
            201
        );
    }

    /**
     * Afficher une vignette.
     */
    public function show(string $id)
    {
        $vignette = Vignette::with('vehicule')
            ->find($id);

        if (!$vignette) {
            return response()->json([
                'message' => 'Vignette introuvable.'
            ], 404);
        }

        return response()->json($vignette);
    }

    /**
     * Modifier une vignette.
     */
    public function update(Request $request, string $id)
    {
        $vignette = Vignette::find($id);

        if (!$vignette) {
            return response()->json([
                'message' => 'Vignette introuvable.'
            ], 404);
        }

        $validated = $request->validate([
            'numero_vignette' => 'required|string|max:255|unique:vignettes,numero_vignette,' . $vignette->id,
            'vehicule_id' => 'required|exists:vehicules,id',
            'date_delivrance' => 'required|date',
            'date_expiration' => 'required|date|after_or_equal:date_delivrance',
            'statut' => 'required|string|max:255',
        ]);

        $vignette->update($validated);

        return response()->json(
            $vignette->load('vehicule')
        );
    }

    /**
     * Supprimer une vignette.
     */
    public function destroy(string $id)
    {
        $vignette = Vignette::find($id);

        if (!$vignette) {
            return response()->json([
                'message' => 'Vignette introuvable.'
            ], 404);
        }

        $vignette->delete();

        return response()->json([
            'message' => 'Vignette supprimée avec succès.'
        ]);
    }
}
