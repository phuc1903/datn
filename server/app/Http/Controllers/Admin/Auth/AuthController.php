<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AuthController extends Controller
{

    public function login()
    {
        return view('Pages.Auth.Login.Index');
    }
    public function loginStore(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');

            if (!Auth::guard('admin')->attempt($credentials)) {
                return redirect()->back()->with('error', 'Mật khẩu hoặc email sai');
            }

            return redirect()->route('dashboard')->with('success', 'Đăng nhập thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function logout()
    {
        Auth::guard('admin')->logout();
        return redirect('/login')->with('success', 'Bạn đã đăng xuất');
    }
}
