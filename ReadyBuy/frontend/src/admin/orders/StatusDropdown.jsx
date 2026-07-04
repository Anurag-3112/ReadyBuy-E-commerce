import { useMutation, useQueryClient } from "@tanstack/react-query";
import Form from "react-bootstrap/Form";

import { toast } from "react-toastify";

import { updateOrderStatus } from "../services/order.admin.service";

const StatusDropdown = ({
    order,
    onChange,
}) => {

    const queryClient =
        useQueryClient();

    const mutation =
        useMutation({

            mutationFn:
                (status) =>

                    updateOrderStatus(
                        order._id,
                        status
                    ),

            onSuccess: () => {

                toast.success(
                    "Order updated successfully."
                );

                queryClient.invalidateQueries({
                    queryKey: ["orders"],
                });

            },

            onError: (error) => {

                toast.error(

                    error.response?.data?.message ||

                    "Unable to update order."

                );

            },

        });

    const handleChange = (e) => {

        const status =
            e.target.value;

        mutation.mutate(status);

        if (onChange) {

            onChange(status);

        }

    };

    return (

        <Form.Select

            size="sm"

            value={order.status}

            disabled={mutation.isPending}

            onChange={handleChange}

        >

            <option value="PENDING">

                Pending

            </option>

            <option value="PAID">

                Paid

            </option>

            <option value="SHIPPED">

                Shipped

            </option>

            <option value="DELIVERED">

                Delivered

            </option>

            <option value="CANCELLED">

                Cancelled

            </option>

        </Form.Select>

    );

};

export default StatusDropdown;