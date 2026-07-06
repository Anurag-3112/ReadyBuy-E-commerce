import React, { useState } from "react";
import "./NewCollections.css";

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Item from "../Item/Item";
import { getProducts } from "../../services/product.service";

const NewCollections = () => {
  const [activeImage, setActiveImage] = useState({});

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const products = data?.docs || [];

  const prevImage = (id, images = []) => {
    if (!images.length) return;

    setActiveImage((prev) => ({
      ...prev,
      [id]:
        (prev[id] ?? 0) > 0
          ? prev[id] - 1
          : images.length - 1,
    }));
  };

  const nextImage = (id, images = []) => {
    if (!images.length) return;

    setActiveImage((prev) => ({
      ...prev,
      [id]:
        (prev[id] ?? 0) < images.length - 1
          ? (prev[id] ?? 0) + 1
          : 0,
    }));
  };

  if (isLoading) {
    return (
      <section
        className="new-collections"
        id="collection"
      >
        <div className="collections-header">

          <div>

            <span className="section-tag">
              Just Arrived
            </span>

            <h2>New Collections</h2>

            <p>
              Discover the latest additions to our store.
            </p>

          </div>

        </div>

        <div className="collections-grid">

          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="collection-skeleton"
            />
          ))}

        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="new-collections">

        <div className="empty-state">

          <h3>
            Failed to load products.
          </h3>

          <p>
            Please try again later.
          </p>

        </div>

      </section>
    );
  }

  return (
    <section
      className="new-collections"
      id="collection"
    >

      <div className="collections-header">

        <div>

          <span className="section-tag">
            Just Arrived
          </span>

          <h2>
            New Collections
          </h2>

          <p>
            Explore our newest arrivals crafted for every style.
          </p>

        </div>

        <Link
          to="/"
          className="view-all-btn"
        >
          View All →
        </Link>

      </div>

      <div className="collections-grid">

        {products.map((item) => {
          const productId = item._id;
          const images = item.images || [];
          const index =
            activeImage[productId] ?? 0;

          return (
            <div
              key={productId}
              className="item-wrapper"
            >
              <Item
                id={productId}
                slug={item.slug}
                name={item.name}
                image={
                  images[index]?.url ||
                  images[index] ||
                  "/placeholder.png"
                }
                new_price={
                  item.price?.discounted ?? 0
                }
                old_price={
                  item.price?.original ?? 0
                }
              />

              {images.length > 1 && (
                <>

                  <button
                    className="img-btn left"
                    onClick={() =>
                      prevImage(
                        productId,
                        images
                      )
                    }
                  >
                    ‹
                  </button>

                  <button
                    className="img-btn right"
                    onClick={() =>
                      nextImage(
                        productId,
                        images
                      )
                    }
                  >
                    ›
                  </button>

                </>
              )}

            </div>
          );
        })}

      </div>

    </section>
  );
};

export default NewCollections;