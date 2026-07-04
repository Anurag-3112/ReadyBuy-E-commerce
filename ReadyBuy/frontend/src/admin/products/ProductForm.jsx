import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";

const initialState = {
    name: "",
    description: "",
    brand: "",
    category: "men",
    originalPrice: "",
    discountedPrice: "",
    stock: "",
    status: "ACTIVE",
    isFeatured: false,
    isNewArrival: false,
};

const ProductForm = ({
    initialData,
    onSubmit,
    loading = false,
}) => {
    const [form, setForm] = useState(initialState);
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [existingImages, setExistingImages] = useState([]);

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || "",
                description: initialData.description || "",
                brand: initialData.brand || "",
                category: initialData.category || "men",
                originalPrice: initialData.price?.original || "",
                discountedPrice: initialData.price?.discounted || "",
                stock: initialData.stock || "",
                status: initialData.status || "ACTIVE",
                isFeatured: initialData.isFeatured || false,
                isNewArrival: initialData.isNewArrival || false,
            });

            // Show existing images while editing
            if (initialData.images?.length) {
                setExistingImages(initialData.images || []);
            }
        } else {
            setForm(initialState);
            setImages([]);
            setPreviewImages([]);
        }
    }, [initialData]);

    // Cleanup object URLs
    useEffect(() => {
        return () => {
            previewImages.forEach((img) => {
                if (typeof img === "string" && img.startsWith("blob:")) {
                    URL.revokeObjectURL(img);
                }
            });
        };
    }, [previewImages]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const removeExistingImage = (index) => {
        setExistingImages((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const validate = () => {

        const validationErrors = {};

        if (!form.name.trim()) {

            validationErrors.name =
                "Product name is required.";

        }

        if (!form.brand.trim()) {

            validationErrors.brand =
                "Brand is required.";

        }

        if (!form.description.trim()) {

            validationErrors.description =
                "Description is required.";

        }

        if (
            Number(form.originalPrice) <= 0
        ) {

            validationErrors.originalPrice =
                "Original price must be greater than 0.";

        }

        if (
            Number(form.discountedPrice) <= 0
        ) {

            validationErrors.discountedPrice =
                "Discounted price must be greater than 0.";

        }

        if (
            Number(form.discountedPrice) >
            Number(form.originalPrice)
        ) {

            validationErrors.discountedPrice =
                "Discounted price cannot exceed original price.";

        }

        if (
            Number(form.stock) < 0
        ) {

            validationErrors.stock =
                "Stock cannot be negative.";

        }

        if (
            images.length === 0 &&
            existingImages.length === 0
        ) {

            validationErrors.images =
                "Upload at least one product image.";

        }

        setErrors(validationErrors);

        return (
            Object.keys(validationErrors)
                .length === 0
        );

    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Remove old blob URLs
        previewImages.forEach((img) => {
            if (img.startsWith("blob:")) {
                URL.revokeObjectURL(img);
            }
        });

        setImages(files);

        const previews = files.map((file) =>
            URL.createObjectURL(file)
        );

        setPreviewImages(previews);
    };

    const removeImage = (index) => {
        const updatedImages = [...images];
        const updatedPreviews = [...previewImages];

        if (updatedPreviews[index]?.startsWith("blob:")) {
            URL.revokeObjectURL(updatedPreviews[index]);
        }

        updatedImages.splice(index, 1);
        updatedPreviews.splice(index, 1);

        setImages(updatedImages);
        setPreviewImages(updatedPreviews);
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!validate()) return;

        const formData = new FormData();

        formData.append("name", form.name.trim());

        formData.append(
            "description",
            form.description.trim()
        );

        formData.append(
            "brand",
            form.brand.trim()
        );

        formData.append(
            "category",
            form.category
        );

        formData.append(
            "stock",
            Number(form.stock)
        );

        formData.append(
            "status",
            form.status
        );

        formData.append(
            "isFeatured",
            form.isFeatured
        );

        formData.append(
            "isNewArrival",
            form.isNewArrival
        );

        formData.append(
            "price[original]",
            Number(form.originalPrice)
        );

        formData.append(
            "price[discounted]",
            Number(form.discountedPrice)
        );

        existingImages.forEach((image) => {

            formData.append(
                "existingImages",
                image
            );

        });

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
                    onSubmit={handleSubmit}
                >
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Brand</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="brand"
                                    value={form.brand}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>

                                <Form.Select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                >
                                    <option value="">

                                        All Categories

                                    </option>
                                    <option value="men">Men</option>
                                    <option value="women">Women</option>
                                    <option value="kids">Kids</option>
                                </Form.Select>

                                {errors.category && (
                                    <small className="text-danger">
                                        {errors.category}
                                    </small>
                                )}
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control
                                    type="number"
                                    min={0}
                                    name="stock"
                                    value={form.stock}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-4">

                        <Col md={6}>

                            <Form.Check
                                type="checkbox"
                                label="Featured Product"
                                name="isFeatured"
                                checked={form.isFeatured}
                                onChange={handleChange}
                            />

                        </Col>

                        <Col md={6}>

                            <Form.Check
                                type="checkbox"
                                label="New Arrival"
                                name="isNewArrival"
                                checked={form.isNewArrival}
                                onChange={handleChange}
                            />

                        </Col>

                    </Row>
                    <Form.Group className="mb-4">
                        {
                            existingImages.length > 0 && (
                                <>
                                    <h5 className="mb-3">
                                        Existing Images
                                    </h5>
                                    <Row className="mb-4">
                                        {
                                            existingImages.map((image, index) => (
                                                <Col
                                                    md={3}
                                                    key={index}
                                                    className="mb-3"
                                                >
                                                    <Card>
                                                        <Image
                                                            src={image}
                                                            fluid
                                                            style={{
                                                                height: 180,
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                        <Card.Body
                                                            className="text-center"
                                                        >
                                                            <Button
                                                                size="sm"
                                                                variant="outline-danger"
                                                                onClick={() =>
                                                                    removeExistingImage(index)
                                                                }
                                                            >
                                                                Remove

                                                            </Button>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))
                                        }
                                    </Row>
                                </>
                            )
                        }
                        <Form.Label>Product Images</Form.Label>
                        <Form.Control
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Form.Group>
                    {
                        previewImages.length > 0 && (
                            <>
                                <h5 className="mb-3">
                                    New Images
                                </h5>
                                <Row className="mb-4">
                                    {
                                        previewImages.map((image, index) => (
                                            <Col
                                                md={3}
                                                key={index}
                                                className="mb-3"
                                            >
                                                <Card>
                                                    <Image
                                                        src={image}
                                                        fluid
                                                        style={{
                                                            height: 180,
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                    <Card.Body
                                                        className="text-center"
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            onClick={() =>
                                                                removeImage(index)
                                                            }
                                                        >
                                                            Remove
                                                        </Button>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </>
                        )
                    }
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Original Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    min={0}
                                    name="originalPrice"
                                    value={form.originalPrice}
                                    onChange={handleChange}
                                    required
                                />
                                {
                                    errors.originalPrice && (

                                        <small className="text-danger">

                                            {errors.originalPrice}

                                        </small>

                                    )
                                }
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Discounted Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    min={0}
                                    name="discountedPrice"
                                    value={form.discountedPrice}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-4">
                        <Form.Label>
                            Product Status
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
                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {
                            loading
                                ? "Saving..."
                                : initialData
                                    ? "Update Product"
                                    : "Create Product"
                        }
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default ProductForm;