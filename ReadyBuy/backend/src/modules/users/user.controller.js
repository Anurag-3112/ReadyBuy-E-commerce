import {
    getUsersService,
    getUserService,
    updateRoleService,
    updateStatusService,
    deleteUserService,
} from "./user.service.js";

export const getUsers = async (
    req,
    res,
    next
) => {

    try {

        const users =
            await getUsersService(
                req.query
            );

        res.status(200).json({

            success: true,

            data: users,

        });

    } catch (error) {

        next(error);

    }

};

export const getUser = async (
    req,
    res,
    next
) => {

    try {

        const user =
            await getUserService(
                req.params.id
            );

        res.status(200).json({

            success: true,

            data: user,

        });

    } catch (error) {

        next(error);

    }

};

export const updateRole = async (
    req,
    res,
    next
) => {

    try {

        const user =
            await updateRoleService(

                req.params.id,

                req.body.role

            );

        res.status(200).json({

            success: true,

            message:
                "Role updated successfully.",

            data: user,

        });

    } catch (error) {

        next(error);

    }

};

export const updateStatus = async (
    req,
    res,
    next
) => {

    try {

        const user =
            await updateStatusService(

                req.params.id,

                req.body.status

            );

        res.status(200).json({

            success: true,

            message:
                "Status updated successfully.",

            data: user,

        });

    } catch (error) {

        next(error);

    }

};

export const deleteUser = async (
    req,
    res,
    next
) => {

    try {

        const user =
            await deleteUserService(
                req.params.id
            );

        res.status(200).json({

            success: true,

            message:
                "User deleted successfully.",

            data: user,

        });

    } catch (error) {

        next(error);

    }

};