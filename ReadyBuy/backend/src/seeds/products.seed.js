import "dotenv/config";
import mongoose from "mongoose";
import Product from "../modules/products/product.model.js";

const products = [
    {
        name: "Men Blue Denim Jeans",
        slug: "men-blue-denim-jeans",
        category: "men",
        description: "Premium denim jeans",
        price: {
            original: 3499,
            discounted: 2499,
        },
        stock: 100,
    },
];

const seed = async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("Seeded");
    process.exit(0);
};

seed();