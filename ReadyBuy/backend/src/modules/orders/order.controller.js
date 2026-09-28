import asyncHandler from "../../shared/utils/asyncHandler.js";

import {
    createOrderService,
    getUserOrdersService,
    getOrderByIdService,
    getAdminOrderService,
    getAllOrdersService,
    updateOrderStatusService,
    deleteOrderService,
    getOrderStatsService,
    getRecentOrdersService,
} from "./order.service.js";


/*
 * ============================================================
 * CREATE ORDER
 * ============================================================
 */
export const createOrder =
    asyncHandler(async (
        req,
        res
    ) => {

        const result =
            await createOrderService(
                req.user.userId,
                req.body
            );

        console.log(
            "\n🔥🔥🔥 NEW ORDER CONTROLLER IS RUNNING 🔥🔥🔥"
        );

        console.log(
            "RESULT FROM ORDER SERVICE:",
            JSON.stringify(
                result,
                null,
                2
            )
        );

        console.log(
            "Has order:",
            Boolean(result?.order)
        );

        console.log(
            "Has payment:",
            Boolean(result?.payment)
        );

        console.log(
            "Payment:",
            result?.payment
        );

        console.log(
            "Gateway Order ID:",
            result?.payment?.gatewayOrderId
        );

        console.log(
            "=======================================\n"
        );

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: result,
        });
    });


/*
 * ============================================================
 * GET USER ORDERS
 * ============================================================
 */
export const getOrders =
    asyncHandler(async (
        req,
        res
    ) => {

        const orders =
            await getUserOrdersService(
                req.user.userId
            );


        return res.status(200).json({

            success: true,

            data:
                orders,
        });
    });


/*
 * ============================================================
 * GET ORDER BY ID
 * ============================================================
 */
export const getOrderById =
    asyncHandler(async (
        req,
        res
    ) => {

        const order =
            await getOrderByIdService(
                req.params.id,
                req.user.userId
            );


        return res.status(200).json({

            success: true,

            data:
                order,
        });
    });


/*
 * ============================================================
 * GET ALL ORDERS
 * ============================================================
 */
export const getAllOrders =
    asyncHandler(async (
        req,
        res
    ) => {

        const {
            page = 1,
            limit = 10,
            status,
            search,
        } = req.query;


        const orders =
            await getAllOrdersService({

                page:
                    Number(page),

                limit:
                    Number(limit),

                status,

                search,
            });


        return res.status(200).json({

            success: true,

            data:
                orders,
        });
    });


/*
 * ============================================================
 * UPDATE ORDER STATUS
 * ============================================================
 */
export const updateOrderStatus =
    asyncHandler(async (
        req,
        res
    ) => {

        const {
            status,
        } = req.body;


        const order =
            await updateOrderStatusService(
                req.params.id,
                status
            );


        return res.status(200).json({

            success: true,

            message:
                "Order status updated successfully",

            data:
                order,
        });
    });


/*
 * ============================================================
 * DELETE ORDER
 * ============================================================
 */
export const deleteOrder =
    asyncHandler(async (
        req,
        res
    ) => {

        await deleteOrderService(
            req.params.id
        );


        return res.status(200).json({

            success: true,

            message:
                "Order deleted successfully",
        });
    });


/*
 * ============================================================
 * GET ORDER STATISTICS
 * ============================================================
 */
export const getOrderStats =
    asyncHandler(async (
        req,
        res
    ) => {

        const stats =
            await getOrderStatsService();


        return res.status(200).json({

            success: true,

            data:
                stats,
        });
    });


/*
 * ============================================================
 * GET RECENT ORDERS
 * ============================================================
 */
export const getRecentOrders =
    asyncHandler(async (
        req,
        res
    ) => {

        const orders =
            await getRecentOrdersService();


        return res.status(200).json({

            success: true,

            data:
                orders,
        });
    });

/*
 * ============================================================
 * GET ADMIN ORDER BY ID
 * ============================================================
 */
export const getAdminOrder =
    asyncHandler(async (
        req,
        res
    ) => {

        const order =
            await getAdminOrderService(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: order,
        });
    });