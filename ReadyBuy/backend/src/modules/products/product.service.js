import AppError from "../../shared/errors/AppError.js";
import redis from "../../config/redis.js";

import {
    createProduct,
    findProductBySlug,
    getProducts,
    updateProduct,
} from "./product.repository.js";

import {
    getCachedProducts,
    setCachedProducts,
} from "./product.cache.js";

import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";

const invalidateProductCache = async () => {
    if (!redis) return;

    const keys = await redis.keys("products:*");

    if (keys.length) {
        await redis.del(keys);
    }
};

const uploadToCloudinary = (file) => {

    return new Promise((resolve, reject) => {

        const stream =
            cloudinary.uploader.upload_stream(

                {
                    folder: "readybuy/products",
                },

                (error, result) => {

                    if (error)
                        return reject(error);

                    resolve(result);

                }

            );

        streamifier.createReadStream(
            file.buffer
        ).pipe(stream);

    });

};

export const createProductService =
    async (
        productData,
        files = []
    ) => {

        const uploadedImages = [];

        for (const file of files) {

            const result =
                await uploadToCloudinary(file);

            uploadedImages.push({

                url: result.secure_url,

                publicId: result.public_id,

            });

        }

        const product =
            await createProduct({

                ...productData,

                images: uploadedImages,

            });

        return product;

    };

export const getProductsService = async (query) => {
    const cacheKey = `products:${JSON.stringify(query)}`;

    const cached = await getCachedProducts(cacheKey);

    if (cached) {
        return cached;
    }

    const products = await getProducts(query);

    await setCachedProducts(cacheKey, products);

    return products;
};

export const getProductBySlugService = async (slug) => {
    const product = await findProductBySlug(slug);

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    return product;
};

export const updateProductService = async (id, payload) => {
    const product = await updateProduct(id, payload);

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    await invalidateProductCache();

    return product;
};

export const deleteProductService = async (id) => {
    const product =
        await findProductById(id);

    for (const image of product.images) {

        await cloudinary.uploader.destroy(
            image.publicId
        );

    }

    await deleteProduct(id);

    return product;
};

