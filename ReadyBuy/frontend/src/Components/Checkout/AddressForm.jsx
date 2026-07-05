import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./AddressForm.css";

const AddressForm = ({ address, setAddress }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;

        setAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="address-form">

            <h4>Shipping Address</h4>

            <Row>

                <Col md={6}>
                    <Form.Group className="mb-3">

                        <Form.Label>Full Name</Form.Label>

                        <Form.Control
                            type="text"
                            required
                            name="fullName"
                            autoComplete="name"
                            placeholder="John Doe"
                            value={address.fullName}
                            onChange={handleChange}
                        />

                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">

                        <Form.Label>Phone</Form.Label>

                        <Form.Control
                            type="tel"
                            required
                            name="phone"
                            autoComplete="tel"
                            placeholder="9876543210"
                            value={address.phone}
                            onChange={handleChange}
                        />

                    </Form.Group>
                </Col>

            </Row>

            <Form.Group className="mb-3">

                <Form.Label>Address Line 1</Form.Label>

                <Form.Control
                    required
                    name="addressLine1"
                    autoComplete="address-line1"
                    placeholder="House No., Street"
                    value={address.addressLine1}
                    onChange={handleChange}
                />

            </Form.Group>

            <Form.Group className="mb-3">

                <Form.Label>Address Line 2</Form.Label>

                <Form.Control
                    name="addressLine2"
                    autoComplete="address-line2"
                    placeholder="Apartment, Landmark (Optional)"
                    value={address.addressLine2}
                    onChange={handleChange}
                />

            </Form.Group>

            <Row>

                <Col md={6}>
                    <Form.Group className="mb-3">

                        <Form.Label>City</Form.Label>

                        <Form.Control
                            required
                            name="city"
                            autoComplete="address-level2"
                            placeholder="Mumbai"
                            value={address.city}
                            onChange={handleChange}
                        />

                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">

                        <Form.Label>State</Form.Label>

                        <Form.Control
                            required
                            name="state"
                            autoComplete="address-level1"
                            placeholder="Maharashtra"
                            value={address.state}
                            onChange={handleChange}
                        />

                    </Form.Group>
                </Col>

            </Row>

            <Row>

                <Col md={6}>
                    <Form.Group className="mb-3">

                        <Form.Label>Pincode</Form.Label>

                        <Form.Control
                            required
                            name="pincode"
                            autoComplete="postal-code"
                            placeholder="400001"
                            value={address.pincode}
                            onChange={handleChange}
                        />

                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">

                        <Form.Label>Country</Form.Label>

                        <Form.Control
                            required
                            name="country"
                            autoComplete="country-name"
                            placeholder="India"
                            value={address.country}
                            onChange={handleChange}
                        />

                    </Form.Group>
                </Col>

            </Row>

        </div>
    );
};

export default AddressForm;