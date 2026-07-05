import api from "../../services/api";

/**
 * Get all users (Admin)
 */
export const getUsers = async (params = {}) => {
    const res = await api.get("/admin/users", {
        params,
    });

    return res.data.data;
};

/**
 * Get single user
 */
export const getUser = async (id) => {
    const res = await api.get(`/admin/users/${id}`);

    return res.data.data;
};

/**
 * Update user role
 */
export const updateUserRole = async (id, role) => {
    const res = await api.patch(
        `/admin/users/${id}/role`,
        {
            role,
        }
    );

    return res.data.data;
};

/**
 * Update user status (ACTIVE / BLOCKED)
 */
export const updateUserStatus = async (
    id,
    status
) => {
    const res = await api.patch(
        `/admin/users/${id}/status`,
        {
            status,
        }
    );

    return res.data.data;
};

/**
 * Delete user (or soft delete if backend supports it)
 */
export const deleteUser = async (id) => {
    const res = await api.delete(
        `/admin/users/${id}`
    );

    return res.data.data;
};