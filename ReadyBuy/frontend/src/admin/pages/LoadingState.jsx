import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";

const LoadingState = ({
    message = "Loading...",
    fullScreen = false,
}) => {
    return (
        <Container
            fluid
            className={`d-flex flex-column justify-content-center align-items-center ${fullScreen ? "vh-100" : "py-5"
                }`}
        >
            <Spinner
                animation="border"
                variant="primary"
                role="status"
                style={{
                    width: "3rem",
                    height: "3rem",
                }}
            >
                <span className="visually-hidden">
                    Loading...
                </span>
            </Spinner>

            <p
                className="mt-3 text-muted fw-semibold"
                style={{
                    fontSize: "1rem",
                }}
            >
                {message}
            </p>
        </Container>
    );
};

export default LoadingState;