import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import RatingStars from "./RatingStars";

const ReviewCard = ({
    review,
    currentUser,
    onEdit,
    onDelete,
}) => {

    const isOwner =
        currentUser?._id === review.user?._id;

    return (

        <Card className="shadow-sm mb-3">

            <Card.Body>

                <Row>

                    <Col md={9}>

                        <div className="d-flex align-items-center justify-content-between">

                            <div>

                                <h5 className="mb-1">

                                    {review.title || "Review"}

                                </h5>

                                <small className="text-muted">

                                    {review.user?.name}

                                </small>

                            </div>

                            <RatingStars
                                rating={review.rating}
                            />

                        </div>

                        <div className="mt-2">

                            {review.isVerifiedPurchase && (

                                <Badge
                                    bg="success"
                                    className="me-2"
                                >

                                    Verified Purchase

                                </Badge>

                            )}

                            <small className="text-muted">

                                {new Date(
                                    review.createdAt
                                ).toLocaleDateString()}

                            </small>

                        </div>

                        <p className="mt-3 mb-3">

                            {review.comment}

                        </p>

                        {review.images?.length > 0 && (

                            <Row>

                                {review.images.map(
                                    (image, index) => (

                                        <Col
                                            md={3}
                                            xs={6}
                                            key={index}
                                            className="mb-3"
                                        >

                                            <img
                                                src={image}
                                                alt={`Review ${index + 1}`}
                                                className="img-fluid rounded border"
                                                style={{
                                                    height: "120px",
                                                    width: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />

                                        </Col>

                                    )
                                )}

                            </Row>

                        )}

                    </Col>

                    <Col
                        md={3}
                        className="d-flex flex-column justify-content-between align-items-end"
                    >

                        <Badge
                            bg="secondary"
                            className="mb-3"
                        >

                            👍 {review.likes}

                        </Badge>

                        {isOwner && (

                            <div>

                                <Button
                                    size="sm"
                                    variant="outline-primary"
                                    className="me-2"
                                    onClick={() =>
                                        onEdit(review)
                                    }
                                >

                                    Edit

                                </Button>

                                <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() =>
                                        onDelete(review)
                                    }
                                >

                                    Delete

                                </Button>

                            </div>

                        )}

                    </Col>

                </Row>

            </Card.Body>

        </Card>

    );

};

export default ReviewCard;