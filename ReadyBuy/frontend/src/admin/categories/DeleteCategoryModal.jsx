import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteProduct } from "../services/product.admin.service";

import { toast } from "react-toastify";

const DeleteProductModal = ({
    show,
    handleClose,
    product,
}) => {

    const queryClient = useQueryClient();

    const mutation = useMutation({

        mutationFn: () =>
            deleteProduct(product._id),

        onSuccess: () => {

            toast.success(

                "Product deleted successfully."

            );

            queryClient.invalidateQueries({

                queryKey: ["products"],

            });

            handleClose();

        },

        onError: (error) => {

            toast.error(

                error.response?.data?.message ||

                "Unable to delete product."

            );

        }

    });

    if (!product) return null;

    return (

        <Modal
            show={show}
            onHide={handleClose}
            centered
        >

            <Modal.Header closeButton>

                <Modal.Title>

                    Delete Product

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <Alert variant="warning">

                    Are you sure you want to delete

                    <strong>

                        {" "}

                        {product.name}

                    </strong>

                    ?

                </Alert>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={handleClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="danger"
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate()}
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

export default DeleteProductModal;