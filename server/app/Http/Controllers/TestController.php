<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Test;

class TestController extends Controller
{
    //

    public function show()
    {
        $user = new Test('1', 'testuser');

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
        ]);
    }
}