import Category from "./category.model.js";
import Product from "../products/product.model.js";

export const createCategory = (payload) =>
    Category.create(payload);

export const getCategories = async ({
    page = 1,
    limit = 10,
    search = "",
    status,
}) => {

    page = Number(page);
    limit = Number(limit);

    const query = {};

    if (search) {
        query.name = {
            $regex: search,
            $options: "i",
        };
    }

    if (status) {
        query.status = status;
    }

    const skip = (page - 1) * limit;

    const [categories, totalDocs] =
        await Promise.all([
            Category.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Category.countDocuments(query),
        ]);

    const docs = await Promise.all(
        categories.map(async (category) => {

            const productCount =
                await Product.countDocuments({
                    category: category.slug,
                });

            return {
                ...category.toObject(),
                productCount,
            };
        })
    );

    return {
        docs,
        totalDocs,
        page,
        totalPages: Math.ceil(
            totalDocs / limit
        ),
        hasPrevPage: page > 1,
        hasNextPage:
            page * limit < totalDocs,
    };
};

export const getAllCategories = () =>
    Category.find().sort({
        createdAt: -1,
    });

export const getCategoryById = (id) =>
    Category.findById(id);

export const getCategoryBySlug = (slug) =>
    Category.findOne({ slug });

export const updateCategory = (
    id,
    payload
) =>
    Category.findByIdAndUpdate(
        id,
        payload,
        { new: true }
    );

export const deleteCategory = (id) =>
    Category.findByIdAndDelete(id);

export const categoryExists = (name) =>
    Category.findOne({ name });

export const categorySlugExists = (
    slug,
    excludeId
) =>
    Category.findOne({
        slug,
        _id: {
            $ne: excludeId,
        },
    });

export const countProductsByCategory = (
    slug
) =>
    Product.countDocuments({
        category: slug,
    });