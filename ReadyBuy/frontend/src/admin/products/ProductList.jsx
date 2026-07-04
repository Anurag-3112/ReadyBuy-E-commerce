import { useState } from "react";
import ProductModal from "./ProductModal";
import { useQuery } from "@tanstack/react-query";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import Loader from "../components/Loader";

import {
    getProducts,
} from "../services/product.admin.service";

import DeleteProductModal from "./DeleteProductModal";



const ProductList = () => {

    const [showModal, setShowModal] =
        useState(false);

    const [selectedProduct, setSelectedProduct] =
        useState(null);

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [deleteProductData, setDeleteProductData] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const filteredProducts =

        data.docs.filter(product =>

            product.name

                .toLowerCase()

                .includes(

                    search.toLowerCase()

                )

        );

    const {

        data,

        isLoading,

    } = useQuery({

        queryKey: ["products"],

        queryFn: getProducts,

    });

    if (isLoading)
        return <Loader />;

    return (

        <>

            <div className="d-flex justify-content-between mb-4">

                <h2>

                    Products

                </h2>

                <Button
                    onClick={() => {

                        setSelectedProduct(null);

                        setShowModal(true);

                    }}
                >

                    Add Product

                </Button>

            </div>
            <Form.Control

                placeholder="Search products..."

                className="mb-3"

                value={search}

                onChange={(e) =>

                    setSearch(e.target.value)

                }

            />
            <Table
                striped
                bordered
                hover
            >

                <thead>

                    <tr>

                        <th>Name</th>

                        <th>Category</th>

                        <th>Price</th>

                        <th>Stock</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        filteredProducts.map(product => (

                            <tr
                                key={product._id}
                            >

                                <td>

                                    {product.name}

                                </td>

                                <td>

                                    {product.category}

                                </td>

                                <td>

                                    ₹

                                    {product.price.discounted}

                                </td>

                                <td>

                                    {product.stock}

                                </td>

                                <td>

                                    {product.status}

                                </td>

                                <td>

                                    <Button

                                        size="sm"

                                        onClick={() => {

                                            setSelectedProduct(product);

                                            setShowModal(true);

                                        }}

                                    >

                                        Edit

                                    </Button>

                                    {" "}

                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => {

                                            setDeleteProductData(product);

                                            setShowDeleteModal(true);

                                        }}
                                    >

                                        Delete

                                    </Button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </Table>
            <ProductModal

                show={showModal}

                handleClose={() => {

                    setShowModal(false);

                    setSelectedProduct(null);

                }}

                product={selectedProduct}

            />

            <DeleteProductModal

                show={showDeleteModal}

                product={deleteProductData}

                handleClose={() => {

                    setDeleteProductData(null);

                    setShowDeleteModal(false);

                }}

            />

        </>

    );

};

export default ProductList;