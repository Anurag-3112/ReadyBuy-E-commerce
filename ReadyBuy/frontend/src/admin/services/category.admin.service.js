import api from "../../services/api";

export const getCategories = async (params = {}) => {
    const response = await api.get(
        "/categories/admin",
        {
            params,
        }
    );

    return response.data.data;
};

export const getCategory = async (id) => {
    const response = await api.get(
        `/categories/admin/${id}`
    );

    return response.data.data;
};

export const createCategory = async (data) => {
    const response = await api.post(
        "/categories/admin",
        data
    );

    return response.data.data;
};

export const updateCategory = async (
    id,
    data
) => {
    const response = await api.put(
        `/categories/admin/${id}`,
        data
    );

    return response.data.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(
        `/categories/admin/${id}`
    );

    return response.data.data;
};