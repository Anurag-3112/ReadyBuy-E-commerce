import { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import AddressForm from "../Components/Checkout/AddressForm";
import OrderSummary from "../Components/Checkout/OrderSummary";
import PaymentMethod from "../Components/Checkout/PaymentMethod";
import PlaceOrderButton from "../Components/Checkout/PlaceOrderButton";

import "./CSS/Checkout.css";

const Checkout = () => {

    const [address, setAddress] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
    });

    const [paymentMethod, setPaymentMethod] = useState("COD");

    return (

        <section className="checkout-page">

            <Container>

                <div className="checkout-header">

                    <span className="checkout-tag">
                        Secure Checkout
                    </span>

                    <h1>
                        Complete Your Order
                    </h1>

                    <p>
                        Your information is encrypted and protected.
                        Complete your purchase securely.
                    </p>

                </div>

                <Row className="g-5">

                    <Col lg={7}>

                        <AddressForm
                            address={address}
                            setAddress={setAddress}
                        />

                        <div className="payment-wrapper">

                            <PaymentMethod
                                paymentMethod={paymentMethod}
                                setPaymentMethod={setPaymentMethod}
                            />

                        </div>

                    </Col>

                    <Col lg={5}>

                        <div className="checkout-sidebar">

                            <OrderSummary />

                            <PlaceOrderButton
                                address={address}
                                paymentMethod={paymentMethod}
                            />

                        </div>

                    </Col>

                </Row>

            </Container>

        </section>

    );

};

export default Checkout;