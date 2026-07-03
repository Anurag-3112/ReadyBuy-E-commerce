import Category from "./category.model.js";

export const createCategoryService = (payload) =>
    Category.create(payload);

export const getCategoriesService = (filter = {}) =>
    Category.find(filter).sort({
        createdAt: -1,
    });

export const getAllCategoriesService = () =>
    Category.find().sort({
        createdAt: -1,
    });

export const getCategoryService = (id) =>
    Category.findById(id);

export const getCategoryBySlugService = (slug) =>
    Category.findOne({ slug });

export const updateCategoryService = (
    id,
    payload
) =>
    Category.findByIdAndUpdate(id, payload, {
        new: true,
    });

export const deleteCategoryService = (id) =>
    Category.findByIdAndDelete(id);

export const categoryExists = (name) =>
    Category.findOne({ name });