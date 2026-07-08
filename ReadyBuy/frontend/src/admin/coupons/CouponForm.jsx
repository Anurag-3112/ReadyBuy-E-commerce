import { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

const initialState = {
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minimumOrderAmount: "",
    maximumDiscount: "",
    usageLimit: "",
    expiryDate: "",
    status: "ACTIVE",
};

const CouponForm = ({
    initialData = null,
    loading = false,
    onSubmit,
}) => {

    const [form, setForm] =
        useState(initialState);

    const [errors, setErrors] =
        useState({});

    useEffect(() => {

        if (initialData) {

            setForm({

                code:
                    initialData.code || "",

                description:
                    initialData.description || "",

                discountType:
                    initialData.discountType ||

                    "PERCENTAGE",

                discountValue:
                    initialData.discountValue ||

                    "",

                minimumOrderAmount:
                    initialData.minimumOrderAmount ||

                    "",

                maximumDiscount:
                    initialData.maximumDiscount ||

                    "",

                usageLimit:
                    initialData.usageLimit ||

                    "",

                expiryDate:
                    initialData.expiryDate
                        ?.slice(0, 10) || "",

                status:
                    initialData.status ||

                    "ACTIVE",

            });

        } else {

            setForm(initialState);

        }

    }, [initialData]);

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

    const validate = () => {

        const validationErrors = {};

        if (!form.code.trim()) {

            validationErrors.code =
                "Coupon code is required.";

        }

        if (

            Number(form.discountValue) <= 0

        ) {

            validationErrors.discountValue =
                "Discount must be greater than zero.";

        }

        if (

            form.discountType === "PERCENTAGE" &&

            Number(form.discountValue) > 100

        ) {

            validationErrors.discountValue =
                "Percentage cannot exceed 100.";

        }

        if (

            Number(form.minimumOrderAmount) < 0

        ) {

            validationErrors.minimumOrderAmount =
                "Minimum order cannot be negative.";

        }

        if (

            Number(form.maximumDiscount) < 0

        ) {

            validationErrors.maximumDiscount =
                "Maximum discount cannot be negative.";

        }

        if (

            Number(form.usageLimit) <= 0

        ) {

            validationErrors.usageLimit =
                "Usage limit must be greater than zero.";

        }

        if (!form.expiryDate) {

            validationErrors.expiryDate =
                "Expiry date is required.";

        }

        if (

            new Date(form.expiryDate) <= new Date()

        ) {

            validationErrors.expiryDate =
                "Expiry must be a future date.";

        }

        setErrors(validationErrors);

        return (

            Object.keys(validationErrors).length === 0

        );

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!validate()) return;

        onSubmit({

            ...form,

            discountValue:
                Number(form.discountValue),

            minimumOrderAmount:
                Number(form.minimumOrderAmount),

            maximumDiscount:
                Number(form.maximumDiscount),

            usageLimit:
                Number(form.usageLimit),

        });

    };

    return (

        <Card className="border-0 shadow-sm">

            <Card.Body>

                <Form onSubmit={handleSubmit}>

                    <Row>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Coupon Code

                                </Form.Label>

                                <Form.Control

                                    name="code"

                                    value={form.code}

                                    onChange={handleChange}

                                    placeholder="SAVE20"

                                />

                                {

                                    errors.code &&

                                    <small className="text-danger">

                                        {errors.code}

                                    </small>

                                }

                            </Form.Group>

                        </Col>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Discount Type

                                </Form.Label>

                                <Form.Select

                                    name="discountType"

                                    value={form.discountType}

                                    onChange={handleChange}

                                >

                                    <option value="PERCENTAGE">

                                        Percentage

                                    </option>

                                    <option value="FIXED">

                                        Fixed

                                    </option>

                                </Form.Select>

                            </Form.Group>

                        </Col>

                    </Row>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Description

                        </Form.Label>

                        <Form.Control

                            as="textarea"

                            rows={3}

                            name="description"

                            value={form.description}

                            onChange={handleChange}

                        />

                    </Form.Group>

                    <Row>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Discount Value

                                </Form.Label>

                                <Form.Control

                                    type="number"

                                    name="discountValue"

                                    value={form.discountValue}

                                    onChange={handleChange}

                                />

                                {

                                    errors.discountValue &&

                                    <small className="text-danger">

                                        {errors.discountValue}

                                    </small>

                                }

                            </Form.Group>

                        </Col>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Usage Limit

                                </Form.Label>

                                <Form.Control

                                    type="number"

                                    name="usageLimit"

                                    value={form.usageLimit}

                                    onChange={handleChange}

                                />

                                {

                                    errors.usageLimit &&

                                    <small className="text-danger">

                                        {errors.usageLimit}

                                    </small>

                                }

                            </Form.Group>

                        </Col>

                    </Row>

                    <Row>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Minimum Order

                                </Form.Label>

                                <Form.Control

                                    type="number"

                                    name="minimumOrderAmount"

                                    value={form.minimumOrderAmount}

                                    onChange={handleChange}

                                />

                            </Form.Group>

                        </Col>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Maximum Discount

                                </Form.Label>

                                <Form.Control

                                    type="number"

                                    name="maximumDiscount"

                                    value={form.maximumDiscount}

                                    onChange={handleChange}

                                />

                            </Form.Group>

                        </Col>

                    </Row>

                    <Row>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Expiry Date

                                </Form.Label>

                                <Form.Control

                                    type="date"

                                    name="expiryDate"

                                    value={form.expiryDate}

                                    onChange={handleChange}

                                />

                                {

                                    errors.expiryDate &&

                                    <small className="text-danger">

                                        {errors.expiryDate}

                                    </small>

                                }

                            </Form.Group>

                        </Col>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Status

                                </Form.Label>

                                <Form.Select

                                    name="status"

                                    value={form.status}

                                    onChange={handleChange}

                                >

                                    <option value="ACTIVE">

                                        Active

                                    </option>

                                    <option value="INACTIVE">

                                        Inactive

                                    </option>

                                </Form.Select>

                            </Form.Group>

                        </Col>

                    </Row>

                    <Button

                        type="submit"

                        disabled={loading}

                    >

                        {

                            loading

                                ? <>

                                    <Spinner
                                        size="sm"
                                        animation="border"
                                        className="me-2"
                                    />

                                    Saving...

                                </>

                                : initialData

                                    ? "Update Coupon"

                                    : "Create Coupon"

                        }

                    </Button>

                </Form>

            </Card.Body>

        </Card>

    );

};

export default CouponForm;