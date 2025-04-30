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

    /**
     * Show the form for creating a new resource.
     */
    // public function create()
    // {
    //     return redirect()->back()->with('error', 'Bạn không thể thêm khách hàng');
    //     $sexList = collect(UserSex::getValues())
    //         ->map(fn($value) => [
    //             'label' => UserSex::fromValue($value)->label(),
    //             'value' => $value,
    //         ])
    //         ->values()
    //         ->toArray();

    //     return view('Pages.User.Create', ['sexList' => $sexList]);
    // }


    /**
     * Store a newly created resource in storage.
     */
    // public function store(UserRequest $request)
    // {
    //     return redirect()->back()->with('error', 'Bạn không thể sử dụng chức năng này');
    //     try {
    //         $sex = UserSex::fromValue($request->sex);

    //         $user = User::create([
    //             'first_name'   => $request->first_name,
    //             'last_name'    => $request->last_name,
    //             'phone_number' => $request->phone_number,
    //             'password' => Hash::make($request->password),
    //             'email'        => $request->email,
    //             'sex'          => $sex->value,
    //         ]);

    //         if ($request->has('addresses') && is_array($request->addresses)) {
    //             foreach ($request->addresses as $address) {
    //                 UserAddress::create([
    //                     'user_id'  => $user->id,
    //                     'city'     => $address['city'] ?? null,
    //                     'district' => $address['district'] ?? null,
    //                     'ward'     => $address['ward'] ?? null,
    //                     'address'  => $address['address'] ?? null,
    //                 ]);
    //             }
    //         }

    //         return redirect()->route('admin.user.index')->with('success', 'Thêm thành công');
    //     } catch (\Exception $e) {

    //         return redirect()->back()->with('error', $e->getMessage());
    //     }
    // }

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
