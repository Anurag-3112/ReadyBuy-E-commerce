import {
    findUsers,
    findUserById,
    updateUserRole,
    updateUserStatus,
    deleteUser,
} from "./user.repository.js";

import { toUserResponse } from "./user.mapper.js";
import AppError from "../../shared/errors/AppError.js";

export const getUsersService = async (query) => {

    const result = await findUsers(query);

    return {

        ...result,

        docs: result.docs.map(toUserResponse),

    };

};

export const getUserService = async (id) => {

    if (!id) {

        throw new AppError(
            400,
            "User id is required"
        );

    }

    const user =
        await findUserById(id);

    if (!user) {

        throw new AppError(
            404,
            "User not found"
        );

    }

    return toUserResponse(user);

};

export const updateRoleService = async (
    id,
    role
) => {

    if (!id) {

        throw new AppError(
            400,
            "User id is required"
        );

    }

    if (!role) {

        throw new AppError(
            400,
            "Role is required"
        );

    }

    const allowedRoles = [
        "USER",
        "ADMIN",
    ];

    if (
        !allowedRoles.includes(role)
    ) {

        throw new AppError(
            400,
            "Invalid role"
        );

    }

    const user =
        await updateUserRole(
            id,
            role
        );

    if (!user) {

        throw new AppError(
            404,
            "User not found"
        );

    }

    return toUserResponse(user);

};

export const updateStatusService = async (
    id,
    status
) => {

    if (!id) {

        throw new AppError(
            400,
            "User id is required"
        );

    }

    if (!status) {

        throw new AppError(
            400,
            "Status is required"
        );

    }

    const allowedStatus = [
        "ACTIVE",
        "INACTIVE",
        "BLOCKED",
    ];

    if (
        !allowedStatus.includes(
            status
        )
    ) {

        throw new AppError(
            400,
            "Invalid status"
        );

    }

    const user =
        await updateUserStatus(
            id,
            status
        );

    if (!user) {

        throw new AppError(
            404,
            "User not found"
        );

    }

    return toUserResponse(user);

};

export const deleteUserService = async (
    id
) => {

    if (!id) {

        throw new AppError(
            400,
            "User id is required"
        );

    }

    const user =
        await deleteUser(id);

    if (!user) {

        throw new AppError(
            404,
            "User not found"
        );

    }

    return toUserResponse(user);

};