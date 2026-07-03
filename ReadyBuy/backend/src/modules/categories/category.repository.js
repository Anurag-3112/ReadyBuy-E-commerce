import Category from "./category.model.js";

export const createCategory = (payload) =>
    Category.create(payload);

export const getCategories = (
    filter = {}
) =>
    Category.find(filter).sort({
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
        {
            new: true,
        }
    );

export const deleteCategory = (id) =>
    Category.findByIdAndDelete(id);

export const categoryExists = (
    name
) =>
    Category.findOne({ name });