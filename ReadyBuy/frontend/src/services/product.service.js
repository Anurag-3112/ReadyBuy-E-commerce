import api from "./api";

export const getProducts = async ({
    page = 1,
    limit = 10,
    search = "",
    category = "",
    sort = "",
} = {}) => {

    const response = await api.get("/products", {
        params: {
            page,
            limit,
            search,
            category,
            sort,
        },
    });

    return response.data.data;
};

export const getProduct = async (slug) => {

    const response = await api.get(`/products/${slug}`);

    return response.data.data;
};