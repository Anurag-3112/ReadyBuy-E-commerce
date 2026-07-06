import React from "react";
import "./Footer.css";

import { Link } from "react-router-dom";

import footer_logo from "../assets/footer_logo.png";

import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">

      <div className="footer-top">

        <div className="footer-brand">

          <img
            src={footer_logo}
            alt="ReadyBuy"
          />

          <h3>ReadyBuy</h3>

          <p>
            Timeless fashion crafted for modern living.
            Discover premium collections designed to elevate
            your everyday wardrobe.
          </p>

        </div>

        <div className="footer-links">

          <div>

            <h5>Shop</h5>

            <Link to="/men">
              Men
            </Link>

            <Link to="/women">
              Women
            </Link>

            <Link to="/kids">
              Kids
            </Link>

          </div>

          <div>

            <h5>Company</h5>

            <Link to="/">
              About Us
            </Link>

            <Link to="/">
              Contact
            </Link>

            <Link to="/">
              Careers
            </Link>

          </div>

          <div>

            <h5>Support</h5>

            <Link to="/">
              Help Center
            </Link>

            <Link to="/">
              Shipping
            </Link>

            <Link to="/">
              Returns
            </Link>

          </div>

        </div>

      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">

        <p>
          © {year} ReadyBuy. All rights reserved.
        </p>

        <div className="footer-social">

          <a
            href="#"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>

          <a
            href="#"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>

          <a
            href="#"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>

          <a
            href="#"
            aria-label="Pinterest"
          >
            <FaPinterestP />
          </a>

        </div>

      </div>

    </footer>
  );
};

export default Footer;