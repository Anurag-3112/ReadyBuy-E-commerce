import User from "../users/user.model.js";
import Product from "../products/product.model.js";
import Order from "../orders/order.model.js";

export const getDashboardStats =
    async () => {

        const [
            users,
            products,
            orders,
            pendingOrders,
            deliveredOrders,
            revenueData,
        ] = await Promise.all([
            User.countDocuments(),

            Product.countDocuments({
                status: "ACTIVE",
            }),

            Order.countDocuments(),

            Order.countDocuments({
                status: "PENDING",
            }),

            Order.countDocuments({
                status: "DELIVERED",
            }),

            Order.aggregate([
                {
                    $match: {
                        status: {
                            $ne: "CANCELLED",
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        revenue: {
                            $sum:
                                "$totalAmount",
                        },
                    },
                },
            ]),
        ]);

        return {
            users,
            products,
            orders,
            pendingOrders,
            deliveredOrders,

            revenue:
                revenueData[0]
                    ?.revenue || 0,
        };
    };

export const getMonthlyRevenue =
    async () => {

        return Order.aggregate([
            {
                $match: {
                    status: {
                        $ne: "CANCELLED",
                    },
                },
            },

            {
                $group: {
                    _id: {
                        year: {
                            $year:
                                "$createdAt",
                        },

                        month: {
                            $month:
                                "$createdAt",
                        },
                    },

                    revenue: {
                        $sum:
                            "$totalAmount",
                    },

                    orders: {
                        $sum: 1,
                    },
                },
            },

            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                },
            },
        ]);
    };