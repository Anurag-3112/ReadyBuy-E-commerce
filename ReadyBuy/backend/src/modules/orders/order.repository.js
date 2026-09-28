import Order from "./order.model.js";

const populateOrder = (query) => {
    return query
        .populate(
            "user",
            "name email"
        )
        .populate(
            "items.product"
        );
};

const createOrder = async (orderData) => {
    const order = await Order.create(orderData);

    return populateOrder(
        Order.findById(order._id)
    );
};

const findOrdersByUser = async (
    userId,
    query = {}
) => {
    const {
        page = 1,
        limit = 10,
        status,
    } = query;

    const filter = {
        user: userId,
    };

    if (status) {
        filter.status = status;
    }

    const skip =
        (Number(page) - 1) *
        Number(limit);

    const orders = await populateOrder(
        Order.find(filter)
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(Number(limit))
    );

    const total = await Order.countDocuments(filter);

    return {
        orders,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(
                total / Number(limit)
            ),
        },
    };
};

const findOrderById = async (orderId) => {
    return populateOrder(
        Order.findById(orderId)
    );
};

const findAllOrders = async (query = {}) => {
    const {
        page = 1,
        limit = 10,
        status,
        search,
    } = query;

    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (search) {
        filter.$or = [
            {
                _id: search,
            },
        ];
    }

    const skip =
        (Number(page) - 1) *
        Number(limit);

    const orders = await populateOrder(
        Order.find(filter)
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(Number(limit))
    );

    const total = await Order.countDocuments(filter);

    return {
        orders,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(
                total / Number(limit)
            ),
        },
    };
};

const updateOrderStatus = async (
    orderId,
    status
) => {
    return populateOrder(
        Order.findByIdAndUpdate(
            orderId,
            {
                status,
            },
            {
                new: true,
                runValidators: true,
            }
        )
    );
};

const deleteOrder = async (orderId) => {
    return Order.findByIdAndDelete(orderId);
};

const countOrders = async (filter = {}) => {
    return Order.countDocuments(filter);
};

const getRecentOrders = async (limit = 10) => {
    return populateOrder(
        Order.find({})
            .sort({
                createdAt: -1,
            })
            .limit(Number(limit))
    );
};

const getOrderStats = async () => {
    const stats = await Order.aggregate([
        {
            $group: {
                _id: "$status",
                count: {
                    $sum: 1,
                },
            },
        },
    ]);

    return stats;
};

const confirmPendingOrder = (orderId) =>
    populateOrder(
        Order.findOneAndUpdate(
            {
                _id: orderId,
                status: "PENDING",
            },
            {
                $set: {
                    status: "CONFIRMED",
                },
            },
            {
                new: true,
            }
        )
    );

const claimInventoryPublish = (orderId) =>
    Order.findOneAndUpdate(
        {
            _id: orderId,
            status: "CONFIRMED",
            "fulfillment.inventoryPublished": false,
        },
        {
            $set: {
                "fulfillment.inventoryPublished": true,
                "fulfillment.inventoryPublishedAt":
                    new Date(),
            },
        },
        {
            new: true,
        }
    );

export {
    createOrder,
    findOrdersByUser,
    findOrderById,
    findAllOrders,
    updateOrderStatus,
    deleteOrder,
    countOrders,
    getRecentOrders,
    getOrderStats,
    confirmPendingOrder,
    claimInventoryPublish,
};