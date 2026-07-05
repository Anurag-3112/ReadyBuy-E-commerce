import React from "react";
import "./Breadcrum.css";
import arrow_icon from "../assets/arrow.png";

const Breadcrum = ({ s_product }) => {
  if (!s_product) return null;

  return (
    <nav className="breadcrum" aria-label="breadcrumb">

      <span>Home</span>

      <img src={arrow_icon} alt="" aria-hidden="true" />

      <span>Shop</span>

      <img src={arrow_icon} alt="" aria-hidden="true" />

      <span className="breadcrum-category">
        {s_product.category}
      </span>

      <img src={arrow_icon} alt="" aria-hidden="true" />

      <span className="breadcrum-current">
        {s_product.name}
      </span>

    </nav>
  );
};

export default Breadcrum;