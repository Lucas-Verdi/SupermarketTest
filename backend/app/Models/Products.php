<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    protected $table = 'products';
    protected $fillable = ['name', 'price', 'qty_stock'];

    public $timestamps = false;

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'OrdersProducts', 'productId', 'orderId')
            ->withPivot('quantity', 'price');
    }

    public function ordersProducts()
    {
        return $this->hasMany(OrdersProducts::class, 'productId');
    }

}
