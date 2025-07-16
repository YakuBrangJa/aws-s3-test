<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    use HasFactory;

        public $id;
    public $username;

    public function __construct($id, $username)
    {
        $this->id = $id;
        $this->username = $username;
    }
}