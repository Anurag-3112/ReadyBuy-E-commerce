import { useState } from "react";

import Button from "react-bootstrap/Button";

import { useQuery } from "@tanstack/react-query";

import CategoryTable from "./CategoryTable";
import CategoryModal from "./CategoryModal";
import CategoryFilters from "./CategoryFilters";

import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PaginationControls from "../components/PaginationControls";

import {
    getCategories,
    deleteCategory,
} from "../services/category.admin.service";

const CategoriesList = () => {

    const [page, setPage] = useState(1);

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [
        selectedCategory,
        setSelectedCategory,
    ] = useState(null);

    const [
        deleteCategoryItem,
        setDeleteCategoryItem,
    ] = useState(null);

    const {
        data,
        isLoading,
        isError,
    } = useQuery({

        queryKey: [
            "categories",
            page,
            search,
            status,
        ],

        queryFn: () =>
            getCategories({
                page,
                search,
                status,
            }),

    });

    if (isLoading) {
        return <LoadingState />;
    }

    if (isError) {
        return (
            <EmptyState
                title="Failed to load categories"
                subtitle="Please try again."
            />
        );
    }

    const categories =
        data?.docs || [];

    const handleDelete = async () => {

        if (!deleteCategoryItem) return;

        try {

            await deleteCategory(
                deleteCategoryItem.id
            );

            setDeleteCategoryItem(null);

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <>

            <PageHeader
                title="Categories"
                action={
                    <Button
                        onClick={() => {

                            setSelectedCategory(
                                null
                            );

                            setShowModal(
                                true
                            );

                        }}
                    >
                        Add Category
                    </Button>
                }
            />

            <CategoryFilters

                search={search}

                setSearch={setSearch}

                status={status}

                setStatus={setStatus}

            />

            {categories.length === 0 ? (

                <EmptyState
                    title="No Categories"
                    subtitle="Create your first category."
                />

            ) : (

                <CategoryTable

                    categories={categories}

                    onEdit={(category) => {

                        setSelectedCategory(
                            category
                        );

                        setShowModal(
                            true
                        );

                    }}

                    onDelete={
                        setDeleteCategoryItem
                    }

                />

            )}

            <PaginationControls

                page={
                    data?.page || page
                }

                hasPrevPage={
                    data?.hasPrevPage
                }

                hasNextPage={
                    data?.hasNextPage
                }

                onPrevious={() =>
                    setPage((p) => p - 1)
                }

                onNext={() =>
                    setPage((p) => p + 1)
                }

            />

            <CategoryModal

                show={showModal}

                handleClose={() =>
                    setShowModal(false)
                }

                category={
                    selectedCategory
                }

            />

            <ConfirmDeleteModal

                show={!!deleteCategoryItem}

                handleClose={() =>
                    setDeleteCategoryItem(
                        null
                    )
                }

                title="Delete Category"

                message={`Are you sure you want to delete "${deleteCategoryItem?.name}"?`}

                loading={false}

                onConfirm={handleDelete}

            />

        </>

    );

};

export default CategoriesList;