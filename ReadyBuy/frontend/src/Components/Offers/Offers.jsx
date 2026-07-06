import React from "react";
import { Link } from "react-router-dom";
import "./Offers.css";

import offers_1 from "../assets/offers_1.png";

const Offers = () => {
  return (
    <section className="offers">

      <div className="offers-content">

        <span className="offers-tag">
          Limited Time
        </span>

        <h2>
          Mid Season
          <br />
          Collection
        </h2>

        <p>
          Refresh your wardrobe with timeless essentials,
          premium fabrics, and exclusive styles curated for
          every occasion.
        </p>

        <div className="offers-buttons">

          <Link
            to="/women"
            className="offers-primary-btn"
          >
            Shop Now
          </Link>

          <Link
            to="/men"
            className="offers-secondary-btn"
          >
            Explore Collection
          </Link>

        </div>

      </div>

      <div className="offers-image">

        <img
          src={offers_1}
          alt="Mid Season Collection"
        />

      </div>

    </section>
  );
};

export default Offers;