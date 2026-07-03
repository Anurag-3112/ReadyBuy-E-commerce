import Joi from "joi";

export const categorySchema =
    Joi.object({

        name:
            Joi.string()

                .trim()

                .required(),

        description:
            Joi.string()

                .allow(""),

        image:
            Joi.string()

                .allow(""),

        status:
            Joi.string()

                .valid(
                    "ACTIVE",
                    "INACTIVE"
                )

    });