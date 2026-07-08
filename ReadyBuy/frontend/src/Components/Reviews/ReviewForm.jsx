import { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

import RatingStars from "./RatingStars";

const initialState = {
    rating: 5,
    title: "",
    comment: "",
};

const ReviewForm = ({
    initialData = null,
    loading = false,
    onSubmit,
}) => {

    const [form, setForm] =
        useState(initialState);

    const [images, setImages] =
        useState([]);

    const [previewImages, setPreviewImages] =
        useState([]);

    const [errors, setErrors] =
        useState({});

    useEffect(() => {

        if (initialData) {

            setForm({

                rating:
                    initialData.rating,

                title:
                    initialData.title || "",

                comment:
                    initialData.comment || "",

            });

            setPreviewImages(
                initialData.images || []
            );

        }

    }, [initialData]);

    const handleChange = (e) => {

        setForm((prev) => ({

            ...prev,

            [e.target.name]:
                e.target.value,

        }));

    };

    const handleImageChange = (e) => {

        const files =
            Array.from(e.target.files);

        setImages(files);

        const previews =
            files.map((file) =>
                URL.createObjectURL(file)
            );

        setPreviewImages(previews);

    };

    const removeImage = (index) => {

        setImages((prev) =>
            prev.filter(
                (_, i) =>
                    i !== index
            )
        );

        setPreviewImages((prev) =>
            prev.filter(
                (_, i) =>
                    i !== index
            )
        );

    };

    const validate = () => {

        const validationErrors = {};

        if (
            form.rating < 1 ||
            form.rating > 5
        ) {

            validationErrors.rating =
                "Select a rating.";

        }

        if (
            form.comment.trim().length < 10
        ) {

            validationErrors.comment =
                "Comment should contain at least 10 characters.";

        }

        setErrors(validationErrors);

        return (
            Object.keys(validationErrors)
                .length === 0
        );

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!validate()) return;

        const formData =
            new FormData();

        formData.append(
            "rating",
            form.rating
        );

        formData.append(
            "title",
            form.title
        );

        formData.append(
            "comment",
            form.comment
        );

        images.forEach((image) => {

            formData.append(
                "images",
                image
            );

        });

        onSubmit(formData);

    };

    return (

        <Card className="shadow-sm border-0">

            <Card.Body>

                <Form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <Form.Group className="mb-4">

                        <Form.Label>

                            Rating

                        </Form.Label>

                        <RatingStars

                            rating={
                                form.rating
                            }

                            interactive

                            onChange={(rating) =>

                                setForm((prev) => ({

                                    ...prev,

                                    rating,

                                }))

                            }

                        />

                        {

                            errors.rating &&

                            <small className="text-danger">

                                {errors.rating}

                            </small>

                        }

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Review Title

                        </Form.Label>

                        <Form.Control

                            name="title"

                            value={
                                form.title
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="Amazing Product"

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Comment

                        </Form.Label>

                        <Form.Control

                            as="textarea"

                            rows={5}

                            name="comment"

                            value={
                                form.comment
                            }

                            onChange={
                                handleChange
                            }

                        />

                        {

                            errors.comment &&

                            <small className="text-danger">

                                {errors.comment}

                            </small>

                        }

                    </Form.Group>

                    <Form.Group className="mb-4">

                        <Form.Label>

                            Images

                        </Form.Label>

                        <Form.Control

                            type="file"

                            accept="image/*"

                            multiple

                            onChange={
                                handleImageChange
                            }

                        />

                    </Form.Group>

                    {

                        previewImages.length > 0 && (

                            <Row>

                                {

                                    previewImages.map(

                                        (image, index) => (

                                            <Col
                                                md={3}
                                                key={index}
                                                className="mb-3"
                                            >

                                                <img

                                                    src={image}

                                                    alt={`Preview ${index + 1}`}

                                                    className="img-fluid rounded border"

                                                    style={{

                                                        height: "120px",

                                                        width: "100%",

                                                        objectFit: "cover",

                                                    }}

                                                />

                                                <Button

                                                    variant="danger"

                                                    size="sm"

                                                    className="w-100 mt-2"

                                                    onClick={() =>
                                                        removeImage(index)
                                                    }

                                                >

                                                    Remove

                                                </Button>

                                            </Col>

                                        )

                                    )

                                }

                            </Row>

                        )

                    }

                    <Button

                        type="submit"

                        disabled={loading}

                    >

                        {

                            loading ? (

                                <>

                                    <Spinner

                                        size="sm"

                                        animation="border"

                                        className="me-2"

                                    />

                                    Saving...

                                </>

                            ) : initialData ? (

                                "Update Review"

                            ) : (

                                "Submit Review"

                            )

                        }

                    </Button>

                </Form>

            </Card.Body>

        </Card>

    );

};

export default ReviewForm;