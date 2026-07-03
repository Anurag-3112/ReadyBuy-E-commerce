import Product from "../products/product.model.js";
import Order from "../orders/order.model.js";
import User from "../users/user.model.js";
import Category from "../categories/category.model.js";

export const getDashboardCounts = async () => {

    const [
        products,
        orders,
        users,
        categories,
    ] = await Promise.all([

        Product.countDocuments(),

        Order.countDocuments(),

        User.countDocuments(),

        Category.countDocuments(),

    ]);

    return {

        products,

        orders,

        users,

        categories,

    };

};

export const getRevenue = async () => {

    const result = await Order.aggregate([

        {
            $match: {
                status: {
                    $in: [
                        "PAID",
                        "SHIPPED",
                        "DELIVERED",
                    ],
                },
            },
        },

        {
            $group: {

                _id: null,

                revenue: {
                    $sum: "$totalAmount",
                },

            },
        },

    ]);

    return result[0]?.revenue || 0;

};

export const getPendingOrders = () =>
    Order.countDocuments({
        status: "PENDING",
    });

export const getLowStockProducts = () =>
    Product.find({
        stock: {
            $lt: 10,
        },
    })
        .sort({
            stock: 1,
        })
        .limit(5);

export const getRecentOrders = () =>
    Order.find()
        .populate("user", "name email")
        .sort({
            createdAt: -1,
        })
        .limit(5);

export const getRecentUsers = () =>
    User.find()
        .sort({
            createdAt: -1,
        })
        .limit(5);