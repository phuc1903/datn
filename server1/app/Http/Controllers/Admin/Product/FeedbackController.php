<?php

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use App\Models\ProductFeedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('Pages.Product.Feedback.Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductFeedback $productFeedback)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductFeedback $productFeedback)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductFeedback $productFeedback)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductFeedback $productFeedback)
    {
        //
    }
}
