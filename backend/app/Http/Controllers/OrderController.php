<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Orders;
use App\Models\Customers;
use App\Models\Products;
use App\Models\OrdersProducts;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{

    // Função responsável por registrar um novo pedido, validar estoque e associar produtos
    public function store(Request $request)
    {
        // Validação básica dos campos
        $validated = $request->validate([
            'customer_id'    => 'required|exists:customers,id',
            'delivery_date'  => 'required|date',
            'products'       => 'required|array|min:1',
            'products.*.id'  => 'required|exists:products,id',
            'products.*.qty' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $total = 0;
            $orderProducts = [];

            // 1. VALIDAR estoque antes de salvar o pedido
            foreach ($validated['products'] as $item) {
                $product = Products::findOrFail($item['id']);
                if ($product->qty_stock < $item['qty']) {
                    throw new \Exception("Estoque insuficiente para o produto '{$product->name}'. Disponível: {$product->qty_stock}, solicitado: {$item['qty']}.");
                }
                $subtotal = $product->price * $item['qty'];
                $total += $subtotal;
                $orderProducts[] = [
                    'productId' => $product->id,
                    'quantity'  => $item['qty'],
                    'price'     => $product->price,
                ];
            }

            // 2. CRIAR o pedido
            $order = Orders::create([
                'customerId'    => $validated['customer_id'],
                'delivery_date' => $validated['delivery_date'],
                'total'         => $total,
            ]);

            // 3. ASSOCIAR produtos e DEBITAR estoque
            foreach ($orderProducts as $item) {
                OrdersProducts::create([
                    'orderId'   => $order->id,
                    'productId' => $item['productId'],
                    'quantity'  => $item['quantity'],
                    'price'     => $item['price'],
                ]);
                $product = Products::find($item['productId']);
                $product->decrement('qty_stock', $item['quantity']);
            }

            DB::commit();
            return response()->json(['message' => 'Pedido cadastrado com sucesso!', 'order' => $order], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
