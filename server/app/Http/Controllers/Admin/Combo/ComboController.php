<?php

namespace App\Http\Controllers\Admin\Combo;

use App\DataTables\Combo\ComboDataTable;
use App\Enums\Combo\ComboHot;
use App\Enums\Combo\ComboStatus;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Combo;
use App\Models\Product;
use Illuminate\Http\Request;

class ComboController extends Controller
{
    public function index(ComboDataTable $dataTable)
    {
        return $dataTable->render('Pages.Combo.Index');
    }

    public function create()
    {

        $products = Product::with('skus')->get();

        $categories = Category::all();

        $status = ComboStatus::getKeyValuePairs();
        $hots = ComboHot::getKeyValuePairs();

        return view('Pages.Combo.Create', compact('products', 'categories', 'status', 'hots'));
    }

    public function store(Request $request)
    {   
        dd($request);
    }

    public function edit(Combo $combo)
    {
        dd($combo->load('skus', 'skus.product'));
    }

    public function update()
    {

    }

    public function destroy()
    {

    }
}
