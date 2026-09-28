import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import api from "../../services/api";
import { checkout } from "../../services/checkout.service";
import "./PlaceOrderButton.css";

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const existingScript = document.getElementById("razorpay-checkout-script");
        if (existingScript) {
            if (window.Razorpay) {
                resolve(true);
            } else {
                existingScript.addEventListener(
                    "load",
                    () => resolve(true),
                    { once: true }
                );
                existingScript.addEventListener(
                    "error",
                    () => resolve(false),
                    { once: true }
                );
            }
            return;
        }
        const script = document.createElement("script");
        script.id = "razorpay-checkout-script";
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

const PlaceOrderButton = ({
    address,
    paymentMethod,
    couponCode,
}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const checkoutInProgressRef = useRef(false);
    const verificationInProgressRef = useRef(false);
    const paymentCompletedRef = useRef(false);

    const validateAddress = () => {
        const requiredFields = [
            "fullName",
            "phone",
            "addressLine1",
            "city",
            "state",
            "pincode",
            "country",
        ];
        for (const field of requiredFields) {
            const value = address?.[field];
            if (typeof value !== "string" || !value.trim()) {
                toast.error(`${field} is required`);
                return false;
            }
        }
        return true;
    };

    const resetCheckoutState = () => {
        checkoutInProgressRef.current = false;
        verificationInProgressRef.current = false;
        setLoading(false);
    };

    const handleCODOrder = (response) => {
        const order = response?.order || (response?._id ? response : null);
        if (!order) {
            toast.error("Order was created, but order details are missing.");
            resetCheckoutState();
            return;
        }
        toast.success("Order placed successfully!");
        resetCheckoutState();
        navigate("/order-success", {
            state: order,
        });
    };

    const handleRazorpayPayment = async (response) => {
        try {
            const order = response?.order || (response?._id ? response : null);
            const payment = response?.payment;
            if (!order?._id) {
                throw new Error("Order ID is missing from checkout response.");
            }
            if (!payment) {
                console.error("Razorpay payment object missing.", {
                    response,
                    order,
                });
                throw new Error(
                    "Payment information was not returned by the server."
                );
            }
            if (payment.method !== "RAZORPAY") {
                throw new Error("Invalid payment method returned by server.");
            }
            if (payment.status !== "CREATED") {
                throw new Error(
                    `Invalid Razorpay payment status: ${payment.status || "UNKNOWN"}`
                );
            }
            if (!payment.gatewayOrderId) {
                throw new Error(
                    "Razorpay order ID was not returned by the server."
                );
            }
            if (!payment.keyId) {
                throw new Error("Razorpay configuration is missing.");
            }
            if (
                typeof payment.amount !== "number" ||
                !Number.isFinite(payment.amount) ||
                payment.amount <= 0
            ) {
                throw new Error("Invalid payment amount.");
            }
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error(
                    "Unable to load Razorpay. Please check your internet connection and try again."
                );
            }
            if (typeof window.Razorpay !== "function") {
                throw new Error("Razorpay Checkout is unavailable.");
            }
            const amountInPaise = Math.round(payment.amount * 100);
            if (amountInPaise <= 0) {
                throw new Error("Invalid Razorpay amount.");
            }
            const options = {
                key: payment.keyId,
                amount: amountInPaise,
                currency: payment.currency || "INR",
                name: "ReadyBuy",
                description: "ReadyBuy Order Payment",
                order_id: payment.gatewayOrderId,
                handler: async (razorpayResponse) => {
                    if (verificationInProgressRef.current) {
                        return;
                    }
                    verificationInProgressRef.current = true;
                    paymentCompletedRef.current = true;
                    try {
                        console.log(
                            "========== RAZORPAY SUCCESS =========="
                        );
                        console.log("Local Order ID:", order._id);
                        console.log(
                            "Razorpay Order ID:",
                            razorpayResponse?.razorpay_order_id
                        );
                        console.log(
                            "Razorpay Payment ID:",
                            razorpayResponse?.razorpay_payment_id
                        );
                        console.log("=======================================");
                        if (!razorpayResponse?.razorpay_order_id) {
                            throw new Error("Razorpay order ID is missing.");
                        }
                        if (!razorpayResponse?.razorpay_payment_id) {
                            throw new Error("Razorpay payment ID is missing.");
                        }
                        if (!razorpayResponse?.razorpay_signature) {
                            throw new Error("Razorpay payment signature is missing.");
                        }
                        if (
                            razorpayResponse.razorpay_order_id !==
                            payment.gatewayOrderId
                        ) {
                            throw new Error("Razorpay order ID mismatch.");
                        }
                        const verificationResponse = await api.post(
                            "/payments/verify",
                            {
                                orderId: order._id,
                                razorpayOrderId:
                                    razorpayResponse.razorpay_order_id,
                                razorpayPaymentId:
                                    razorpayResponse.razorpay_payment_id,
                                razorpaySignature:
                                    razorpayResponse.razorpay_signature,
                            }
                        );
                        console.log(
                            "Payment verification response:",
                            verificationResponse
                        );
                        toast.success(
                            verificationResponse?.data?.message ||
                            "Payment successful!"
                        );
                        checkoutInProgressRef.current = false;
                        navigate("/order-success", {
                            state: order,
                        });
                    } catch (error) {
                        console.error(
                            "Payment verification failed:",
                            error
                        );
                        paymentCompletedRef.current = false;
                        toast.error(
                            error?.response?.data?.message ||
                            error?.message ||
                            "Payment verification failed."
                        );
                    } finally {
                        verificationInProgressRef.current = false;
                        checkoutInProgressRef.current = false;
                        setLoading(false);
                    }
                },
                prefill: {
                    name: address?.fullName || "",
                    contact: address?.phone || "",
                },
                notes: {
                    orderId: order._id,
                },
                theme: {
                    color: "#111111",
                },
                modal: {
                    ondismiss: () => {
                        if (paymentCompletedRef.current) {
                            return;
                        }
                        toast.info("Payment cancelled.");
                        checkoutInProgressRef.current = false;
                        setLoading(false);
                    },
                },
            };
            const razorpay = new window.Razorpay(options);
            razorpay.on("payment.failed", (failureResponse) => {
                console.error(
                    "Razorpay payment failed:",
                    failureResponse
                );
                paymentCompletedRef.current = false;
                toast.error(
                    failureResponse?.error?.description ||
                    "Payment failed. Please try again."
                );
                checkoutInProgressRef.current = false;
                setLoading(false);
            });
            razorpay.open();
        } catch (error) {
            console.error(
                "Razorpay initialization error:",
                error
            );
            toast.error(
                error?.message ||
                "Unable to start Razorpay payment."
            );
            checkoutInProgressRef.current = false;
            setLoading(false);
        }
    };

    const mutation = useMutation({
        mutationFn: checkout,
        onSuccess: async (response) => {
            console.log("Checkout response:", response);
            console.log("========== CHECKOUT DEBUG ==========");
            console.log("Full response:", response);
            console.log("Order:", response?.order);
            console.log("Payment:", response?.payment);
            console.log(
                "Gateway Order ID:",
                response?.payment?.gatewayOrderId
            );
            console.log(
                "Payment Method:",
                response?.payment?.method
            );
            console.log(
                "Payment Status:",
                response?.payment?.status
            );
            console.log("====================================");
            const method =
                response?.payment?.method ||
                paymentMethod;
            if (method === "COD") {
                handleCODOrder(response);
                return;
            }
            if (method === "RAZORPAY") {
                await handleRazorpayPayment(response);
                return;
            }
            toast.error("Unsupported payment method.");
            resetCheckoutState();
        },
        onError: (error) => {
            console.error("Checkout error:", error);
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to place order."
            );
            resetCheckoutState();
        },
    });

    const handlePlaceOrder = () => {
        if (checkoutInProgressRef.current) {
            return;
        }
        if (mutation.isPending) {
            return;
        }
        if (!validateAddress()) {
            return;
        }
        if (!paymentMethod) {
            toast.error("Please select a payment method.");
            return;
        }
        checkoutInProgressRef.current = true;
        setLoading(true);
        console.log("Creating order with:", {
            shippingAddress: address,
            paymentMethod: paymentMethod,
            couponCode: couponCode || undefined,
        });
        console.log("========== READYBUY CHECKOUT ==========");
        console.log("Payment Method:", paymentMethod);
        console.log("Address:", address);
        console.log("Coupon Code:", couponCode || "None");
        console.log("========================================");
        mutation.mutate({
            shippingAddress: address,
            paymentMethod: paymentMethod,
            ...(couponCode && {
                couponCode,
            }),
        });
    };

    return (
        <Button
            variant="dark"
            className="w-100"
            type="button"
            disabled={loading || mutation.isPending}
            onClick={handlePlaceOrder}
        >
            {loading || mutation.isPending ? (
                <>
                    <Spinner
                        animation="border"
                        size="sm"
                        className="me-2"
                    />
                    Processing...
                </>
            ) : (
                paymentMethod === "RAZORPAY"
                    ? "Pay Now"
                    : "Place Order"
            )}
        </Button>
    );
};

export default PlaceOrderButton;