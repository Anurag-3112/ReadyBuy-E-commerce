import React, { useState, useEffect, useContext } from "react";
import "./ProductDisplay.css";
import star_icon from "../assets/star_icon.png";
import stardull_icon from "../assets/stardull_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import WishlistButton from "../Wishlist/WishlistButton";

const DEFAULT_SIZES = [
    { name: "S", stock: 999 },
    { name: "M", stock: 999 },
    { name: "L", stock: 999 },
    { name: "XL", stock: 999 },
    { name: "XXL", stock: 999 },
];

const ProductDisplay = ({ s_product }) => {
    const navigate = useNavigate();

    const [adding, setAdding] = useState(false);

    const {
        cartItems = [],
        addToCart,
        removeFromCart,
    } = useContext(ShopContext);

    const [mainImage, setMainImage] = useState("/placeholder.png");
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        if (!s_product) return;

        if (s_product.images?.length > 0) {
            setMainImage(s_product.images[0].url);
        } else {
            setMainImage("/placeholder.png");
        }

        if (s_product.sizes?.length > 0) {
            const firstAvailable =
                s_product.sizes.find(
                    (size) => size.stock > 0
                ) || s_product.sizes[0];

            setSelectedSize(firstAvailable.name);
        } else {
            setSelectedSize("M");
        }
    }, [s_product]);

    if (!s_product) {
        return <div>Loading...</div>;
    }

    const productId = s_product._id;

    const cartItem = cartItems.find(
        (item) =>
            item.product?._id === productId &&
            item.size === selectedSize
    );

    const quantity = cartItem?.quantity || 0;

    const sizes =
        s_product.sizes?.length > 0
            ? s_product.sizes
            : DEFAULT_SIZES;

    const handleAdd = async () => {
        const token =
            localStorage.getItem("accessToken");

        if (!token) {
            navigate("/login");
            return;
        }

        if (!selectedSize) {
            alert("Please select a size.");
            return;
        }

        try {
            setAdding(true);

            await addToCart(
                productId,
                selectedSize
            );
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

                    {(s_product.images || []).map(
                        (image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={s_product.name}
                                onClick={() =>
                                    setMainImage(image.url)
                                }
                                className={
                                    mainImage === image.url
                                        ? "active-thumb"
                                        : ""
                                }
                            />
                        )
                    )}

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
                        ₹{s_product.price?.original || 0}
                    </div>

                    <div className="new-price">
                        ₹{s_product.price?.discounted || 0}
                    </div>

                </div>

                <div className="product-display-right-description">
                    {s_product.description}
                </div>

                <div className="product-display-right-size">

                    <h3>Select Size</h3>

                    <div className="product-display-right-size-options">

                        {sizes.map((size) => (

                            <div
                                key={size.name}
                                className={`${selectedSize === size.name
                                    ? "selected-size"
                                    : ""
                                    } ${size.stock === 0
                                        ? "disabled-size"
                                        : ""
                                    }`}
                                onClick={() => {
                                    if (size.stock === 0)
                                        return;

                                    setSelectedSize(
                                        size.name
                                    );
                                }}
                            >

                                {size.name}

                            </div>

                        ))}

                    </div>

                    <p className="selected-size-text">

                        Selected Size:
                        <strong>
                            {" "}
                            {selectedSize}
                        </strong>

                    </p>

                    {selectedSize &&
                        sizes.find(
                            (s) =>
                                s.name ===
                                selectedSize
                        )?.stock !== undefined && (

                            <small
                                className="text-muted"
                            >

                                Stock:{" "}
                                {
                                    sizes.find(
                                        (s) =>
                                            s.name ===
                                            selectedSize
                                    ).stock
                                }

                            </small>

                        )}

                </div>

                {quantity === 0 ? (

                    <button
                        onClick={handleAdd}
                        disabled={adding}
                    >

                        {adding
                            ? "Adding..."
                            : "Add To Cart"}

                    </button>

                ) : (

                    <div className="product-quantity-controls mt-3">

                        <button
                            className="qty-btn minus"
                            onClick={() =>
                                removeFromCart(
                                    productId,
                                    selectedSize
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
                            onClick={handleAdd}
                            disabled={adding}
                        >

                            +

                        </button>

                        <WishlistButton
                            productId={productId}
                            isWishlisted={false}
                        />

                    </div>

                )}

            </div>

        </div>
    );
};

export default ProductDisplay;