import React, { createContext, useState, useEffect } from 'react'
import { getProducts } from '../services/product.service'
import {
    getCart,
    addToCart as addCartItem,
    updateCartQuantity,
    removeFromCart as deleteCartItem
} from '../services/cart.service'

export const ShopContext = createContext(null)

const ShopContextProvider = (props) => {
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState([])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts()
                setProducts(data.docs || [])
            } catch (error) {
                console.error('Failed to fetch products:', error)
            }
        }

        fetchProducts()
    }, [])

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem("accessToken");

            // User not logged in
            if (!token) {
                setCartItems([]);
                return;
            }

            try {
                const data = await getCart();
                setCartItems(data.data.cart?.items || []);
            } catch (error) {
                console.error("Failed to fetch cart:", error);

                // Token expired or invalid
                if (error.response?.status === 401) {
                    localStorage.removeItem("accessToken");
                    setCartItems([]);
                }
            }
        };

        fetchCart();
    }, []);

    const refreshCart = async () => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            setCartItems([]);
            return;
        }

        try {
            const data = await getCart();
            setCartItems(data.data.cart?.items || []);
        } catch (error) {
            console.error("Failed to refresh cart:", error);
        }
    };

    const addToCart = async (productId) => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            alert("Please login first.");
            return;
        }

        try {
            await addCartItem(productId);
            await refreshCart();
        } catch (error) {
            console.error("Failed to add item to cart:", error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const item = cartItems.find(
                (cartItem) =>
                    cartItem.product?._id === productId
            )

            if (!item) return

            if (item.quantity <= 1) {
                await deleteCartItem(productId)
            } else {
                await updateCartQuantity(
                    productId,
                    item.quantity - 1
                )
            }

            await refreshCart()
        } catch (error) {
            console.error('Failed to remove item from cart:', error)
        }
    }

    const contextValue = {
        products,
        cartItems,
        addToCart,
        removeFromCart,
        refreshCart
    }

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider