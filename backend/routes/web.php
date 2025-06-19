<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CustomerController;

// Rota para registrar um novo pedido
Route::post('/orders', [OrderController::class, 'store']);

// Rota para consultar estoque atual dos produtos
Route::get('/products/stock', [ProductController::class, 'stock']);

// Rota para listar todos os produtos disponíveis
Route::get('/products', [ProductController::class, 'index']);

// Rota para encontrar ou criar um cliente pelo nome
Route::post('/customers/find-or-create', [CustomerController::class, 'findOrCreate']);
