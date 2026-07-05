import Order from "./order.model.js";

const populateOrder = (query) =>
    query
        .populate(
            "user",
            "name email"
        )
        .populate(
            "items.product"
        );

/*
|--------------------------------------------------------------------------
| Customer
|--------------------------------------------------------------------------
*/

export const createOrder = (payload) =>
    Order.create(payload);

export const findOrdersByUser = (userId) =>
    populateOrder(
        Order.find({
            user: userId,
        }).sort({
            createdAt: -1,
        })
    );

export const findOrderById = (orderId) =>
    populateOrder(
        Order.findById(orderId)
    );

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

export const findAllOrders = async ({
    page = 1,
    limit = 10,
    status,
    search,
}) => {
    const query = {};

    if (status) {
        query.status = status;
    }

    let orders = populateOrder(
        Order.find(query).sort({
            createdAt: -1,
        })
    );

    if (search) {
        orders = orders.populate({
            path: "user",
            match: {
                name: {
                    $regex: search,
                    $options: "i",
                },
            },
        });
    }

    const total =
        await Order.countDocuments(query);

    const docs =
        await orders
            .skip((page - 1) * limit)
            .limit(limit);

    return {
        docs,
        total,
        page,
        totalPages:
            Math.ceil(total / limit),
        hasNextPage:
            page <
            Math.ceil(total / limit),
        hasPrevPage:
            page > 1,
    };
};

export const updateOrderStatus = (
    orderId,
    status
) =>
    populateOrder(
        Order.findByIdAndUpdate(
            orderId,
            {
                status,
            },
            {
                new: true,
            }
        )
    );

export const deleteOrder = (
    orderId
) =>
    Order.findByIdAndDelete(
        orderId
    );

export const countOrders =
    () =>
        Order.countDocuments();

export const countOrdersByStatus =
    (status) =>
        Order.countDocuments({
            status,
        });

export const recentOrders =
    (limit = 5) =>
        populateOrder(
            Order.find()
                .sort({
                    createdAt: -1,
                })
                .limit(limit)
        );