import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { AuthContext } from "./AuthContext";

import {
    getCart,
    addToCart as addCartItem,
    updateCartQuantity,
    removeFromCart as deleteCartItem,
} from "../services/cart.service";

export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    /**
     * Fetch Cart
     */
    const refreshCart = async () => {
        if (!isAuthenticated) {
            setCartItems([]);
            return;
        }

        setLoading(true);

        try {
            const data = await getCart();

            setCartItems(data.data.cart?.items || []);
        } catch (error) {
            console.error(
                error.response?.data?.message ||
                error.message
            );
        } finally {
            setLoading(false);
        }
    };

    /**
     * Load cart whenever authentication changes
     */
    useEffect(() => {
        if (isAuthenticated) {
            refreshCart();
        } else {
            setCartItems([]);
        }
    }, [isAuthenticated]);

    /**
     * Add Product
     */
    const addToCart = async (
        productId,
        size
    ) => {
        if (!isAuthenticated) {
            alert("Please login first.");
            return;
        }

        try {
            await addCartItem({
                productId,
                size,
                quantity: 1,
            });

            await refreshCart();
        } catch (error) {
            console.error(
                error.response?.data?.message ||
                error.message
            );
        }
    };

    /**
     * Update Quantity
     */
    const updateQuantity = async (
        productId,
        size,
        quantity
    ) => {
        if (!isAuthenticated) return;

        try {
            await updateCartQuantity(
                productId,
                size,
                quantity
            );

            await refreshCart();
        } catch (error) {
            console.error(
                error.response?.data?.message ||
                error.message
            );
        }
    };

    /**
     * Remove Product
     */
    const removeFromCart = async (
        productId,
        size
    ) => {
        if (!isAuthenticated) return;

        try {
            const item = cartItems.find(
                (cartItem) =>
                    cartItem.product?._id ===
                    productId &&
                    cartItem.size === size
            );

            if (!item) return;

            if (item.quantity <= 1) {
                await deleteCartItem(
                    productId,
                    size
                );
            } else {
                await updateCartQuantity(
                    productId,
                    size,
                    item.quantity - 1
                );
            }

            await refreshCart();
        } catch (error) {
            console.error(
                error.response?.data?.message ||
                error.message
            );
        }
    };

    /**
     * Clear Cart
     */
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <ShopContext.Provider
            value={{
                cartItems,
                loading,
                addToCart,
                removeFromCart,
                updateQuantity,
                refreshCart,
                clearCart,
            }}
        >
            {children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;