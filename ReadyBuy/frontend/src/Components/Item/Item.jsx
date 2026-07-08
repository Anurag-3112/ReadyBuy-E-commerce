import React from "react";
import "./Item.css";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import WishlistButton
  from "../Wishlist/WishlistButton";

const Item = ({
  _id,
  slug,
  image,
  name,
  new_price,
  old_price,
}) => {

  const discount =
    old_price > new_price
      ? Math.round(
        ((old_price - new_price) /
          old_price) *
        100
      )
      : 0;

  return (
    <div className="item">
      <div
        className="position-absolute"
        style={{
          top: 10,
          right: 10,
          zIndex: 10,
        }}
      >

        <WishlistButton

          productId={_id}

          isWishlisted={false}

        />

      </div>
      <Link
        to={`/product/${slug}`}
        className="item-image"
        onClick={() => window.scrollTo(0, 0)}
      >

        {discount > 0 && (
          <span className="discount-badge">
            -{discount}%
          </span>
        )}

        <img
          src={image || "/placeholder.png"}
          alt={name}
        />

        <div className="item-overlay">
          <span>
            View Product
            <FaArrowRight />
          </span>
        </div>

      </Link>

      <div className="item-content">

        <h5 className="item-title">{name}</h5>

        <div className="item-prices">

          <span className="item-prices-new">
            ₹{new_price}
          </span>

          {old_price > new_price && (
            <span className="item-prices-old">
              ₹{old_price}
            </span>
          )}

        </div>

      </div>

    </div>
  );
};

export default Item;