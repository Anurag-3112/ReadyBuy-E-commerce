import { FaHeart, FaRegHeart } from "react-icons/fa";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";

import {
    toggleWishlist,
} from "../../services/wishlist.service";

const WishlistButton = ({
    productId,
    isWishlisted,
}) => {

    const queryClient =
        useQueryClient();

    const mutation =
        useMutation({

            mutationFn: () =>
                toggleWishlist(
                    productId
                ),

            onSuccess: () => {

                queryClient.invalidateQueries({
                    queryKey: ["wishlist"],
                });

                queryClient.invalidateQueries({
                    queryKey: ["products"],
                });

                queryClient.invalidateQueries({
                    queryKey: ["product"],
                });

            },

            onError: (error) => {

                toast.error(

                    error.response?.data?.message ||

                    "Wishlist update failed."

                );

            },

        });

    return (

        <button

            className="btn btn-light rounded-circle shadow-sm"

            onClick={() =>
                mutation.mutate()
            }

            disabled={
                mutation.isPending
            }

        >

            {

                isWishlisted ? (

                    <FaHeart
                        color="red"
                        size={20}
                    />

                ) : (

                    <FaRegHeart
                        size={20}
                    />

                )

            }

        </button>

    );

};

export default WishlistButton;