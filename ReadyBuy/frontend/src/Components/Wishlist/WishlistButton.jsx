import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AuthContext } from "../../Context/AuthContext";
import {
    getWishlist,
    toggleWishlist,
} from "../../services/wishlist.service";
import { useContext } from "react";

const WishlistButton = ({
    productId,
}) => {
    const { isAuthenticated } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const { data: wishlist = [] } = useQuery({
        queryKey: ["wishlist"],
        queryFn: getWishlist,
        enabled: isAuthenticated,
    });
    const isWishlisted = wishlist.some(
        (item) => item.product?._id === productId
    );

    const mutation = useMutation({
        mutationFn: () => toggleWishlist(productId),
        onSuccess: (result) => {
            toast.success(
                result.wishlisted
                    ? "Added to wishlist."
                    : "Removed from wishlist."
            );
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
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
        >
            {isWishlisted ? (
                <FaHeart color="red" size={20} />
            ) : (
                <FaRegHeart size={20} />
            )}
        </button>
    );
};

export default WishlistButton;