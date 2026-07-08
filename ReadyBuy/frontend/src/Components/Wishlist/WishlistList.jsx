import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import { toast } from "react-toastify";

import WishlistCard from "./WishlistCard";

import {
    getWishlist,
    removeFromWishlist,
} from "../../services/wishlist.service";

const WishlistList = ({
    addToCart,
}) => {

    const queryClient =
        useQueryClient();

    const {

        data = [],

        isLoading,

    } = useQuery({

        queryKey: [

            "wishlist",

        ],

        queryFn: getWishlist,

    });

    const removeMutation =
        useMutation({

            mutationFn:
                removeFromWishlist,

            onSuccess: () => {

                toast.success(
                    "Removed from wishlist."
                );

                queryClient.invalidateQueries({

                    queryKey: [

                        "wishlist",

                    ],

                });

            },

        });

    if (isLoading) {

        return (

            <div className="text-center py-5">

                <Spinner />

            </div>

        );

    }

    if (data.length === 0) {

        return (

            <div className="text-center py-5">

                <img

                    src="/empty-wishlist.svg"

                    alt="Wishlist"

                    width={250}

                />

                <h3 className="mt-4">

                    Your Wishlist is Empty

                </h3>

                <p className="text-muted">

                    Save your favourite products here.

                </p>

            </div>
        );

    }

    return (

        <>

            {

                data.map((item) => (

                    <WishlistCard

                        key={item._id}

                        item={item}

                        onRemove={(id) =>
                            removeMutation.mutate(id)
                        }

                        onMoveToCart={(product) => {

                            addToCart(product);

                            removeMutation.mutate(
                                product._id
                            );

                        }}

                    />

                ))

            }

        </>

    );

};

export default WishlistList;