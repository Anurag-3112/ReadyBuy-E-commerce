import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        navigate("/login", {
            replace: true,
        });
    };

    return (
        <Navbar
            bg="dark"
            variant="dark"
            expand="lg"
            className="shadow"
            style={{
                height: "70px",
                flexShrink: 0,
            }}
        >
            <Container fluid>
                <Navbar.Brand className="fw-bold">
                    ReadyBuy Admin
                </Navbar.Brand>

                <Button
                    variant="outline-light"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Container>
        </Navbar>
    );
};

export default Header;