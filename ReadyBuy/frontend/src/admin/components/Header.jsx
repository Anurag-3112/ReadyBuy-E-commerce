import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

const Header = () => {

    return (

        <Navbar
            bg="dark"
            variant="dark"
            className="shadow"
        >

            <Container fluid>

                <Navbar.Brand>

                    ReadyBuy Admin

                </Navbar.Brand>

            </Container>

        </Navbar>

    );

};

export default Header;