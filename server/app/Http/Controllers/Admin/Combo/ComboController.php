<?php

namespace App\Http\Controllers\Admin\Combo;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ComboController extends Controller
{
    public function index()
    {
        return view('Pages.Combo.Index');
    }

    public function create()
    {

        $products = Product::with('skus')->get();
        $categories = Category::all();

        return view('Pages.Combo.Create', compact('products', 'categories'));
    }

    public function store(Request $request)
    {   
        dd($request);
    }

    public function edit()
    {
        
    }

    public function update()
    {

    }

    public function destroy()
    {

    }
}
