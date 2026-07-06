import React, { useContext } from "react";
import "./Navbar.css";

import {
    Navbar,
    Nav,
    Container,
    Form,
    InputGroup,
    Dropdown,
    Badge,
} from "react-bootstrap";

import {
    FaSearch,
    FaShoppingBag,
    FaUserCircle,
    FaSignOutAlt,
    FaClipboardList,
    FaUser,
} from "react-icons/fa";

import logo2 from "../assets/logo2.jpg";

import { Link, NavLink } from "react-router-dom";

import { AuthContext } from "../../Context/AuthContext";
import { ShopContext } from "../../Context/ShopContext";

const AppNavbar = () => {
    const {
        user,
        logout,
        isAuthenticated,
    } = useContext(AuthContext);

    const { cartItems } = useContext(ShopContext);

    const totalItems = (cartItems || []).reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return (
        <Navbar
            expand="lg"
            className="custom-navbar shadow-sm"
            sticky="top"
        >
            <Container fluid>

                {/* Logo */}

                <Navbar.Brand
                    as={Link}
                    to="/"
                    className="d-flex align-items-center"
                >
                    <img
                        src={logo2}
                        alt="ReadyBuy"
                        className="navbar-logo"
                    />

                    <div className="ms-2">
                        <div className="brand-title">
                            ReadyBuy
                        </div>

                        <div className="brand-subtitle">
                            Premium Shopping
                        </div>
                    </div>
                </Navbar.Brand>

                <Navbar.Toggle />

                <Navbar.Collapse>

                    {/* Menu */}

                    <Nav className="mx-auto navbar-links">

                        <NavLink
                            to="/"
                            end
                            className="nav-link"
                        >
                            Shop
                        </NavLink>

                        <NavLink
                            to="/men"
                            className="nav-link"
                        >
                            Men
                        </NavLink>

                        <NavLink
                            to="/women"
                            className="nav-link"
                        >
                            Women
                        </NavLink>

                        <NavLink
                            to="/kids"
                            className="nav-link"
                        >
                            Kids
                        </NavLink>

                    </Nav>

                    {/* Right Side */}

                    <div className="d-flex align-items-center gap-3">

                        {/* Search */}

                        <InputGroup className="search-box">

                            <InputGroup.Text>
                                <FaSearch />
                            </InputGroup.Text>

                            <Form.Control
                                placeholder="Search products..."
                            />

                        </InputGroup>

                        {/* User */}

                        {isAuthenticated ? (

                            <Dropdown align="end">

                                <Dropdown.Toggle
                                    variant="light"
                                    className="user-dropdown"
                                >
                                    <FaUserCircle
                                        size={22}
                                    />

                                    <span className="ms-2">

                                        {user?.name ||
                                            "Account"}

                                    </span>

                                </Dropdown.Toggle>

                                <Dropdown.Menu>

                                    <Dropdown.Item
                                        as={Link}
                                        to="/orders"
                                    >
                                        <FaClipboardList className="me-2" />
                                        My Orders
                                    </Dropdown.Item>

                                    <Dropdown.Item>
                                        <FaUser className="me-2" />
                                        Profile
                                    </Dropdown.Item>

                                    <Dropdown.Divider />

                                    <Dropdown.Item
                                        onClick={logout}
                                    >
                                        <FaSignOutAlt className="me-2" />
                                        Logout
                                    </Dropdown.Item>

                                </Dropdown.Menu>

                            </Dropdown>

                        ) : (

                            <Link
                                to="/login"
                                className="signin-btn"
                            >
                                Sign In
                            </Link>

                        )}

                        {/* Cart */}

                        <Link
                            to="/cart"
                            className="cart-link"
                        >
                            <FaShoppingBag
                                size={24}
                            />

                            {totalItems > 0 && (

                                <Badge
                                    pill
                                    bg="danger"
                                    className="cart-badge"
                                >
                                    {totalItems}
                                </Badge>

                            )}

                        </Link>

                    </div>

                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
};

export default AppNavbar;