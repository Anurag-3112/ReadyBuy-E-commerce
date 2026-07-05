import Joi from "joi";

export const categorySchema = Joi.object({

    name: Joi.string()
        .min(2)
        .max(100)
        .trim()
        .required(),

    description: Joi.string()
        .max(500)
        .allow(""),

    image: Joi.string()
        .uri()
        .allow(""),

    status: Joi.string()
        .valid(
            "ACTIVE",
            "INACTIVE"
        )
        .required(),

});