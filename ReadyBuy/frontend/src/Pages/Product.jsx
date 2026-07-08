import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import Breadcrum from "../Components/Breadcrums/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DiscriptionBox from "../Components/DiscriptionBox/DiscriptionBox";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";

import ReviewList from "../Components/Reviews/ReviewList";

import { AuthContext } from "../Context/AuthContext";

import { getProduct } from "../services/product.service";

import "./CSS/Product.css";

const Product = () => {

  const { slug } = useParams();

  const { user } =
    useContext(AuthContext);

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  useEffect(() => {

    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

    const fetchProduct =
      async () => {

        try {

          setLoading(true);

          setError(null);

          const data =
            await getProduct(slug);

          setProduct(data);

        } catch (err) {

          console.error(err);

          setError(
            "Failed to load product."
          );

          setProduct(null);

        } finally {

          setLoading(false);

        }

      };

    fetchProduct();

  }, [slug]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <section className="product-loading">

        <div className="loading-spinner"></div>

        <h2>

          Loading Product...

        </h2>

      </section>

    );

  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {

    return (

      <section className="product-not-found">

        <h2>

          {error}

        </h2>

        <Link

          to="/"

          className="back-home-btn"

        >

          Back to Home

        </Link>

      </section>

    );

  }

  /*
  |--------------------------------------------------------------------------
  | Product Not Found
  |--------------------------------------------------------------------------
  */

  if (!product) {

    return (

      <section className="product-not-found">

        <h1>

          Product Not Found

        </h1>

        <p>

          The product you're looking for
          doesn't exist or has been removed.

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

      <Breadcrum
        s_product={product}
      />

      <ProductDisplay
        s_product={product}
      />

      <DiscriptionBox
        s_product={product}
      />

      {/* ===========================
                Reviews
            =========================== */}

      <section className="product-reviews container my-5">

        <ReviewList

          productId={product._id}

          currentUser={user}

        />

      </section>

      {/* ===========================
                Related Products
            =========================== */}

      <RelatedProducts
        s_product={product}
      />

    </main>

  );

};

export default Product;