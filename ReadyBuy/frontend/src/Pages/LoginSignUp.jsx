import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./CSS/LoginSignUp.css";

import { loginUser, registerUser } from "../services/auth.service";
import { AuthContext } from "../Context/AuthContext";

const LoginSignUp = () => {
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      let response;

      if (isLogin) {
        response = await loginUser({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await registerUser(formData);
      }

      const {
        accessToken,
        refreshToken,
        user,
      } = response.data;

      login(
        user,
        accessToken,
        refreshToken
      );

      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        "Something went wrong."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">

      <div className="login-wrapper">

        <div className="login-left">

          <span className="login-tag">
            PREMIUM SHOPPING
          </span>

          <h1>
            Welcome to
            <br />
            ReadyBuy
          </h1>

          <p>
            Discover premium fashion, timeless collections,
            and an effortless shopping experience designed
            just for you.
          </p>

          <div className="login-features">

            <div className="feature-card">
              <h4>Premium Quality</h4>
              <p>
                Carefully curated products with
                exceptional craftsmanship.
              </p>
            </div>

            <div className="feature-card">
              <h4>Fast Delivery</h4>
              <p>
                Secure checkout and quick delivery
                across India.
              </p>
            </div>

          </div>

        </div>

        <div className="login-right">

          <div className="login-card">

            <div className="login-header">

              <h2>
                {isLogin
                  ? "Welcome Back"
                  : "Create Account"}
              </h2>

              <p>
                {isLogin
                  ? "Login to continue shopping."
                  : "Create your ReadyBuy account."}
              </p>

            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {!isLogin && (

                <div className="form-group">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

              )}

              <div className="form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                    ? "Login"
                    : "Create Account"}
              </button>

            </form>

            <div className="login-footer">

              {isLogin ? (

                <p>

                  Don't have an account?

                  <button
                    type="button"
                    className="switch-btn"
                    onClick={() =>
                      setIsLogin(false)
                    }
                  >
                    Sign Up
                  </button>

                </p>

              ) : (

                <p>

                  Already have an account?

                  <button
                    type="button"
                    className="switch-btn"
                    onClick={() =>
                      setIsLogin(true)
                    }
                  >
                    Login
                  </button>

                </p>

              )}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default LoginSignUp;