import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const OrderFilters = ({
    search,
    setSearch,
    status,
    setStatus,
}) => {

    const resetFilters = () => {
        setSearch("");
        setStatus("");
    };

    return (
        <Row className="mb-4">

            <Col md={6}>

                <Form.Control
                    type="text"
                    placeholder="Search by Order ID, Customer..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </Col>

            <Col md={3}>

                <Form.Select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                >

                    <option value="">

                        All Status

                    </option>

                    <option value="PENDING">

                        Pending

                    </option>

                    <option value="PAID">

                        Paid

                    </option>

                    <option value="SHIPPED">

                        Shipped

                    </option>

                    <option value="DELIVERED">

                        Delivered

                    </option>

                    <option value="CANCELLED">

                        Cancelled

                    </option>

                </Form.Select>

            </Col>

            <Col md={3}>

                <Button
                    variant="secondary"
                    className="w-100"
                    onClick={resetFilters}
                >

                    Reset Filters

                </Button>

            </Col>

        </Row>
    );
};

export default OrderFilters;