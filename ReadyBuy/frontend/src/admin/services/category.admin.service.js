import api from "../../services/api";

export const getCategories = async (
    params = {}
) => {

    const res = await api.get(
        "/categories/admin",
        {
            params,
        }
    );

    return res.data.data;

};

export const getCategory = async (
    id
) => {

    const res = await api.get(
        `/categories/admin/${id}`
    );

    return res.data.data;

};

export const createCategory = async (
    payload
) => {

    const res = await api.post(

        "/categories/admin",

        payload,

        {

            headers: {

                "Content-Type":

                    "multipart/form-data",

            },

        }

    );

    return res.data.data;

};

export const updateCategory = async (
    id,
    payload
) => {

    const res = await api.put(

        `/categories/admin/${id}`,

        payload,

        {

            headers: {

                "Content-Type":

                    "multipart/form-data",

            },

        }

    );

    return res.data.data;

};

export const deleteCategory = async (
    id
) => {

    const res = await api.delete(

        `/categories/admin/${id}`

    );

    return res.data.data;

};