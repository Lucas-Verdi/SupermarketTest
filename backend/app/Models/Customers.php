<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customers extends Model
{
    protected $table = 'customers';
    protected $fillable = ['name'];

    public $timestamps = false;

    public function orders()
    {
        return $this->hasMany(Orders::class, 'customer_id');
    }
}
