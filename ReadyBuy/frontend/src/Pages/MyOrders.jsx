import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";
import { getOrders } from "../services/order.service";
import "./CSS/MyOrders.css";

const MyOrders = () => {

    const {
        data = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
    });

    if (isLoading) {
        return (
            <div className="orders-loading">
                <h2>Loading your orders...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-loading">
                <h2>Failed to load orders.</h2>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <section className="orders-page">

                <div className="orders-empty">

                    <div className="orders-empty-icon">
                        <HiOutlineShoppingBag />
                    </div>

                    <h2>No Orders Yet</h2>

                    <p>
                        You haven't placed any orders yet.
                        Start shopping to discover our premium collection.
                    </p>

                    <Link
                        to="/"
                        className="orders-shop-btn"
                    >
                        Start Shopping
                    </Link>

                </div>

            </section>
        );
    }

    return (

        <section className="orders-page">

            <div className="orders-header">

                <span>Order History</span>

                <h1>My Orders</h1>

                <p>
                    Track your purchases and view previous orders.
                </p>

            </div>

            <div className="orders-list">

                {data.map((order) => (

                    <div
                        key={order._id}
                        className="order-card"
                    >

                        <div>

                            <h3>
                                Order #{order._id.slice(-8)}
                            </h3>

                            <p className="order-status">
                                {order.status}
                            </p>

                        </div>

                        <div className="order-price">
                            ₹{order.totalAmount}
                        </div>

                        <Link
                            to={`/orders/${order._id}`}
                            className="order-link"
                        >
                            View Details
                            <FiArrowRight />
                        </Link>

                    </div>

                ))}

            </div>

        </section>

    );
};

export default MyOrders;