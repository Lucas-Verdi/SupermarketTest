<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Model para a tabela 'orders'
class Orders extends Model
{
    protected $table = 'orders';
    protected $fillable = ['customerId', 'delivery_date', 'total'];

    public $timestamps = false;

    public function customer()
    {
        return $this->belongsTo(Customers::class, 'customerId');
    }

     public function products()
    {
        return $this->belongsToMany(Product::class, 'OrdersProducts', 'orderId', 'productId')
            ->withPivot('quantity', 'price');
    }

    public function ordersProducts()
    {
        return $this->hasMany(OrdersProducts::class, 'orderId');
    }
}
