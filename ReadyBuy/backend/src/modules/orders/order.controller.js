import asyncHandler from "../../shared/utils/asyncHandler.js";

import {
    createOrderService,
    getOrdersService,
    getOrderByIdService,

    getAllOrdersService,
    getAdminOrderService,
    updateOrderStatusService,
    deleteOrderService,
    getOrderStatsService,
    getRecentOrdersService,
} from "./order.service.js";

export const createOrder =
    asyncHandler(async (
        req,
        res
    ) => {

        const order =
            await createOrderService(
                req.user.userId,
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Order created successfully",
            data: order,
        });
    });

export const getOrders =
    asyncHandler(async (
        req,
        res
    ) => {

        const orders =
            await getOrdersService(
                req.user.userId
            );

        return res.status(200).json({
            success: true,
            data: orders,
        });
    });

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
            data: order,
        });
    });

export const getAllOrders =
    asyncHandler(async (req, res) => {

        const {
            page = 1,
            limit = 10,
            status,
            search,
        } = req.query;

        const orders =
            await getAllOrdersService({
                page: Number(page),
                limit: Number(limit),
                status,
                search,
            });

        return res.status(200).json({
            success: true,
            data: orders,
        });

    });

export const getAdminOrder =
    asyncHandler(async (req, res) => {

        const order =
            await getAdminOrderService(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: order,
        });

    });

export const updateOrderStatus =
    asyncHandler(async (req, res) => {

        const { status } = req.body;

        const order =
            await updateOrderStatusService(
                req.params.id,
                status
            );

        return res.status(200).json({
            success: true,
            message:
                "Order status updated successfully",
            data: order,
        });

    });

export const deleteOrder =
    asyncHandler(async (req, res) => {

        await deleteOrderService(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Order deleted successfully",
        });

    });

export const getOrderStats =
    asyncHandler(async (req, res) => {

        const stats =
            await getOrderStatsService();

        return res.status(200).json({
            success: true,
            data: stats,
        });

    });

export const getRecentOrders =
    asyncHandler(async (req, res) => {

        const orders =
            await getRecentOrdersService();

        return res.status(200).json({
            success: true,
            data: orders,
        });

    });

