<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proprietaire;
use Illuminate\Http\Request;

class ProprietaireController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(
            Proprietaire::all()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
        ]);

        $proprietaire = Proprietaire::create($validated);

        return response()->json(
            $proprietaire,
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Proprietaire $proprietaire)
    {
        return response()->json(
            $proprietaire
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        Request $request,
        Proprietaire $proprietaire
    ) {
        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'prenom' => 'sometimes|required|string|max:255',
            'telephone' => 'sometimes|required|string|max:255',
            'adresse' => 'sometimes|required|string|max:255',
        ]);

        $proprietaire->update($validated);

        return response()->json(
            $proprietaire
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Proprietaire $proprietaire)
    {
        $proprietaire->delete();

        return response()->json([
            'message' => 'Propriétaire supprimé avec succès.'
        ]);
    }
}
