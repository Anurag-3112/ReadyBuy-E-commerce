import { useRef, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { toast } from "react-toastify";

import api from "../../services/api";
import { checkout } from "../../services/checkout.service";

import "./PlaceOrderButton.css";


/*
 * ------------------------------------------------
 * Load Razorpay Checkout SDK
 * ------------------------------------------------
 */
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const existingScript =
            document.getElementById(
                "razorpay-checkout-script"
            );

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

        const script =
            document.createElement("script");

        script.id =
            "razorpay-checkout-script";

        script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

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
}) => {

    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(false);


    /*
     * Prevent duplicate order creation.
     */
    const checkoutInProgressRef =
        useRef(false);


    /*
     * Prevent duplicate Razorpay verification.
     */
    const verificationInProgressRef =
        useRef(false);


    /*
     * Prevent "Payment cancelled" from being
     * displayed after a successful payment.
     */
    const paymentCompletedRef =
        useRef(false);


    /*
     * ------------------------------------------------
     * Validate shipping address
     * ------------------------------------------------
     */
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

        for (
            const field of requiredFields
        ) {

            const value =
                address?.[field];

            if (
                typeof value !== "string" ||
                !value.trim()
            ) {

                toast.error(
                    `${field} is required`
                );

                return false;
            }
        }

        return true;
    };


    /*
     * ------------------------------------------------
     * Reset checkout state
     * ------------------------------------------------
     */
    const resetCheckoutState = () => {

        checkoutInProgressRef.current =
            false;

        verificationInProgressRef.current =
            false;

        setLoading(false);
    };


    /*
     * ------------------------------------------------
     * Handle successful COD order
     * ------------------------------------------------
     */
    const handleCODOrder = (response) => {

        /*
         * Backend normally returns:
         *
         * {
         *     order: {...},
         *     payment: {...}
         * }
         *
         * But we also tolerate a direct order
         * object to make the frontend robust.
         */
        const order =
            response?.order ||
            (
                response?._id
                    ? response
                    : null
            );


        if (!order) {

            toast.error(
                "Order was created, but order details are missing."
            );

            resetCheckoutState();

            return;
        }


        toast.success(
            "Order placed successfully!"
        );


        resetCheckoutState();


        navigate(
            "/order-success",
            {
                state: order,
            }
        );
    };


    /*
     * ------------------------------------------------
     * Open Razorpay Checkout
     * ------------------------------------------------
     */
    const handleRazorpayPayment = async (
        response
    ) => {

        try {

            /*
             * Normalize backend response.
             *
             * Expected:
             *
             * {
             *     order: {...},
             *     payment: {...}
             * }
             */
            const order =
                response?.order ||
                (
                    response?._id
                        ? response
                        : null
                );

            const payment =
                response?.payment;


            /*
             * We absolutely need the order.
             */
            if (!order?._id) {

                throw new Error(
                    "Order ID is missing from checkout response."
                );
            }


            /*
             * We absolutely need the payment object.
             *
             * IMPORTANT:
             *
             * The frontend cannot create a Razorpay
             * gatewayOrderId itself.
             *
             * It must come from our backend.
             */
            if (!payment) {

                console.error(
                    "Razorpay payment object missing.",
                    {
                        response,
                        order,
                    }
                );

                throw new Error(
                    "Payment information was not returned by the server."
                );
            }


            /*
             * Validate payment method.
             */
            if (
                payment.method !==
                "RAZORPAY"
            ) {

                throw new Error(
                    "Invalid payment method returned by server."
                );
            }


            /*
             * Validate payment status.
             */
            if (
                payment.status !==
                "CREATED"
            ) {

                throw new Error(
                    `Invalid Razorpay payment status: ${payment.status || "UNKNOWN"}`
                );
            }


            /*
             * Validate Razorpay order ID.
             */
            if (
                !payment.gatewayOrderId
            ) {

                throw new Error(
                    "Razorpay order ID was not returned by the server."
                );
            }


            /*
             * Validate Razorpay public key.
             */
            if (
                !payment.keyId
            ) {

                throw new Error(
                    "Razorpay configuration is missing."
                );
            }


            /*
             * Validate payment amount.
             *
             * Backend stores amount in RUPEES.
             */
            if (
                typeof payment.amount !==
                "number" ||
                !Number.isFinite(
                    payment.amount
                ) ||
                payment.amount <= 0
            ) {

                throw new Error(
                    "Invalid payment amount."
                );
            }


            /*
             * ------------------------------------------------
             * Load Razorpay SDK
             * ------------------------------------------------
             */
            const scriptLoaded =
                await loadRazorpayScript();


            if (!scriptLoaded) {

                throw new Error(
                    "Unable to load Razorpay. Please check your internet connection and try again."
                );
            }


            /*
             * Make sure SDK is available.
             */
            if (
                typeof window.Razorpay !==
                "function"
            ) {

                throw new Error(
                    "Razorpay Checkout is unavailable."
                );
            }


            /*
             * ------------------------------------------------
             * Convert RUPEES → PAISE
             * ------------------------------------------------
             *
             * Backend:
             *
             * 15998 INR
             *
             * Razorpay:
             *
             * 1599800 paise
             */
            const amountInPaise =
                Math.round(
                    payment.amount * 100
                );


            if (
                amountInPaise <= 0
            ) {

                throw new Error(
                    "Invalid Razorpay amount."
                );
            }


            /*
             * ------------------------------------------------
             * Razorpay Checkout configuration
             * ------------------------------------------------
             */
            const options = {

                /*
                 * Razorpay public/test key.
                 */
                key:
                    payment.keyId,


                /*
                 * Amount must be in paise.
                 */
                amount:
                    amountInPaise,


                /*
                 * Currency.
                 */
                currency:
                    payment.currency ||
                    "INR",


                /*
                 * Merchant information.
                 */
                name:
                    "ReadyBuy",


                description:
                    "ReadyBuy Order Payment",


                /*
                 * IMPORTANT:
                 *
                 * This MUST be the Razorpay order
                 * created by our backend.
                 */
                order_id:
                    payment.gatewayOrderId,


                /*
                 * ------------------------------------------------
                 * Successful payment
                 * ------------------------------------------------
                 */
                handler:
                    async (
                        razorpayResponse
                    ) => {

                        /*
                         * Prevent duplicate verification.
                         */
                        if (
                            verificationInProgressRef.current
                        ) {
                            return;
                        }


                        verificationInProgressRef.current =
                            true;

                        paymentCompletedRef.current =
                            true;


                        try {

                            console.log(
                                "========== RAZORPAY SUCCESS =========="
                            );

                            console.log(
                                "Local Order ID:",
                                order._id
                            );

                            console.log(
                                "Razorpay Order ID:",
                                razorpayResponse
                                    ?.razorpay_order_id
                            );

                            console.log(
                                "Razorpay Payment ID:",
                                razorpayResponse
                                    ?.razorpay_payment_id
                            );

                            console.log(
                                "======================================="
                            );


                            /*
                             * Validate Razorpay response.
                             */
                            if (
                                !razorpayResponse
                                    ?.razorpay_order_id
                            ) {

                                throw new Error(
                                    "Razorpay order ID is missing."
                                );
                            }


                            if (
                                !razorpayResponse
                                    ?.razorpay_payment_id
                            ) {

                                throw new Error(
                                    "Razorpay payment ID is missing."
                                );
                            }


                            if (
                                !razorpayResponse
                                    ?.razorpay_signature
                            ) {

                                throw new Error(
                                    "Razorpay payment signature is missing."
                                );
                            }


                            /*
                             * Make sure Razorpay returned
                             * the same gateway order that our
                             * backend created.
                             */
                            if (
                                razorpayResponse
                                    .razorpay_order_id !==
                                payment.gatewayOrderId
                            ) {

                                throw new Error(
                                    "Razorpay order ID mismatch."
                                );
                            }


                            /*
                             * ------------------------------------------------
                             * Verify payment on backend
                             * ------------------------------------------------
                             */
                            const verificationResponse =
                                await api.post(
                                    "/payments/verify",
                                    {
                                        orderId:
                                            order._id,

                                        razorpayOrderId:
                                            razorpayResponse
                                                .razorpay_order_id,

                                        razorpayPaymentId:
                                            razorpayResponse
                                                .razorpay_payment_id,

                                        razorpaySignature:
                                            razorpayResponse
                                                .razorpay_signature,
                                    }
                                );


                            console.log(
                                "Payment verification response:",
                                verificationResponse
                            );


                            /*
                             * Payment successfully verified.
                             */
                            toast.success(
                                verificationResponse
                                    ?.data
                                    ?.message ||
                                "Payment successful!"
                            );


                            /*
                             * Release checkout lock.
                             */
                            checkoutInProgressRef.current =
                                false;


                            /*
                             * Navigate only after backend
                             * verification succeeds.
                             */
                            navigate(
                                "/order-success",
                                {
                                    state: order,
                                }
                            );

                        } catch (error) {

                            console.error(
                                "Payment verification failed:",
                                error
                            );


                            paymentCompletedRef.current =
                                false;


                            toast.error(
                                error
                                    ?.response
                                    ?.data
                                    ?.message ||
                                error?.message ||
                                "Payment verification failed."
                            );

                        } finally {

                            verificationInProgressRef.current =
                                false;

                            checkoutInProgressRef.current =
                                false;

                            setLoading(false);
                        }
                    },


                /*
                 * ------------------------------------------------
                 * Customer information
                 * ------------------------------------------------
                 */
                prefill: {

                    name:
                        address?.fullName ||
                        "",

                    contact:
                        address?.phone ||
                        "",
                },


                /*
                 * ------------------------------------------------
                 * Additional information
                 * ------------------------------------------------
                 */
                notes: {

                    orderId:
                        order._id,
                },


                /*
                 * ------------------------------------------------
                 * Razorpay UI
                 * ------------------------------------------------
                 */
                theme: {

                    color:
                        "#111111",
                },


                /*
                 * ------------------------------------------------
                 * Modal callbacks
                 * ------------------------------------------------
                 */
                modal: {

                    ondismiss: () => {

                        /*
                         * Do not show "cancelled" after
                         * successful payment.
                         */
                        if (
                            paymentCompletedRef.current
                        ) {
                            return;
                        }


                        toast.info(
                            "Payment cancelled."
                        );


                        checkoutInProgressRef.current =
                            false;

                        setLoading(false);
                    },
                },
            };


            /*
             * ------------------------------------------------
             * Create Razorpay instance
             * ------------------------------------------------
             */
            const razorpay =
                new window.Razorpay(
                    options
                );


            /*
             * ------------------------------------------------
             * Razorpay payment failure
             * ------------------------------------------------
             */
            razorpay.on(
                "payment.failed",
                (
                    failureResponse
                ) => {

                    console.error(
                        "Razorpay payment failed:",
                        failureResponse
                    );


                    paymentCompletedRef.current =
                        false;


                    toast.error(
                        failureResponse
                            ?.error
                            ?.description ||
                        "Payment failed. Please try again."
                    );


                    checkoutInProgressRef.current =
                        false;

                    setLoading(false);
                }
            );


            /*
             * ------------------------------------------------
             * Open Razorpay
             * ------------------------------------------------
             *
             * IMPORTANT:
             *
             * We DO NOT set loading to false here.
             *
             * Razorpay is now open.
             */
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


            checkoutInProgressRef.current =
                false;

            setLoading(false);
        }
    };


    /*
     * ------------------------------------------------
     * Create order through backend
     * ------------------------------------------------
     */
    const mutation = useMutation({

        /*
         * IMPORTANT:
         *
         * Do NOT return response.order here.
         *
         * checkout() already returns:
         *
         * response.data.data
         *
         * which should contain:
         *
         * {
         *     order,
         *     payment
         * }
         */
        mutationFn:
            checkout,


        /*
         * ------------------------------------------------
         * Successful order creation
         * ------------------------------------------------
         */
        onSuccess:
            async (response) => {

                console.log(
                    "Checkout response:",
                    response
                );


                console.log(
                    "========== CHECKOUT DEBUG =========="
                );

                console.log(
                    "Full response:",
                    response
                );

                console.log(
                    "Order:",
                    response?.order
                );

                console.log(
                    "Payment:",
                    response?.payment
                );

                console.log(
                    "Gateway Order ID:",
                    response
                        ?.payment
                        ?.gatewayOrderId
                );

                console.log(
                    "Payment Method:",
                    response
                        ?.payment
                        ?.method
                );

                console.log(
                    "Payment Status:",
                    response
                        ?.payment
                        ?.status
                );

                console.log(
                    "===================================="
                );


                /*
                 * Determine payment method.
                 *
                 * Prefer the backend response.
                 */
                const method =
                    response
                        ?.payment
                        ?.method ||
                    paymentMethod;


                /*
                 * ------------------------------------------------
                 * COD
                 * ------------------------------------------------
                 */
                if (
                    method ===
                    "COD"
                ) {

                    handleCODOrder(
                        response
                    );

                    return;
                }


                /*
                 * ------------------------------------------------
                 * RAZORPAY
                 * ------------------------------------------------
                 */
                if (
                    method ===
                    "RAZORPAY"
                ) {

                    await handleRazorpayPayment(
                        response
                    );

                    return;
                }


                /*
                 * Unsupported method.
                 */
                toast.error(
                    "Unsupported payment method."
                );


                resetCheckoutState();
            },


        /*
         * ------------------------------------------------
         * Order creation failed
         * ------------------------------------------------
         */
        onError:
            (error) => {

                console.error(
                    "Checkout error:",
                    error
                );


                toast.error(
                    error
                        ?.response
                        ?.data
                        ?.message ||
                    error?.message ||
                    "Failed to place order."
                );


                resetCheckoutState();
            },
    });


    /*
     * ------------------------------------------------
     * Main checkout handler
     * ------------------------------------------------
     */
    const handlePlaceOrder = () => {

        /*
         * HARD protection against
         * duplicate checkout requests.
         */
        if (
            checkoutInProgressRef.current
        ) {
            return;
        }


        /*
         * React Query protection.
         */
        if (
            mutation.isPending
        ) {
            return;
        }


        /*
         * Validate address.
         */
        if (
            !validateAddress()
        ) {
            return;
        }


        /*
         * Validate payment method.
         */
        if (
            !paymentMethod
        ) {

            toast.error(
                "Please select a payment method."
            );

            return;
        }


        /*
         * Lock synchronously.
         */
        checkoutInProgressRef.current =
            true;


        setLoading(true);


        /*
         * Debug information.
         */
        console.log(
            "Creating order with:",
            {
                shippingAddress:
                    address,

                paymentMethod:
                    paymentMethod,
            }
        );


        console.log(
            "========== READYBUY CHECKOUT =========="
        );

        console.log(
            "Payment Method:",
            paymentMethod
        );

        console.log(
            "Address:",
            address
        );

        console.log(
            "========================================"
        );


        /*
         * Create backend order.
         */
        mutation.mutate({

            shippingAddress:
                address,

            paymentMethod:
                paymentMethod,
        });
    };


    /*
     * ------------------------------------------------
     * Render
     * ------------------------------------------------
     */
    return (
        <Button
            variant="dark"
            className="w-100"
            type="button"
            disabled={
                loading ||
                mutation.isPending
            }
            onClick={
                handlePlaceOrder
            }
        >

            {loading ||
                mutation.isPending ? (

                <>
                    <Spinner
                        animation="border"
                        size="sm"
                        className="me-2"
                    />

                    Processing...
                </>

            ) : (

                paymentMethod ===
                    "RAZORPAY"

                    ? "Pay Now"

                    : "Place Order"
            )}

        </Button>
    );
};


export default PlaceOrderButton;