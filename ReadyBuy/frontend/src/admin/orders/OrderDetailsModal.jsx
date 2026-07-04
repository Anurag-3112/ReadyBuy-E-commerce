import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import ListGroup from "react-bootstrap/ListGroup";

const statusVariant = (status) => {
    switch (status) {
        case "PENDING":
            return "warning";
        case "PAID":
            return "primary";
        case "SHIPPED":
            return "info";
        case "DELIVERED":
            return "success";
        case "CANCELLED":
            return "danger";
        default:
            return "secondary";
    }
};

const OrderDetailsModal = ({
    show,
    handleClose,
    order,
}) => {

    if (!order) return null;

    return (

        <Modal
            show={show}
            onHide={handleClose}
            size="xl"
            centered
        >

            <Modal.Header closeButton>

                <Modal.Title>

                    Order Details

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <Row>

                    <Col md={6}>

                        <Card className="mb-4">

                            <Card.Header>

                                Customer Information

                            </Card.Header>

                            <ListGroup variant="flush">

                                <ListGroup.Item>

                                    <strong>Name:</strong>

                                    {" "}

                                    {order.user?.name}

                                </ListGroup.Item>

                                <ListGroup.Item>

                                    <strong>Email:</strong>

                                    {" "}

                                    {order.user?.email}

                                </ListGroup.Item>

                                <ListGroup.Item>

                                    <strong>Order ID:</strong>

                                    {" "}

                                    {order._id}

                                </ListGroup.Item>

                                <ListGroup.Item>

                                    <strong>Date:</strong>

                                    {" "}

                                    {new Date(
                                        order.createdAt
                                    ).toLocaleString()}

                                </ListGroup.Item>

                            </ListGroup>

                        </Card>

                    </Col>

                    <Col md={6}>

                        <Card className="mb-4">

                            <Card.Header>

                                Order Summary

                            </Card.Header>

                            <ListGroup variant="flush">

                                <ListGroup.Item>

                                    <strong>Status:</strong>

                                    {" "}

                                    <Badge
                                        bg={statusVariant(order.status)}
                                    >

                                        {order.status}

                                    </Badge>

                                </ListGroup.Item>

                                <ListGroup.Item>

                                    <strong>Total Items:</strong>

                                    {" "}

                                    {order.items.length}

                                </ListGroup.Item>

                                <ListGroup.Item>

                                    <strong>Total Amount:</strong>

                                    {" "}

                                    ₹{order.totalAmount}

                                </ListGroup.Item>

                            </ListGroup>

                        </Card>

                    </Col>

                </Row>

                <Card>

                    <Card.Header>

                        Ordered Products

                    </Card.Header>

                    <Card.Body>

                        <Table
                            responsive
                            hover
                        >

                            <thead>

                                <tr>

                                    <th>Image</th>

                                    <th>Product</th>

                                    <th>Price</th>

                                    <th>Qty</th>

                                    <th>Total</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    order.items.map(item => (

                                        <tr
                                            key={item.product?._id}
                                        >

                                            <td>

                                                <Image

                                                    src={
                                                        item.product?.images?.[0] ||

                                                        "/placeholder.png"
                                                    }

                                                    width={70}

                                                    height={70}

                                                    rounded

                                                    style={{

                                                        objectFit: "cover"

                                                    }}

                                                />

                                            </td>

                                            <td>

                                                {item.name}

                                            </td>

                                            <td>

                                                ₹{item.price}

                                            </td>

                                            <td>

                                                {item.quantity}

                                            </td>

                                            <td>

                                                ₹

                                                {

                                                    item.price *

                                                    item.quantity

                                                }

                                            </td>

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </Table>

                    </Card.Body>

                </Card>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={handleClose}
                >

                    Close

                </Button>

            </Modal.Footer>

        </Modal>

    );

};

export default OrderDetailsModal;