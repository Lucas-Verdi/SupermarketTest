<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrdersProducts extends Model
{
    protected $table = 'ordersproducts';
    protected $fillable = ['orderId', 'productId', 'quantity', 'price'];

    public $timestamps = false;

    public function order()
    {
        return $this->belongsTo(Order::class, 'orderId');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'productId');
    }
}
