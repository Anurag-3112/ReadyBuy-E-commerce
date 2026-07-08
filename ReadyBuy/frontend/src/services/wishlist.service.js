import api from "./api";

/*
|--------------------------------------------------------------------------
| Get Wishlist
|--------------------------------------------------------------------------
*/

export const getWishlist = async () => {

    const { data } = await api.get(
        "/wishlist"
    );

    return data.data;

};

/*
|--------------------------------------------------------------------------
| Add Product
|--------------------------------------------------------------------------
*/

export const addToWishlist = async (
    productId
) => {

    const { data } = await api.post(
        "/wishlist",
        {
            product: productId,
        }
    );

    return data.data;

};

/*
|--------------------------------------------------------------------------
| Remove Product
|--------------------------------------------------------------------------
*/

export const removeFromWishlist =
    async (productId) => {

        const { data } =
            await api.delete(
                `/wishlist/${productId}`
            );

        return data.data;

    };

/*
|--------------------------------------------------------------------------
| Toggle Wishlist
|--------------------------------------------------------------------------
*/

export const toggleWishlist =
    async (productId) => {

        const { data } =
            await api.post(
                `/wishlist/toggle/${productId}`
            );

        return data.data;

    };