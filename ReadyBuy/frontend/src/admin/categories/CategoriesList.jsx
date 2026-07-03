import { useState } from "react";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useQuery } from "@tanstack/react-query";

import CategoryTable from "./CategoryTable";
import CategoryModal from "./CategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import CategoryFilters from "./CategoryFilters";

import Loader from "../components/Loader";

import {
    getCategories,
} from "../services/category.admin.service";

const CategoriesList = () => {

    const [search, setSearch] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [selectedCategory,
        setSelectedCategory] =
        useState(null);

    const [deleteCategory,
        setDeleteCategory] =
        useState(null);

    const {
        data = [],
        isLoading,
        isError,
    } = useQuery({

        queryKey: [
            "categories"
        ],

        queryFn: getCategories,

    });

    if (isLoading) {

        return <Loader />;

    }

    if (isError) {

        return <div>

            Failed to load categories.

        </div>;

    }

    const filtered =
        data.filter(category =>

            category.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )

        );

    return (

        <>

            <Row className="mb-4">

                <Col>

                    <h2>

                        Categories

                    </h2>

                </Col>

                <Col className="text-end">

                    <Button

                        onClick={() => {

                            setSelectedCategory(null);

                            setShowModal(true);

                        }}

                    >

                        Add Category

                    </Button>

                </Col>

            </Row>

            <CategoryFilters

                search={search}

                setSearch={setSearch}

            />

            <CategoryTable

                categories={filtered}

                onEdit={(category) => {

                    setSelectedCategory(category);

                    setShowModal(true);

                }}

                onDelete={setDeleteCategory}

            />

            <CategoryModal

                show={showModal}

                handleClose={() => {

                    setShowModal(false);

                }}

                category={selectedCategory}

            />

            <DeleteCategoryModal

                show={!!deleteCategory}

                handleClose={() => {

                    setDeleteCategory(null);

                }}

                category={deleteCategory}

            />

        </>

    );

};

export default CategoriesList;