import { Coupon } from "./coupon.model.js";

export const createCouponRepository = async (payload) => {
    return await Coupon.create(payload);
};

export const getCouponByIdRepository = async (id) => {
    return await Coupon.findById(id);
};

export const getCouponByCodeRepository = async (code) => {
    return await Coupon.findOne({
        code: code.toUpperCase(),
    });
};

export const updateCouponRepository = async (id, payload) => {
    return await Coupon.findByIdAndUpdate(
        id,
        payload,
        {
            new: true,
            runValidators: true,
        }
    );
};

export const deleteCouponRepository = async (id) => {
    return await Coupon.findByIdAndDelete(id);
};

export const incrementCouponUsageRepository = async (id) => {
    return await Coupon.findOneAndUpdate(
        {
            _id: id,
            $expr: {
                $lt: [
                    "$usedCount",
                    "$usageLimit",
                ],
            },
        },
        {
            $inc: {
                usedCount: 1,
            },
        },
        {
            new: true,
        }
    );
};

export const getCouponsRepository = async ({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    discountType = "",
}) => {
    const filter = {};

    if (discountType) {
        filter.discountType = discountType;
    }

    if (search) {
        filter.$or = [
            {
                code: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                description: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    if (status) {
        filter.status = status;
    }

    const skip = (page - 1) * limit;

    const docs = await Coupon.find(filter)
        .sort({
            createdAt: -1,
        })
        .skip(skip)
        .limit(limit);

    const totalDocs = await Coupon.countDocuments(filter);

    return {
        docs,
        page,
        limit,
        totalDocs,
        totalPages: Math.ceil(
            totalDocs / limit
        ),
        hasPrevPage: page > 1,
        hasNextPage:
            page <
            Math.ceil(
                totalDocs / limit
            ),
    };
};