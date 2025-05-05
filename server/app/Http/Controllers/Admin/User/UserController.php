<?php

namespace App\Http\Controllers\Admin\User;

use App\DataTables\User\UserDataTable;
use App\Enums\User\UserSex;
use App\Enums\User\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\UserRequest;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(UserDataTable $dataTables)
    {
        return $dataTables->render('Pages.User.Index');
    }

    public function edit(User $user)
    {
        $userShow = $user->load('addresses', 'productFeedbacks', 'productFeedbacks.sku.product', 'productFeedbacks.sku.variantValues');
        $orderStatus = UserStatus::fromValue($userShow->status);
        $userSex = UserSex::fromValue($userShow->sex);

        $statusList = collect(UserStatus::getValues())
            ->filter(fn($status) => $status !== $orderStatus->value)
            ->map(fn($value) => [
                'label' => UserStatus::fromValue($value)->label(),
                'value' => $value,
            ])
            ->values()
            ->toArray();
        return view('Pages.User.Edit', [
            'statusList' => $statusList,
            'user' => $userShow,
            'statusActive' => $orderStatus->label(),
            'statusActiveValue' => $orderStatus->value,
            'sexActive' => $userSex->label(),
            'sexActiveValue' => $userSex->value,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        try {
            $status = UserStatus::fromValue($request->status) ?? UserStatus::fromLabel($request->status);

            $user->update([
                'status' => $status->value,
            ]);

            return redirect()->back()->with('success', 'Cập nhật thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
