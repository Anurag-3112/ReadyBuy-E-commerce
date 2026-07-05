import { useState, useEffect } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

import ImageThumbnail from "../components/ImageThumbnail";

const initialState = {
    name: "",
    description: "",
    status: "ACTIVE",
};

const CategoryForm = ({
    initialData,
    loading = false,
    onSubmit,
}) => {

    const [form, setForm] =
        useState(initialState);

    const [image, setImage] =
        useState(null);

    const [preview, setPreview] =
        useState("");

    const [errors, setErrors] =
        useState({});

    useEffect(() => {

        if (initialData) {

            setForm({

                name:
                    initialData.name || "",

                description:
                    initialData.description || "",

                status:
                    initialData.status || "ACTIVE",

            });

            setPreview(
                initialData.image || ""
            );

        } else {

            setForm(initialState);

            setImage(null);

            setPreview("");

        }

    }, [initialData]);

    useEffect(() => {

        return () => {

            if (
                preview &&
                preview.startsWith("blob:")
            ) {

                URL.revokeObjectURL(
                    preview
                );

            }

        };

    }, [preview]);

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setForm((prev) => ({

            ...prev,

            [name]: value,

        }));

    };

    const handleImageChange = (e) => {

        const file =
            e.target.files[0];

        if (!file) return;

        if (
            preview &&
            preview.startsWith("blob:")
        ) {

            URL.revokeObjectURL(
                preview
            );

        }

        setImage(file);

        setPreview(
            URL.createObjectURL(file)
        );

    };

    const validate = () => {

        const validationErrors = {};

        if (
            !form.name.trim()
        ) {

            validationErrors.name =
                "Category name is required.";

        }

        if (
            !form.description.trim()
        ) {

            validationErrors.description =
                "Description is required.";

        }

        setErrors(
            validationErrors
        );

        return (

            Object.keys(
                validationErrors
            ).length === 0

        );

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!validate()) return;

        const formData =
            new FormData();

        formData.append(
            "name",
            form.name.trim()
        );

        formData.append(
            "description",
            form.description.trim()
        );

        formData.append(
            "status",
            form.status
        );

        if (image) {

            formData.append(
                "image",
                image
            );

        }

        onSubmit(formData);

    };

    return (

        <Card className="border-0">

            <Card.Body>

                <Form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <Row>

                        <Col md={12}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Category Name

                                </Form.Label>

                                <Form.Control

                                    name="name"

                                    value={form.name}

                                    onChange={
                                        handleChange
                                    }

                                />

                                {errors.name && (

                                    <small className="text-danger">

                                        {errors.name}

                                    </small>

                                )}

                            </Form.Group>

                        </Col>

                    </Row>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Description

                        </Form.Label>

                        <Form.Control

                            as="textarea"

                            rows={4}

                            name="description"

                            value={
                                form.description
                            }

                            onChange={
                                handleChange
                            }

                        />

                        {errors.description && (

                            <small className="text-danger">

                                {errors.description}

                            </small>

                        )}

                    </Form.Group>

                    <Form.Group className="mb-4">

                        <Form.Label>

                            Category Image

                        </Form.Label>

                        <Form.Control

                            type="file"

                            accept="image/*"

                            onChange={
                                handleImageChange
                            }

                        />

                    </Form.Group>

                    {preview && (

                        <div className="mb-4">

                            <ImageThumbnail

                                src={preview}

                                alt={
                                    form.name
                                }

                                size={180}

                            />

                        </div>

                    )}

                    <Form.Group className="mb-4">

                        <Form.Label>

                            Status

                        </Form.Label>

                        <Form.Select

                            name="status"

                            value={
                                form.status
                            }

                            onChange={
                                handleChange
                            }

                        >

                            <option value="ACTIVE">

                                Active

                            </option>

                            <option value="INACTIVE">

                                Inactive

                            </option>

                        </Form.Select>

                    </Form.Group>

                    <Button

                        type="submit"

                        disabled={loading}

                    >

                        {loading ? (

                            <>

                                <Spinner

                                    animation="border"

                                    size="sm"

                                    className="me-2"

                                />

                                Saving...

                            </>

                        ) : initialData ? (

                            "Update Category"

                        ) : (

                            "Create Category"

                        )}

                    </Button>

                </Form>

            </Card.Body>

        </Card>

    );

};

export default CategoryForm;