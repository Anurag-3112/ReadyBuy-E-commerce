import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const PageHeader = ({
    title,
    action,
}) => {

    return (

        <Row className="mb-4">

            <Col>

                <h2>{title}</h2>

            </Col>

            <Col
                className="text-end"
            >

                {action}

            </Col>

        </Row>

    );

};

export default PageHeader;