import { z } from "zod";

export const addWishlistSchema = z.object({

    body: z.object({

        product: z
            .string({
                required_error:
                    "Product is required.",
            })
            .min(1),

    }),

});