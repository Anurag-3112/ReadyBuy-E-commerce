import Product from "./product.model.js";

export const createProduct = (data) =>
    Product.create(data);

export const findProductById = (id) =>
    Product.findById(id);

export const findProductBySlug =
    (slug) =>
        Product.findOne({
            slug,
            status: "ACTIVE",
        });


export const updateProduct = (
    id,
    payload
) =>
    Product.findByIdAndUpdate(
        id,
        payload,
        {
            new: true,
            runValidators: true,
        }
    );

export const deleteProduct = (id) =>
    Product.findByIdAndDelete(id);

export const getProducts = async ({
    page = 1,
    limit = 10,
    search,
    category,
    sort,
}) => {
    const query = {
        status: "ACTIVE",
    };

    if (category) {
        query.category = category;
    }

    if (search) {
        query.$text = {
            $search: search,
        };
    }

    let sortOption = {
        "rating.average": -1
    };

    switch (sort) {
        case "price_asc":
            sortOption = {
                "price.discounted": 1,
            };
            break;

        case "price_desc":
            sortOption = {
                "price.discounted": -1,
            };
            break;

        case "rating":
            sortOption = {
                rating: -1,
            };
            break;

        default:
            sortOption = {
                createdAt: -1,
            };
    }

    return Product.paginate(query, {
        page,
        limit,
        sort: sortOption,
    });
};

export const decrementStock =
    (productId, quantity) =>
        Product.findOneAndUpdate(
            {
                _id: productId,
                stock: {
                    $gte: quantity,
                },
            },
            {
                $inc: {
                    stock: -quantity,
                },
            },
            {
                new: true,
            }
        );