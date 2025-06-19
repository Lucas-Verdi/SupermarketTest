<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Products;

class ProductController extends Controller
{
    // Lista todos os produtos (para montar a lista de produtos no front)
    public function index()
    {
        $products = Products::all();
        return response()->json($products);
    }

    // Retorna apenas o nome e o estoque dos produtos
    public function stock()
    {
        $products = Products::select('name', 'qty_stock')->get();
        return response()->json($products);
    }
}
