import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import "./CSS/ShopCateogory.css";

import { ShopContext } from "../Context/ShopContext";
import Item from "../Components/Item/Item";

const ShopCateogory = ({ banner, category }) => {

  const { products = [] } = useContext(ShopContext);

  const [sortBy, setSortBy] = useState("default");

  const [activeImage, setActiveImage] = useState({});

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [category]);

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

  const filteredProducts = useMemo(() => {

    const list = products.filter(
      (item) => item.category === category
    );

    switch (sortBy) {

      case "price-low":
        return [...list].sort(
          (a, b) =>
            (a.price?.discounted || 0) -
            (b.price?.discounted || 0)
        );

      case "price-high":
        return [...list].sort(
          (a, b) =>
            (b.price?.discounted || 0) -
            (a.price?.discounted || 0)
        );

      case "name":
        return [...list].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

      case "newest":
        return [...list].reverse();

      default:
        return list;
    }

  }, [products, category, sortBy]);

  return (

    <section className="shop-category">

      <img
        className="shop-cateogory-banner"
        src={banner}
        alt={category}
      />

      <div className="shopcateogory-indexSort">

        <p>
          Showing
          <span> {filteredProducts.length} </span>
          products
        </p>

        <select
          className="shop-category-sort"
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
        >
          <option value="default">
            Featured
          </option>

          <option value="price-low">
            Price: Low to High
          </option>

          <option value="price-high">
            Price: High to Low
          </option>

          <option value="name">
            Name (A-Z)
          </option>

          <option value="newest">
            Newest
          </option>

        </select>

      </div>

      {filteredProducts.length === 0 ? (

        <div className="shop-empty">

          <h2>No Products Found</h2>

          <p>
            We're adding more products to this
            category soon.
          </p>

        </div>

      ) : (

        <div className="shopcateogory-products">

          {filteredProducts.map((item) => {

            const productId = item._id;

            const images = item.images || [];

            const index =
              activeImage[productId] ?? 0;

            return (

              <div
                className="item-wrapper"
                key={productId}
              >

                <Item
                  slug={item.slug}
                  name={item.name}
                  image={
                    images[index]?.url ??
                    "/placeholder.png"
                  }
                  new_price={
                    item.price?.discounted || 0
                  }
                  old_price={
                    item.price?.original || 0
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

      )}

    </section>
  );
};

export default ShopCateogory;