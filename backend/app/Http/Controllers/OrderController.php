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
                // REGRA 1: Não permitir pedido maior que o estoque
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
            // REGRA 2: Debitar estoque após salvar pedido
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

    // Lista todos os pedidos
    public function index()
    {
        $orders = Orders::with(['customer', 'ordersProducts.product'])->get();
        return response()->json($orders);
    }

    // Mostra um pedido específico
    public function show($id)
    {
        $order = Orders::with(['customer', 'ordersProducts.product'])->find($id);
        if (!$order) {
            return response()->json(['error' => 'Pedido não encontrado.'], 404);
        }
        return response()->json($order);
    }

    // Atualiza um pedido existente
    public function update(Request $request, $id)
    {
        $order = Orders::find($id);
        if (!$order) {
            return response()->json(['error' => 'Pedido não encontrado.'], 404);
        }

        // Validação dos campos (ajuste conforme necessário)
        $validated = $request->validate([
            'customer_id'    => 'sometimes|exists:customers,id',
            'delivery_date'  => 'sometimes|date',
            'products'       => 'sometimes|array',
            'products.*.id'  => 'required_with:products|exists:products,id',
            'products.*.qty' => 'required_with:products|integer|min:1',
        ]);

        // Atualização em transação
        DB::beginTransaction();

        try {
            // Atualiza dados do pedido se necessário
            if (isset($validated['customer_id'])) $order->customerId = $validated['customer_id'];
            if (isset($validated['delivery_date'])) $order->delivery_date = $validated['delivery_date'];

            // Se produtos foram enviados para atualizar
            if (isset($validated['products'])) {
                // Devolve o estoque dos produtos antigos desse pedido
                foreach ($order->ordersProducts as $op) {
                    $product = Products::find($op->productId);
                    $product->increment('qty_stock', $op->quantity);
                }
                // Remove associações antigas
                OrdersProducts::where('orderId', $order->id)->delete();

                // Adiciona novos produtos e debita estoque
                $total = 0;
                foreach ($validated['products'] as $item) {
                    $product = Products::findOrFail($item['id']);
                    if ($product->qty_stock < $item['qty']) {
                        throw new \Exception("Estoque insuficiente para o produto '{$product->name}'.");
                    }
                    $subtotal = $product->price * $item['qty'];
                    $total += $subtotal;

                    OrdersProducts::create([
                        'orderId'   => $order->id,
                        'productId' => $item['id'],
                        'quantity'  => $item['qty'],
                        'price'     => $product->price,
                    ]);
                    $product->decrement('qty_stock', $item['qty']);
                }
                $order->total = $total;
            }

            $order->save();
            DB::commit();
            return response()->json(['message' => 'Pedido atualizado com sucesso!', 'order' => $order]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    // Remove um pedido
    public function destroy($id)
    {
        $order = Orders::find($id);
        if (!$order) {
            return response()->json(['error' => 'Pedido não encontrado.'], 404);
        }

        DB::beginTransaction();
        try {
            // Devolve o estoque dos produtos deste pedido
            foreach ($order->ordersProducts as $op) {
                $product = Products::find($op->productId);
                if ($product) {
                    $product->increment('qty_stock', $op->quantity);
                }
            }
            // Remove associações de produtos e o pedido
            OrdersProducts::where('orderId', $order->id)->delete();
            $order->delete();

            DB::commit();
            return response()->json(['message' => 'Pedido excluído com sucesso.']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
