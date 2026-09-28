import { useContext, useEffect, useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AddressForm from "../Components/Checkout/AddressForm";
import OrderSummary from "../Components/Checkout/OrderSummary";
import PaymentMethod from "../Components/Checkout/PaymentMethod";
import PlaceOrderButton from "../Components/Checkout/PlaceOrderButton";
import { ShopContext } from "../Context/ShopContext";
import {
    applyCoupon,
    getAvailableCoupons,
} from "../admin/services/coupon.admin.service";
import { toast } from "react-toastify";
import "./CSS/Checkout.css";

const Checkout = () => {
    const { cartItems = [] } = useContext(ShopContext);
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
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponsLoading, setCouponsLoading] = useState(false);

    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => {
            const price = item.product?.price?.discounted || 0;
            return total + price * item.quantity;
        }, 0);
    }, [cartItems]);

    useEffect(() => {
        const fetchAvailableCoupons = async () => {
            try {
                setCouponsLoading(true);
                const data = await getAvailableCoupons();
                const coupons = Array.isArray(data)
                    ? data
                    : data?.coupons || data?.docs || [];
                setAvailableCoupons(coupons);
            } catch (error) {
                console.error(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to load coupons."
                );
            } finally {
                setCouponsLoading(false);
            }
        };

        fetchAvailableCoupons();
    }, []);

    const handleApplyCoupon = async (code = couponCode) => {
        const trimmedCode = code.trim();

        if (!trimmedCode) {
            toast.error("Please enter a coupon code.");
            return;
        }

        if (subtotal <= 0) {
            toast.error("Your cart is empty.");
            return;
        }

        try {
            setCouponLoading(true);
            const result = await applyCoupon({
                code: trimmedCode,
                orderTotal: subtotal,
            });

            setCouponCode(
                result?.couponCode ||
                result?.coupon?.code ||
                trimmedCode.toUpperCase()
            );
            setAppliedCoupon(result);
            toast.success(
                result?.message ||
                "Coupon applied successfully!"
            );
        } catch (error) {
            setAppliedCoupon(null);
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to apply coupon."
            );
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
    };

    const handleSelectCoupon = (coupon) => {
        setCouponCode(coupon?.code || "");
    };

    const discountAmount = Number(
        appliedCoupon?.discountAmount || 0
    );

    return (
        <section className="checkout-page">
            <Container>
                <div className="checkout-header">
                    <span className="checkout-tag">
                        Secure Checkout
                    </span>
                    <h1>Complete Your Order</h1>
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
                            <OrderSummary
                                subtotal={subtotal}
                                couponCode={couponCode}
                                setCouponCode={setCouponCode}
                                appliedCoupon={appliedCoupon}
                                availableCoupons={availableCoupons}
                                couponLoading={couponLoading}
                                couponsLoading={couponsLoading}
                                discountAmount={discountAmount}
                                onApplyCoupon={handleApplyCoupon}
                                onRemoveCoupon={handleRemoveCoupon}
                                onSelectCoupon={handleSelectCoupon}
                            />
                            <PlaceOrderButton
                                address={address}
                                paymentMethod={paymentMethod}
                                couponCode={
                                    appliedCoupon?.couponCode ||
                                    appliedCoupon?.coupon?.code ||
                                    (appliedCoupon ? couponCode : "")
                                }
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Checkout;