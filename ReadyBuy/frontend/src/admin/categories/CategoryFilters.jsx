import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

const CategoryFilters = ({
    search,
    setSearch,
}) => {

    return (

        <Row className="mb-4">

            <Col md={6}>

                <Form.Control
                    placeholder="Search Categories..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />

            </Col>

        </Row>

    );

};

export default CategoryFilters;