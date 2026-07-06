import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import Breadcrum from "../Components/Breadcrums/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DiscriptionBox from "../Components/DiscriptionBox/DiscriptionBox";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";

import { getProduct } from "../services/product.service";

import "./CSS/Product.css";

const Product = () => {
  const { slug } = useParams();

  const [s_product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const data = await getProduct(slug);

        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <section className="product-loading">

        <div className="loading-spinner"></div>

        <h2>Loading Product...</h2>

      </section>
    );
  }

  if (!s_product) {
    return (
      <section className="product-not-found">

        <h1>Product Not Found</h1>

        <p>
          The product you're looking for doesn't exist
          or has been removed.
        </p>

        <Link
          to="/"
          className="back-home-btn"
        >
          Back to Home
        </Link>

      </section>
    );
  }

  return (
    <main className="product-page">

      <Breadcrum s_product={s_product} />

      <ProductDisplay s_product={s_product} />

      <DiscriptionBox s_product={s_product} />

      <RelatedProducts s_product={s_product} />

    </main>
  );
};

export default Product;