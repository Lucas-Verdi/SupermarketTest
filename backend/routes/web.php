<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;

// Rotas de pedidos
Route::get('/orders', [OrderController::class, 'index']); // listar pedidos
Route::post('/orders', [OrderController::class, 'store']); // criar pedido
Route::get('/orders/{id}', [OrderController::class, 'show']); // visualizar pedido
Route::put('/orders/{id}', [OrderController::class, 'update']); // atualizar pedido
Route::delete('/orders/{id}', [OrderController::class, 'destroy']); // deletar pedido

// Rota para consultar estoque atual
Route::get('/products/stock', [ProductController::class, 'stock']);

// Rota para listar todos os produtos
Route::get('/products', [ProductController::class, 'index']);

