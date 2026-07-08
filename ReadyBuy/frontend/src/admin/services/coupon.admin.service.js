import api from "../../services/api";

/**
 * Get Coupons
 */
export const getCoupons = async ({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    discountType = "",
}) => {

    const { data } = await api.get(
        "/coupons",
        {
            params: {

                page,

                limit,

                search,

                status,

                discountType,

            },
        }
    );

    return data.data;
};

/**
 * Get Coupon
 */
export const getCoupon = async (
    id
) => {

    const { data } =
        await api.get(
            `/coupons/${id}`
        );

    return data.data;
};

/**
 * Create Coupon
 */
export const createCoupon = async (
    payload
) => {

    const { data } =
        await api.post(
            "/coupons",
            payload
        );

    return data.data;
};

/**
 * Update Coupon
 */
export const updateCoupon = async (
    id,
    payload
) => {

    const { data } =
        await api.patch(
            `/coupons/${id}`,
            payload
        );

    return data.data;
};

/**
 * Delete Coupon
 */
export const deleteCoupon = async (
    id
) => {

    const { data } =
        await api.delete(
            `/coupons/${id}`
        );

    return data.data;
};

/**
 * Apply Coupon
 */
export const applyCoupon = async ({
    code,
    orderTotal,
}) => {

    const { data } =
        await api.post(
            "/coupons/apply",
            {
                code,
                orderTotal,
            }
        );

    return data.data;
};