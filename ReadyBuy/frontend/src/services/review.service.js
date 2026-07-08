import api from "./api";

/*
|--------------------------------------------------------------------------
| Create Review
|--------------------------------------------------------------------------
*/

export const createReview = async (payload) => {

    const { data } = await api.post(
        "/reviews",
        payload
    );

    return data.data;

};

/*
|--------------------------------------------------------------------------
| Product Reviews
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Rating Summary
|--------------------------------------------------------------------------
*/

export const getRatingSummary = async (
    productId
) => {

    const { data } = await api.get(
        `/reviews/product/${productId}/summary`
    );

    return data.data;

};

/*
|--------------------------------------------------------------------------
| My Reviews
|--------------------------------------------------------------------------
*/

export const getMyReviews = async () => {

    const { data } = await api.get(
        "/reviews/my/reviews"
    );

    return data.data;

};

/*
|--------------------------------------------------------------------------
| Update Review
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Delete Review
|--------------------------------------------------------------------------
*/

export const deleteReview = async (
    reviewId
) => {

    const { data } = await api.delete(
        `/reviews/${reviewId}`
    );

    return data.data;

};