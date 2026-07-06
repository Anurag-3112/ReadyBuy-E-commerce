import React from "react";
import "./Hero.css";

import hero_image from "../assets/hero-image.jpg";

const Hero = () => {
    const scrollToCollection = () => {
        const section = document.getElementById("collection");

        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="hero">

            <div className="hero-left">

                <span className="hero-tag">
                    NEW COLLECTION 2026
                </span>

                <h1 className="hero-title">
                    Elevate Your
                    <br />
                    Everyday Style
                </h1>

                <p className="hero-description">
                    Discover timeless fashion crafted for modern living.
                    Premium quality, effortless elegance, and styles made
                    to last.
                </p>

                <div className="hero-buttons">

                    <button
                        className="hero-primary-btn"
                        onClick={scrollToCollection}
                    >
                        Shop Collection
                    </button>

                    <button
                        className="hero-secondary-btn"
                        onClick={scrollToCollection}
                    >
                        Explore More
                    </button>

                </div>

            </div>

            <div className="hero-right">

                <img
                    src={hero_image}
                    alt="ReadyBuy Fashion Collection"
                    className="hero-image"
                />

            </div>

        </section>
    );
};

export default Hero;