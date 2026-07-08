import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Create Review
|--------------------------------------------------------------------------
*/

export const createReviewSchema = z.object({

    body: z.object({

        product: z
            .string({
                required_error: "Product is required.",
            })
            .min(1),

        rating: z
            .number({
                required_error: "Rating is required.",
            })
            .min(1, "Minimum rating is 1.")
            .max(5, "Maximum rating is 5."),

        title: z
            .string()
            .trim()
            .max(
                100,
                "Title cannot exceed 100 characters."
            )
            .optional()
            .default(""),

        comment: z
            .string({
                required_error: "Review comment is required.",
            })
            .trim()
            .min(
                10,
                "Review must be at least 10 characters."
            )
            .max(
                1000,
                "Review cannot exceed 1000 characters."
            ),

        images: z
            .array(z.string().url())
            .optional()
            .default([]),

    }),

});

/*
|--------------------------------------------------------------------------
| Update Review
|--------------------------------------------------------------------------
*/

export const updateReviewSchema = z.object({

    body: z.object({

        rating: z
            .number()
            .min(1)
            .max(5)
            .optional(),

        title: z
            .string()
            .trim()
            .max(100)
            .optional(),

        comment: z
            .string()
            .trim()
            .min(10)
            .max(1000)
            .optional(),

        images: z
            .array(z.string().url())
            .optional(),

        status: z
            .enum([
                "ACTIVE",
                "HIDDEN",
                "REPORTED",
            ])
            .optional(),

    }),

});