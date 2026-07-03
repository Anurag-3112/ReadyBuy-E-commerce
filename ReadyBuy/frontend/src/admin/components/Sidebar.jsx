import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

import {
    FaHome,
    FaBox,
    FaShoppingCart,
    FaUsers,
    FaTags,
    FaChartBar,
} from "react-icons/fa";

const Sidebar = () => {

    return (

        <Nav
            className="flex-column bg-dark text-white vh-100 p-3"
            style={{
                width: "250px",
            }}
        >

            <Nav.Link
                as={Link}
                to="/admin"
                className="text-white"
            >
                <FaHome /> Dashboard
            </Nav.Link>

            <Nav.Link
                as={Link}
                to="/admin/products"
                className="text-white"
            >
                <FaBox /> Products
            </Nav.Link>

            <Nav.Link
                as={Link}
                to="/admin/orders"
                className="text-white"
            >
                <FaShoppingCart /> Orders
            </Nav.Link>

            <Nav.Link
                as={Link}
                to="/admin/users"
                className="text-white"
            >
                <FaUsers /> Users
            </Nav.Link>

            <Nav.Link
                as={Link}
                to="/admin/coupons"
                className="text-white"
            >
                <FaTags /> Coupons
            </Nav.Link>

            <Nav.Link
                as={Link}
                to="/admin/analytics"
                className="text-white"
            >
                <FaChartBar /> Analytics
            </Nav.Link>

        </Nav>

    );

};

export default Sidebar;