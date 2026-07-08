import asyncHandler from "../../shared/utils/asyncHandler.js";
import redis from "../../config/redis.js";

import {
    createProductService,
    getProductsService,
    getProductBySlugService,
    updateProductService,
    deleteProductService,
} from "./product.service.js";

export const createProduct = asyncHandler(
    async (req, res) => {
        const product =
            await createProductService(
                req.body,
                req.files
            );

        return res.status(201).json({
            success: true,
            message: "Product created",
            data: product,
        });
    }
);

export const getProducts = asyncHandler(
    async (req, res) => {
        const result =
            await getProductsService(
                req.query
            );

        return res.status(200).json({
            success: true,
            message:
                "Products fetched successfully",
            data: result,
        });
    }
);

export const getProductBySlug =
    asyncHandler(async (req, res) => {
        const product =
            await getProductBySlugService(
                req.params.slug
            );

        return res.status(200).json({
            success: true,
            message: "Product fetched",
            data: product,
        });
    });

export const updateProduct =
    asyncHandler(async (req, res) => {
        const product =
            await updateProductService(
                req.params.id,
                req.body
            );

        return res.status(200).json({
            success: true,
            message:
                "Product updated successfully",
            data: product,
        });
    });

export const deleteProduct =
    asyncHandler(async (req, res) => {
        await deleteProductService(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Product deleted successfully",
        });
    }); 