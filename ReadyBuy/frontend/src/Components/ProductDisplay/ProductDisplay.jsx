import React, { useState, useEffect, useContext } from "react";
import "./ProductDisplay.css";
import star_icon from "../assets/star_icon.png";
import stardull_icon from "../assets/stardull_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { useNavigate } from "react-router-dom";

const ProductDisplay = ({ s_product }) => {
    const navigate = useNavigate();
    const [adding, setAdding] = useState(false);

    const {
        cartItems = [],
        addToCart,
        removeFromCart,
    } = useContext(ShopContext);

    const [mainImage, setMainImage] = useState(
        s_product?.images?.[0]?.url || "/placeholder.png"
    );

    useEffect(() => {
        if (s_product?.images?.length > 0) {
            setMainImage(s_product.images[0].url);
        } else {
            setMainImage("/placeholder.png");
        }
    }, [s_product]);

    if (!s_product) {
        return <div>Loading...</div>;
    }

    const productId = s_product._id;

    const cartItem = cartItems.find(
        (item) => item.product?._id === productId
    );

    const quantity = cartItem?.quantity || 0;

    const handleAdd = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setAdding(true);
            await addToCart(productId);
        } catch (error) {
            console.error(error);
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="product-display">
            <div className="product-display-left">

                <div className="product-display-img-list">
                    {(s_product.images || []).map((image, index) => (
                        <img
                            key={index}
                            src={image.url}
                            alt={s_product.name}
                            onClick={() => setMainImage(image.url)}
                            className={
                                mainImage === image.url
                                    ? "active-thumb"
                                    : ""
                            }
                        />
                    ))}
                </div>

                <div className="product-display-img">
                    <img
                        src={mainImage}
                        alt={s_product.name}
                    />
                </div>

            </div>

            <div className="product-display-right">

                <h1>{s_product.name}</h1>

                <div className="product-display-right-star">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={stardull_icon} alt="" />

                    <p>
                        ({s_product.reviewCount || 0})
                    </p>
                </div>

                <div className="product-display-right-prices">

                    <div className="old-price">
                        ₹
                        {s_product.price?.original || 0}
                    </div>

                    <div className="new-price">
                        ₹
                        {s_product.price?.discounted || 0}
                    </div>

                </div>

                <div className="product-display-right-description">
                    {s_product.description}
                </div>

                <div className="product-display-right-size">
                    <h3>Select Size</h3>

                    <div className="product-display-right-size-options">

                        {(s_product.sizes || []).length >
                            0 ? (
                            s_product.sizes.map(
                                (size, index) => (
                                    <div key={index}>
                                        {size.name}
                                    </div>
                                )
                            )
                        ) : (
                            <>
                                <div>S</div>
                                <div>M</div>
                                <div>L</div>
                                <div>XL</div>
                                <div>XXL</div>
                            </>
                        )}

                    </div>
                </div>

                {quantity === 0 ? (
                    <button
                        onClick={handleAdd}
                        disabled={adding}
                    >
                        {
                            adding
                                ?
                                "Adding..."
                                :
                                "Add To Cart"
                        }
                    </button>
                ) : (
                    <div className="product-quantity-controls mt-3">

                        <button
                            className="qty-btn minus"
                            onClick={() =>
                                removeFromCart(
                                    productId
                                )
                            }
                        >
                            −
                        </button>

                        <span className="qty-display">
                            {quantity}
                        </span>

                        <button
                            className="qty-btn plus"
                            onClick={() => {
                                const token = localStorage.getItem("token");

                                if (!token) {
                                    navigate("/login");
                                    return;
                                }

                                addToCart(productId);
                            }}
                        >
                            +
                        </button>

                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductDisplay