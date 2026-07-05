import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import { checkout } from "../../services/checkout.service";
import "./PlaceOrderButton.css";

const PlaceOrderButton = ({
    address,
    paymentMethod,
}) => {

    const navigate = useNavigate();

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

            if (!address[field]?.trim()) {

                toast.error(`${field} is required`);

                return false;

            }

        }

        return true;

    };

    const mutation = useMutation({

        mutationFn: checkout,

        onSuccess: (order) => {

            toast.success("Order placed successfully!");

            navigate("/order-success", {
                state: order,
            });

        },

        onError: (error) => {

            toast.error(

                error.response?.data?.message ||

                "Failed to place order."

            );

        },

    });

    const handlePlaceOrder = () => {

        if (!validateAddress()) return;

        mutation.mutate({

            shippingAddress: address,

            paymentMethod,

        });

    };

    return (

        <Button
            className="place-order-btn"
            size="lg"
            disabled={mutation.isPending}
            onClick={handlePlaceOrder}
        >

            {mutation.isPending ? (

                <>
                    <Spinner
                        animation="border"
                        size="sm"
                        className="me-2"
                    />
                    Processing...
                </>

            ) : (

                <>
                    🔒 Place Secure Order
                </>

            )}

        </Button>

    );

};

export default PlaceOrderButton;