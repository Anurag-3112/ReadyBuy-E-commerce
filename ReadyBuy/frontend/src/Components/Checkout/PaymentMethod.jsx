import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import "./PaymentMethod.css";

const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => {

    const methods = [
        {
            value: "COD",
            label: "Cash On Delivery",
            enabled: true,
        },
        {
            value: "RAZORPAY",
            label: "Razorpay",
            enabled: false,
        },
        {
            value: "STRIPE",
            label: "Stripe",
            enabled: false,
        },
        {
            value: "PAYPAL",
            label: "PayPal",
            enabled: false,
        },
    ];

    return (

        <div className="payment-method">

            <h4>Payment Method</h4>

            {methods.map((method) => (

                <div
                    key={method.value}
                    className={`payment-option ${paymentMethod === method.value
                            ? "active"
                            : ""
                        } ${!method.enabled
                            ? "disabled"
                            : ""
                        }`}
                >

                    <Form.Check
                        type="radio"
                        id={method.value}
                        checked={
                            paymentMethod === method.value
                        }
                        disabled={!method.enabled}
                        onChange={() =>
                            setPaymentMethod(method.value)
                        }
                        label={
                            <div className="payment-label">

                                <span>
                                    {method.label}
                                </span>

                                {!method.enabled && (
                                    <Badge className="coming-badge">
                                        Coming Soon
                                    </Badge>
                                )}

                            </div>
                        }
                    />

                </div>

            ))}

        </div>

    );
};

export default PaymentMethod;