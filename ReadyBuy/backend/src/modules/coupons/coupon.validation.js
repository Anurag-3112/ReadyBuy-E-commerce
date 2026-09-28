import { z } from "zod";

export const createCouponSchema = z.object({
    code: z
        .string()
        .trim()
        .min(3, "Coupon code must be at least 3 characters.")
        .max(20, "Coupon code cannot exceed 20 characters.")
        .transform((value) => value.toUpperCase()),
    description: z
        .string()
        .trim()
        .optional()
        .default(""),
    discountType: z.enum([
        "PERCENTAGE",
        "FIXED",
    ]),
    discountValue: z.coerce
        .number({
            required_error: "Discount value is required.",
        })
        .positive(),
    minimumOrderAmount: z.coerce
        .number()
        .min(0)
        .default(0),
    maximumDiscount: z.coerce
        .number()
        .min(0)
        .default(0),
    usageLimit: z.coerce
        .number()
        .int()
        .positive(),
    expiryDate: z.coerce.date(),
    status: z
        .enum([
            "ACTIVE",
            "INACTIVE",
            "EXPIRED",
        ])
        .default("ACTIVE"),
}).superRefine((data, ctx) => {
    if (
        data.discountType === "PERCENTAGE" &&
        data.discountValue > 100
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["discountValue"],
            message: "Percentage discount cannot exceed 100%.",
        });
    }

    if (data.expiryDate <= new Date()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["expiryDate"],
            message: "Expiry date must be in the future.",
        });
    }
});

export const updateCouponSchema = z.object({
    code: z
        .string()
        .trim()
        .min(3)
        .max(20)
        .transform((value) => value.toUpperCase())
        .optional(),
    description: z
        .string()
        .optional(),
    discountType: z
        .enum([
            "PERCENTAGE",
            "FIXED",
        ])
        .optional(),
    discountValue: z.coerce
        .number()
        .positive()
        .optional(),
    minimumOrderAmount: z.coerce
        .number()
        .min(0)
        .optional(),
    maximumDiscount: z.coerce
        .number()
        .min(0)
        .optional(),
    usageLimit: z.coerce
        .number()
        .int()
        .positive()
        .optional(),
    expiryDate: z
        .coerce
        .date()
        .optional(),
    status: z
        .enum([
            "ACTIVE",
            "INACTIVE",
            "EXPIRED",
        ])
        .optional(),
});