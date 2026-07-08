import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const NotFound = () => {
    return (
        <Container
            fluid
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "80vh",
                background: "#f8f9fa",
            }}
        >
            <Row className="text-center">
                <Col>
                    <h1
                        className="display-1 fw-bold"
                        style={{
                            color: "#ff4141",
                        }}
                    >
                        404
                    </h1>

                    <h2 className="fw-bold mb-3">
                        Page Not Found
                    </h2>

                    <p
                        className="text-muted mb-4"
                        style={{
                            maxWidth: "500px",
                            margin: "0 auto",
                        }}
                    >
                        Sorry, the page you are looking for
                        doesn't exist or has been moved.
                    </p>

                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Button
                            as={Link}
                            to="/"
                            variant="danger"
                            size="lg"
                        >
                            Go to Home
                        </Button>

                        <Button
                            as={Link}
                            to="/"
                            variant="outline-dark"
                            size="lg"
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFound;