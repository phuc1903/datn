<?php

namespace App\Policies\Admin\Product;

use App\Models\User;
use App\Models\product;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;


class ProductPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */

    public function create(User $user): bool
    {
        return $user->can('createProduct');
    }

    public function update(User $user, product $product): bool
    {
        if ($user->can('updateProduct')) {
            return true;
        }
        
        return false;
    }

    public function delete(User $user, product $product): bool
    {
        if ($user->can('deleteProduct')) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, product $product): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, product $product): bool
    {
        //
    }
}
