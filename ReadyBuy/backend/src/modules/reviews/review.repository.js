import { Review } from "./review.model.js";

/*
|--------------------------------------------------------------------------
| Create Review
|--------------------------------------------------------------------------
*/

export const createReviewRepository = async (payload) => {
    return await Review.create(payload);
};

/*
|--------------------------------------------------------------------------
| Get Review By ID
|--------------------------------------------------------------------------
*/

export const getReviewByIdRepository = async (id) => {
    return await Review.findById(id)
        .populate("user", "name email")
        .populate("product", "name slug");
};

/*
|--------------------------------------------------------------------------
| Get Review By User & Product
|--------------------------------------------------------------------------
*/

export const getReviewByUserAndProductRepository = async (
    userId,
    productId
) => {
    return await Review.findOne({
        user: userId,
        product: productId,
    });
};

/*
|--------------------------------------------------------------------------
| Get Reviews By Product
|--------------------------------------------------------------------------
*/

export const getReviewsByProductRepository = async ({
    product,
    page = 1,
    limit = 10,
}) => {

    const filter = {
        product,
        status: "ACTIVE",
    };

    const skip = (page - 1) * limit;

    const docs = await Review.find(filter)
        .populate("user", "name")
        .sort({
            createdAt: -1,
        })
        .skip(skip)
        .limit(limit);

    const totalDocs =
        await Review.countDocuments(filter);

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

/*
|--------------------------------------------------------------------------
| Get Reviews By User
|--------------------------------------------------------------------------
*/

export const getReviewsByUserRepository = async (
    userId
) => {

    return await Review.find({
        user: userId,
    })
        .populate("product", "name slug images")
        .sort({
            createdAt: -1,
        });

};

/*
|--------------------------------------------------------------------------
| Update Review
|--------------------------------------------------------------------------
*/

export const updateReviewRepository = async (
    id,
    payload
) => {

    return await Review.findByIdAndUpdate(
        id,
        payload,
        {
            new: true,
            runValidators: true,
        }
    )
        .populate("user", "name")
        .populate("product", "name slug");

};

/*
|--------------------------------------------------------------------------
| Delete Review
|--------------------------------------------------------------------------
*/

export const deleteReviewRepository = async (
    id
) => {

    return await Review.findByIdAndDelete(id);

};

/*
|--------------------------------------------------------------------------
| Product Review Stats
|--------------------------------------------------------------------------
*/

export const getProductReviewStatsRepository =
    async (productId) => {

        const stats =
            await Review.aggregate([
                {
                    $match: {
                        product: productId,
                        status: "ACTIVE",
                    },
                },
                {
                    $group: {
                        _id: "$product",
                        averageRating: {
                            $avg: "$rating",
                        },
                        reviewCount: {
                            $sum: 1,
                        },
                    },
                },
            ]);

        return (
            stats[0] || {
                averageRating: 0,
                reviewCount: 0,
            }
        );

    };

/*
|--------------------------------------------------------------------------
| Rating Distribution
|--------------------------------------------------------------------------
*/

export const getRatingDistributionRepository =
    async (productId) => {

        return await Review.aggregate([
            {
                $match: {
                    product: productId,
                    status: "ACTIVE",
                },
            },
            {
                $group: {
                    _id: "$rating",
                    count: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    _id: -1,
                },
            },
        ]);

    };