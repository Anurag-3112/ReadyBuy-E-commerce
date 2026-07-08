import Modal from "react-bootstrap/Modal";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";

import CouponForm from "./CouponForm";

import {
    createCoupon,
    updateCoupon,
} from "../services/coupon.admin.service";

const CouponModal = ({
    show,
    handleClose,
    coupon,
}) => {

    const queryClient =
        useQueryClient();

    const mutation =
        useMutation({

            mutationFn: (payload) => {

                if (coupon) {

                    return updateCoupon(

                        coupon._id,

                        payload

                    );

                }

                return createCoupon(
                    payload
                );

            },

            onSuccess: () => {

                toast.success(

                    coupon

                        ? "Coupon updated successfully."

                        : "Coupon created successfully."

                );

                queryClient.invalidateQueries({

                    queryKey: ["coupons"],

                });

                handleClose();

            },

            onError: (error) => {

                toast.error(

                    error.response?.data?.message ||

                    "Something went wrong."

                );

            },

        });

    const handleSubmit = (data) => {

        mutation.mutate(data);

    };

    return (

        <Modal

            show={show}

            onHide={handleClose}

            size="lg"

            centered

        >

            <Modal.Header closeButton>

                <Modal.Title>

                    {

                        coupon

                            ? "Edit Coupon"

                            : "Create Coupon"

                    }

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <CouponForm

                    initialData={coupon}

                    loading={mutation.isPending}

                    onSubmit={handleSubmit}

                />

            </Modal.Body>

        </Modal>

    );

};

export default CouponModal;