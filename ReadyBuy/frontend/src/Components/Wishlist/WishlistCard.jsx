import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { Link } from "react-router-dom";

import { FaTrash } from "react-icons/fa";

const WishlistCard = ({
    item,
    onRemove,
    onMoveToCart,
}) => {

    const product = item.product;

    if (!product) return null;

    return (

        <Card className="shadow-sm mb-3">

            <Card.Body>

                <Row className="align-items-center">

                    <Col md={2} xs={4}>

                        <img
                            src={
                                product.images?.[0]?.url ||
                                "/placeholder.png"
                            }
                            alt={product.name}
                            className="img-fluid rounded"
                            onError={(e) => {
                                e.target.src = "/placeholder.png";
                            }}
                        />

                    </Col>

                    <Col md={5} xs={8}>

                        <Link
                            to={`/product/${product.slug}`}
                            className="text-decoration-none"
                        >

                            <h5>

                                {product.name}

                            </h5>

                        </Link>

                        <p className="text-muted">

                            {product.brand}

                        </p>

                    </Col>

                    <Col md={2}>

                        <h5>

                            ₹

                            {product.price?.discounted}

                        </h5>

                    </Col>

                    <Col
                        md={3}
                        className="text-end"
                    >

                        <div className="d-grid gap-2">

                            <Button onClick={() => onMoveToCart(product._id)}>
                                Move To Cart
                            </Button>

                            <Button
                                variant="outline-danger"
                                onClick={() => onRemove(product._id)}
                            >
                                Remove
                            </Button>

                        </div>



                    </Col>

                </Row>

            </Card.Body>

        </Card>

    );

};

export default WishlistCard;