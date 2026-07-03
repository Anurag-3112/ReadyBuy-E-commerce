import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(3),

    description: z.string().min(10),

    category: z.enum([
        "men",
        "women",
        "kids",
    ]),

    brand: z.string().optional(),

    price: z.object({
        original: z.number().positive(),
        discounted: z.number().positive(),
    }),

    stock: z.number().nonnegative(),

    images: z.array(
        z.object({
            url: z.string(),
            publicId: z.string().optional(),
        })
    ).optional(),
});