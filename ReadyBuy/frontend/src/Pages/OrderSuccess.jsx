import { Link, useLocation, Navigate } from "react-router-dom";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import "./CSS/OrderSuccess.css";

const OrderSuccess = () => {
    const { state } = useLocation();

    if (!state) {
        return <Navigate to="/" replace />;
    }

    return (
        <section className="order-success-page">

            <div className="success-card">

                <div className="success-icon">
                    <HiOutlineCheckCircle />
                </div>

                <span className="success-tag">
                    Order Confirmed
                </span>

                <h1>
                    Thank You!
                </h1>

                <p className="success-message">
                    Your order has been placed successfully.
                    We've received your order and will start processing it shortly.
                </p>

                <div className="success-details">

                    <div className="success-detail">
                        <span>Order ID</span>
                        <strong>
                            #{state._id?.slice(-8)}
                        </strong>
                    </div>

                    <div className="success-detail">
                        <span>Total Amount</span>
                        <strong>
                            ₹{state.totalAmount}
                        </strong>
                    </div>

                </div>

                <div className="success-actions">

                    <Link
                        to="/orders"
                        className="success-secondary-btn"
                    >
                        View My Orders
                    </Link>

                    <Link
                        to="/"
                        className="success-primary-btn"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>

        </section>
    );
};

export default OrderSuccess;