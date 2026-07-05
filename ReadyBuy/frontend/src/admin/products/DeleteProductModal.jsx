import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";

import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

import {
    deleteProduct,
} from "../services/product.admin.service";

const DeleteProductModal = ({
    show,
    handleClose,
    product,
}) => {

    const queryClient =
        useQueryClient();

    const mutation =
        useMutation({

            mutationFn: () =>
                deleteProduct(
                    product._id
                ),

            onSuccess: () => {

                toast.success(
                    "Product deleted successfully."
                );

                queryClient.invalidateQueries({

                    queryKey: [
                        "products"
                    ],

                });

                handleClose();

            },

            onError: (error) => {

                toast.error(

                    error.response?.data?.message ||

                    "Unable to delete product."

                );

            },

        });

    if (!product) {

        return null;

    }

    return (

        <ConfirmDeleteModal

            show={show}

            handleClose={handleClose}

            title="Delete Product"

            message={`Are you sure you want to delete "${product.name}"?`}

            loading={mutation.isPending}

            onConfirm={() =>
                mutation.mutate()
            }

        />

    );

};

export default DeleteProductModal;