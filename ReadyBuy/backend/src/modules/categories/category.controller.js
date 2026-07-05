import asyncHandler from "../../shared/utils/asyncHandler.js";

import {
    createCategoryService,
    getCategoriesService,
    getAllCategoriesService,
    getCategoryService,
    getCategoryBySlugService,
    updateCategoryService,
    deleteCategoryService,
} from "./category.service.js";

export const createCategory =
    asyncHandler(async (req, res) => {

        const category =
            await createCategoryService(
                req.body
            );

        return res.status(201).json({

            success: true,

            message:
                "Category created successfully",

            data: category,

        });

    });

export const getAllCategories =
    asyncHandler(async (req, res) => {

        const categories =
            await getAllCategoriesService();

        return res.status(200).json({

            success: true,

            data: categories,

        });

    });

export const getCategory =
    asyncHandler(async (req, res) => {

        const category =
            await getCategoryService(
                req.params.id
            );

        return res.status(200).json({

            success: true,

            data: category,

        });

    });

export const getCategories =
    asyncHandler(async (req, res) => {

        const categories =
            await getCategoriesService(
                req.query
            );

        return res.status(200).json({

            success: true,

            data: categories,

        });

    });

export const updateCategory =
    asyncHandler(async (req, res) => {

        const category =
            await updateCategoryService(

                req.params.id,

                req.body

            );

        return res.status(200).json({

            success: true,

            message:
                "Category updated successfully",

            data: category,

        });

    });

export const deleteCategory =
    asyncHandler(async (req, res) => {

        await deleteCategoryService(
            req.params.id
        );

        return res.status(200).json({

            success: true,

            message:
                "Category deleted successfully",

        });

    });

export const getCategoryBySlug =
    asyncHandler(async (req, res) => {

        const category =
            await getCategoryBySlugService(

                req.params.slug

            );

        return res.json({

            success: true,

            data: category,

        });

    });