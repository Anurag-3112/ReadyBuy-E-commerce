import api from "./api";

export const createReview = async (payload) => {
    const { data } = await api.post("/reviews", payload);
    return data.data;
};

export const getProductReviews = async (
    productId,
    page = 1,
    limit = 10
) => {
    const { data } = await api.get(
        `/reviews/product/${productId}`,
        {
            params: {
                page,
                limit,
            },
        }
    );
    return data.data;
};

export const getRatingSummary = async (productId) => {
    const { data } = await api.get(
        `/reviews/product/${productId}/summary`
    );
    return data.data;
};

export const getMyReviews = async () => {
    const { data } = await api.get(
        "/reviews/my/reviews"
    );
    return data.data;
};

export const updateReview = async (
    reviewId,
    payload
) => {
    const { data } = await api.patch(
        `/reviews/${reviewId}`,
        payload
    );
    return data.data;
};

export const deleteReview = async (reviewId) => {
    const { data } = await api.delete(
        `/reviews/${reviewId}`
    );
    return data.data;
};