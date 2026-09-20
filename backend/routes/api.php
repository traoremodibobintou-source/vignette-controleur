<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VehiculeController;
use App\Http\Controllers\Api\ProprietaireController;
use App\Http\Controllers\Api\VignetteController;
use App\Http\Controllers\Api\AuthController;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/vehicules', [VehiculeController::class, 'index']);
Route::post('/vehicules', [VehiculeController::class, 'store']);

Route::get('/vehicules/search', [VehiculeController::class, 'search']);

Route::get('/vehicules/{vehicule}', [VehiculeController::class, 'show']);
Route::put('/vehicules/{vehicule}', [VehiculeController::class, 'update']);
Route::delete('/vehicules/{vehicule}', [VehiculeController::class, 'destroy']);

Route::patch('/vehicules/{vehicule}/stolen-status', [VehiculeController::class, 'stolenStatus']);
Route::apiResource('proprietaires', ProprietaireController::class);
Route::get('/vignettes/search', [VignetteController::class, 'search']);
Route::apiResource('vignettes', VignetteController::class);

Route::post('/login', [AuthController::class, 'login']);
