import { useContext } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { ShopContext } from "../../Context/ShopContext";
import "./OrderSummary.css";

const OrderSummary = () => {
    const { cartItems = [] } = useContext(ShopContext);

    const subtotal = cartItems.reduce((total, item) => {
        const price = item.product?.price?.discounted || 0;
        return total + price * item.quantity;
    }, 0);

    const shipping = 0;
    const tax = 0;
    const grandTotal = subtotal + shipping + tax;

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

                    <ListGroup.Item className="summary-row">
                        <span>Subtotal</span>
                        <strong>₹{subtotal}</strong>
                    </ListGroup.Item>

                    <ListGroup.Item className="summary-row">
                        <span>Shipping</span>
                        <strong className="free-text">FREE</strong>
                    </ListGroup.Item>

                    <ListGroup.Item className="summary-row">
                        <span>Tax</span>
                        <strong>₹0</strong>
                    </ListGroup.Item>

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