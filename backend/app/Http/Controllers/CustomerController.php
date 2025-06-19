<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customers;

class CustomerController extends Controller
{
    // Busca cliente por nome ou cria se não existir
    public function findOrCreate(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255'
        ]);
        $customer = Customers::firstOrCreate(['name' => $validated['name']]);
        return response()->json($customer, 200);
    }

}
