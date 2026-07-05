import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const FilterBar = ({ children }) => {
    return (
        <Row className="align-items-end g-3 mb-4">
            {Array.isArray(children)
                ? children.map((child, index) => (
                    <Col key={index}>
                        {child}
                    </Col>
                ))
                : <Col>{children}</Col>}
        </Row>
    );
};

export default FilterBar;