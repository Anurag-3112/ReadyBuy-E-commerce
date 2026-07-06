import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { getOrder } from "../services/order.service";
import "./CSS/OrderDetails.css";

const OrderDetails = () => {
    const { id } = useParams();

    const {
        data,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["order", id],
        queryFn: () => getOrder(id),
    });

    if (isLoading) {
        return (
            <div className="order-loading">
                <div className="loading-spinner"></div>
                <h2>Loading your order...</h2>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="order-loading">
                <h2>Unable to load your order.</h2>
                <p>Please try again later.</p>
            </div>
        );
    }

    return (
        <section className="order-details-page">

            <div className="order-header">

                <div className="order-header-top">

                    <span className="order-tag">
                        Order Summary
                    </span>

                    <Link
                        to="/orders"
                        className="back-orders-btn"
                    >
                        Back to Orders
                    </Link>

                </div>

                <h1>
                    Order #{data._id?.slice(-8)}
                </h1>

                <p>
                    Thank you for shopping with ReadyBuy.
                    Your order has been placed successfully.
                </p>

            </div>

            <div className="order-details-card">

                <div className="order-info">

                    <div className="info-row">
                        <span>Order Status</span>

                        <span className="status-badge">
                            {data.status}
                        </span>
                    </div>

                    <div className="info-row">
                        <span>Payment Method</span>

                        <span>
                            {data.paymentMethod || "Cash on Delivery"}
                        </span>
                    </div>

                    <div className="info-row">
                        <span>Total Items</span>

                        <span>
                            {data.items?.length || 0}
                        </span>
                    </div>

                </div>

                <div className="products-heading">

                    <HiOutlineShoppingBag />

                    <h3>Products</h3>

                </div>

                <div className="order-products">

                    {data.items?.map((item, index) => (

                        <div
                            className="order-product"
                            key={item.product || index}
                        >

                            <img
                                src={
                                    item.image ||
                                    "/placeholder.png"
                                }
                                alt={item.name}
                                className="order-product-image"
                            />

                            <div className="order-product-details">

                                <h5>
                                    {item.name}
                                </h5>

                                <p>
                                    Quantity: {item.quantity}
                                </p>

                                <small>
                                    ₹{item.price} × {item.quantity}
                                </small>

                            </div>

                            <strong>
                                ₹{item.price * item.quantity}
                            </strong>

                        </div>

                    ))}

                </div>

                <div className="order-total">

                    <span>
                        Grand Total
                    </span>

                    <h2>
                        ₹{data.totalAmount}
                    </h2>

                </div>

                <div className="order-actions">



                    <Link
                        to="/"
                        className="continue-shopping-btn"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>

        </section>
    );
};

export default OrderDetails;