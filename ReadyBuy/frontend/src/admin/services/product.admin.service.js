import api from "../../services/api";

export const getProducts = async ({
    page = 1,
    search = "",
}) => {

    const response = await api.get(
        "/products",
        {
            params: {
                page,
                limit: 10,
                search,
            },
        }
    );

    return response.data.data;

};

export const deleteProduct = async (
    id
) => {

    const response = await api.delete(
        `/products/${id}`
    );

    return response.data.data;

};

export const createProduct = async (
    formData
) => {

    const response = await api.post(
        "/products",
        formData
    );

    return response.data.data;

};

export const updateProduct = async (
    id,
    formData
) => {

    const response = await api.patch(
        `/products/${id}`,
        formData
    );

    return response.data.data;

};