import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import { toast } from "react-toastify";
import ProductForm from "./ProductForm";

import {
    createProduct,
    updateProduct,
} from "../services/product.admin.service";

const ProductModal = ({
    show,
    handleClose,
    product = null,
}) => {

    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createProduct,

        onSuccess: () => {

            toast.success(

                "Product updated successfully."

            );

            queryClient.invalidateQueries({

                queryKey: ["products"],

            });

            handleClose();

        },

        onError: (error) => {

            toast.error(

                error.response?.data?.message ||

                "Failed to update product."

            );

        }

    });

    const updateMutation = useMutation({

        mutationFn: ({ id, data }) =>
            updateProduct(id, data),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["products"],
            });

            handleClose();

        },

    });

    const handleSubmit = (data) => {

        if (product) {

            updateMutation.mutate({

                id: product._id,

                data,

            });

        } else {

            createMutation.mutate(data);

        }

    };

    const error =
        createMutation.error ||
        updateMutation.error;

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

                        product

                            ? "Edit Product"

                            : "Add Product"

                    }

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                {error && (

                    <Alert variant="danger">

                        {

                            error.response?.data
                                ?.message ||

                            "Something went wrong."

                        }

                    </Alert>

                )}

                <ProductForm

                    initialData={product}

                    loading={
                        createMutation.isPending ||
                        updateMutation.isPending
                    }

                    onSubmit={handleSubmit}

                />

            </Modal.Body>

        </Modal>

    );

};

export default ProductModal;