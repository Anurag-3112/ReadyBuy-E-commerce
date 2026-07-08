import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";

const CartItems = () => {

    const navigate = useNavigate();

    const {
        cartItems = [],
        addToCart,
        removeFromCart,
    } = useContext(ShopContext);

    const handleCheckout = () => {
        navigate("/checkout");
    };

    const getTotalAmount = () => {
        return cartItems.reduce((total, item) => {
            return (
                total +
                (item.product?.price?.discounted || 0) *
                item.quantity
            );
        }, 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce(
            (total, item) => total + item.quantity,
            0
        );
    };

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart">

                <div className="empty-cart-card">

                    <div className="empty-cart-icon">
                        <FiShoppingBag />
                    </div>

                    <h2>Your Cart is Empty</h2>

                    <p>
                        Looks like you haven't added any products yet.
                        Explore our premium collection and find something you'll love.
                    </p>

                    <button
                        className="cartitems-checkout"
                        onClick={() => navigate("/")}
                    >
                        Continue Shopping
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="cartitems">

            <div className="cartitems-format-main">
                <p>Product</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>

            <hr />

            {cartItems.map((item) => {

                const product = item.product;

                if (!product) return null;

                return (

                    <div key={`${product._id}-${item.size}`}>

                        <div className="cartitems-format cartitems-format-main">

                            <img
                                src={
                                    product.images?.[0]?.url ||
                                    "/placeholder.png"
                                }
                                alt={product.name}
                                className="carticon-product-icon"
                            />

                            <div className="cart-product-info">

                                <p className="cart-product-title">
                                    {product.name}
                                </p>

                                <small className="cart-product-size">
                                    Size: <strong>{item.size}</strong>
                                </small>

                            </div>

                            <p>
                                ₹{product.price?.discounted || 0}
                            </p>

                            <div className="cartitems-quantity-controls">

                                <button
                                    className="cartitems-qty-btn"
                                    onClick={() =>
                                        removeFromCart(
                                            product._id,
                                            item.size
                                        )
                                    }
                                >
                                    −
                                </button>

                                <span className="cartitems-quantity">
                                    {item.quantity}
                                </span>

                                <button
                                    className="cartitems-qty-btn"
                                    onClick={() =>
                                        addToCart(
                                            product._id,
                                            item.size
                                        )
                                    }
                                >
                                    +
                                </button>

                            </div>

                            <p>
                                ₹
                                {(product.price?.discounted || 0) *
                                    item.quantity}
                            </p>

                            <button
                                className="cartitems-remove-btn"
                                onClick={() =>
                                    removeFromCart(
                                        product._id,
                                        item.size
                                    )
                                }
                            >
                                Remove
                            </button>

                        </div>

                        <hr />

                    </div>

                );
            })}

            <div className="cartitems-down">

                <div className="cartitems-total">

                    <h2>Cart Totals</h2>

                    <div>

                        <div className="cartitems-total-item">
                            <p>Total Items</p>
                            <strong>{getTotalItems()}</strong>
                        </div>

                        <hr />

                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <strong>₹{getTotalAmount()}</strong>
                        </div>

                        <hr />

                        <div className="cartitems-total-item">
                            <h3>Grand Total</h3>
                            <h3>₹{getTotalAmount()}</h3>
                        </div>

                    </div>

                    <button
                        className="cartitems-checkout"
                        onClick={handleCheckout}
                    >
                        Proceed to Secure Checkout
                    </button>

                </div>

            </div>

        </div>
    );
};

export default CartItems;