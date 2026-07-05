import React from "react";
import "./DiscriptionBox.css";

const DiscriptionBox = ({ s_product }) => {
    return (
        <section className="description-box">

            <div className="description-box-tabs">

                <button
                    className="description-tab active"
                    type="button"
                >
                    Description
                </button>

                <button
                    className="description-tab"
                    type="button"
                >
                    Reviews
                    <span className="review-count">122</span>
                </button>

            </div>

            <div className="description-content">

                <p>
                    {s_product?.description ||
                        "No description available."}
                </p>

            </div>

        </section>
    );
};

export default DiscriptionBox;