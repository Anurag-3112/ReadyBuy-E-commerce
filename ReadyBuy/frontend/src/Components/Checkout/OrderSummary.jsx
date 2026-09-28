import { useContext } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ShopContext } from "../../Context/ShopContext";
import "./OrderSummary.css";

const OrderSummary = ({
    subtotal,
    couponCode,
    setCouponCode,
    appliedCoupon,
    availableCoupons = [],
    couponLoading,
    couponsLoading,
    discountAmount = 0,
    onApplyCoupon,
    onRemoveCoupon,
    onSelectCoupon,
}) => {
    const { cartItems = [] } = useContext(ShopContext);

    const shipping = 0;
    const tax = 0;
    const grandTotal = Math.max(
        subtotal + shipping + tax - discountAmount,
        0
    );

    return (
        <Card className="order-summary-card">
            <Card.Body>
                <h3 className="summary-title">
                    Order Summary
                </h3>
                <ListGroup variant="flush">
                    {cartItems.map((item) => (
                        <ListGroup.Item
                            key={item.product?._id}
                            className="summary-product"
                        >
                            <div className="summary-product-info">
                                <h6>{item.product?.name}</h6>
                                <span>
                                    Qty: {item.quantity}
                                </span>
                            </div>
                            <strong>
                                ₹{(item.product?.price?.discounted || 0) * item.quantity}
                            </strong>
                        </ListGroup.Item>
                    ))}
                    <ListGroup.Item>
                        <Form.Label className="fw-semibold">
                            Coupon Code
                        </Form.Label>
                        <div className="d-flex gap-2">
                            <Form.Control
                                type="text"
                                placeholder="Enter coupon code"
                                value={couponCode}
                                onChange={(e) =>
                                    setCouponCode(e.target.value.toUpperCase())
                                }
                                disabled={couponLoading || !!appliedCoupon}
                            />
                            {appliedCoupon ? (
                                <Button
                                    variant="outline-danger"
                                    type="button"
                                    onClick={onRemoveCoupon}
                                >
                                    Remove
                                </Button>
                            ) : (
                                <Button
                                    variant="dark"
                                    type="button"
                                    onClick={() =>
                                        onApplyCoupon()
                                    }
                                    disabled={couponLoading}
                                >
                                    {couponLoading
                                        ? "Applying..."
                                        : "Apply"}
                                </Button>
                            )}
                        </div>
                    </ListGroup.Item>
                    {availableCoupons.length > 0 && (
                        <ListGroup.Item>
                            <div className="fw-semibold mb-2">
                                Available Coupons
                            </div>
                            <div className="d-flex flex-column gap-2">
                                {availableCoupons.map((coupon) => (
                                    <div
                                        key={coupon._id}
                                        className="border rounded p-2"
                                    >
                                        <div className="d-flex justify-content-between align-items-center gap-2">
                                            <div>
                                                <strong>
                                                    {coupon.code}
                                                </strong>
                                                {coupon.description && (
                                                    <div className="small text-muted">
                                                        {coupon.description}
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                variant="outline-dark"
                                                size="sm"
                                                type="button"
                                                onClick={() =>
                                                    onSelectCoupon(coupon)
                                                }
                                            >
                                                Use
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ListGroup.Item>
                    )}
                    <ListGroup.Item className="summary-row">
                        <span>Subtotal</span>
                        <strong>₹{subtotal}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="summary-row">
                        <span>Shipping</span>
                        <strong className="free-text">
                            FREE
                        </strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="summary-row">
                        <span>Tax</span>
                        <strong>₹0</strong>
                    </ListGroup.Item>
                    {discountAmount > 0 && (
                        <ListGroup.Item className="summary-row">
                            <span>Coupon Discount</span>
                            <strong>
                                -₹{discountAmount}
                            </strong>
                        </ListGroup.Item>
                    )}
                    <ListGroup.Item className="summary-total">
                        <span>Grand Total</span>
                        <h4>₹{grandTotal}</h4>
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    );
};

export default OrderSummary;