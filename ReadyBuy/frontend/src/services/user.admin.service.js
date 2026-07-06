import api from "../../services/api";

export const getUsers = async (params = {}) => {
    const res = await api.get("/admin/users", {
        params,
    });

    return res.data.data;
};

export const getUser = async (id) => {
    const res = await api.get(
        `/admin/users/${id}`
    );

    return res.data.data;
};

export const updateUserRole = async (
    id,
    role
) => {
    const res = await api.patch(
        `/admin/users/${id}/role`,
        { role }
    );

    return res.data.data;
};

export const updateUserStatus = async (
    id,
    status
) => {
    const res = await api.patch(
        `/admin/users/${id}/status`,
        { status }
    );

    return res.data.data;
};

export const deleteUser = async (
    id
) => {
    const res = await api.delete(
        `/admin/users/${id}`
    );

    return res.data.data;
};