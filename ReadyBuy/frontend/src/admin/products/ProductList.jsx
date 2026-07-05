import { useState } from "react";

import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";

import ProductModal from "./ProductModal";

import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

import {
    getProducts,
    deleteProduct,
} from "../services/product.admin.service";

const ProductList = () => {

    const queryClient =
        useQueryClient();

    const [showModal, setShowModal] =
        useState(false);

    const [
        selectedProduct,
        setSelectedProduct,
    ] = useState(null);

    const [
        deleteProductData,
        setDeleteProductData,
    ] = useState(null);

    const [search, setSearch] =
        useState("");

    const {
        data,
        isLoading,
    } = useQuery({

        queryKey: ["products"],

        queryFn: getProducts,

    });

    const deleteMutation =
        useMutation({

            mutationFn: (id) =>
                deleteProduct(id),

            onSuccess: () => {

                toast.success(
                    "Product deleted successfully."
                );

                queryClient.invalidateQueries({

                    queryKey: [
                        "products",
                    ],

                });

                setDeleteProductData(
                    null
                );

            },

            onError: (error) => {

                toast.error(

                    error.response?.data
                        ?.message ||

                    "Unable to delete product."

                );

            },

        });

    if (isLoading) {

        return <LoadingState />;

    }

    const filteredProducts =
        data.docs.filter(product =>
            product.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );

    const columns = [

        "Name",

        "Category",

        "Price",

        "Stock",

        "Status",

        "Actions",

    ];

    return (

        <>

            <PageHeader

                title="Products"

                action={

                    <Button
                        onClick={() => {

                            setSelectedProduct(
                                null
                            );

                            setShowModal(
                                true
                            );

                        }}
                    >

                        Add Product

                    </Button>

                }

            />

            <SearchInput

                value={search}

                onChange={setSearch}

                placeholder="Search products..."

            />

            <div className="mt-3">

                <DataTable

                    columns={columns}

                    data={filteredProducts}

                    emptyTitle="No Products"

                    emptySubtitle="Create your first product."

                    renderRow={(product) => (

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

                                {
                                    product.price
                                        .discounted
                                }

                            </td>

                            <td>

                                {product.stock}

                            </td>

                            <td>

                                <StatusBadge

                                    status={
                                        product.status
                                    }

                                />

                            </td>

                            <td>

                                <Stack
                                    direction="horizontal"
                                    gap={2}
                                >

                                    <Button

                                        size="sm"

                                        onClick={() => {

                                            setSelectedProduct(
                                                product
                                            );

                                            setShowModal(
                                                true
                                            );

                                        }}

                                    >

                                        Edit

                                    </Button>

                                    <Button

                                        variant="danger"

                                        size="sm"

                                        onClick={() =>

                                            setDeleteProductData(
                                                product
                                            )

                                        }

                                    >

                                        Delete

                                    </Button>

                                </Stack>

                            </td>

                        </tr>

                    )}

                />

            </div>

            <ProductModal

                show={showModal}

                handleClose={() => {

                    setShowModal(
                        false
                    );

                    setSelectedProduct(
                        null
                    );

                }}

                product={
                    selectedProduct
                }

            />

            <ConfirmDeleteModal

                show={
                    !!deleteProductData
                }

                handleClose={() =>
                    setDeleteProductData(
                        null
                    )
                }

                title="Delete Product"

                message={`Are you sure you want to delete "${deleteProductData?.name}"?`}

                loading={
                    deleteMutation.isPending
                }

                onConfirm={() =>

                    deleteMutation.mutate(
                        deleteProductData._id
                    )

                }

            />

        </>

    );

};

export default ProductList;