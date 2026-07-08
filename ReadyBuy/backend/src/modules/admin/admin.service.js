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

export const getRecentOrdersService = async () => {

    return await Order.find()

        .populate("user", "name email")

        .sort({
            createdAt: -1,
        })

        .limit(5);

};

export const getLowStockProductsService = async () => {

    return await Product.find({
        stock: {
            $lte: 10,
        },
    })

        .sort({
            stock: 1,
        })

        .limit(10);

};

export const getTopProductsService = async () => {

    return await Order.aggregate([

        {
            $unwind: "$items",
        },

        {
            $group: {

                _id: "$items.product",

                totalSold: {
                    $sum: "$items.quantity",
                },

            },

        },

        {
            $sort: {
                totalSold: -1,
            },
        },

        {
            $limit: 5,
        },

        {
            $lookup: {

                from: "products",

                localField: "_id",

                foreignField: "_id",

                as: "product",

            },

        },

        {
            $unwind: "$product",
        },

        {
            $project: {

                _id: "$product._id",

                name: "$product.name",

                totalSold: 1,

            },

        },

    ]);

};

export const getTopCategoriesService = async () => {

    return await Order.aggregate([

        {
            $unwind: "$items",
        },

        {
            $lookup: {

                from: "products",

                localField: "items.product",

                foreignField: "_id",

                as: "product",

            },

        },

        {
            $unwind: "$product",
        },

        {
            $group: {

                _id: "$product.category",

                totalOrders: {
                    $sum: "$items.quantity",
                },

            },

        },

        {
            $sort: {
                totalOrders: -1,
            },
        },

        {
            $limit: 5,
        },

    ]);

};