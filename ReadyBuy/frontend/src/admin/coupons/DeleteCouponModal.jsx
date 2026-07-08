import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";

import {
    deleteCoupon,
} from "../services/coupon.admin.service";

const DeleteCouponModal = ({
    show,
    handleClose,
    coupon,
}) => {

    const queryClient =
        useQueryClient();

    const mutation =
        useMutation({

            mutationFn: () =>
                deleteCoupon(
                    coupon._id
                ),

            onSuccess: () => {

                toast.success(
                    "Coupon deleted successfully."
                );

                queryClient.invalidateQueries({

                    queryKey: ["coupons"],

                });

                handleClose();

            },

            onError: (error) => {

                toast.error(

                    error.response?.data?.message ||

                    "Failed to delete coupon."

                );

            },

        });

    const handleDelete = () => {

        mutation.mutate();

    };

    if (!coupon) return null;

    return (

        <Modal

            show={show}

            onHide={handleClose}

            centered

        >

            <Modal.Header closeButton>

                <Modal.Title>

                    Delete Coupon

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <p>

                    Are you sure you want to
                    delete coupon

                    <strong>

                        {" "}

                        {coupon.code}

                    </strong>

                    ?

                </p>

                <p className="text-muted">

                    This action cannot be
                    undone.

                </p>

            </Modal.Body>

            <Modal.Footer>

                <Button

                    variant="secondary"

                    onClick={handleClose}

                    disabled={
                        mutation.isPending
                    }

                >

                    Cancel

                </Button>

                <Button

                    variant="danger"

                    onClick={handleDelete}

                    disabled={
                        mutation.isPending
                    }

                >

                    {

                        mutation.isPending

                            ? "Deleting..."

                            : "Delete"

                    }

                </Button>

            </Modal.Footer>

        </Modal>

    );

};

export default DeleteCouponModal;