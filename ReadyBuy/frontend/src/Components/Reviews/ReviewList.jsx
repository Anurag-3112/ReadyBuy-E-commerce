import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import Spinner from "react-bootstrap/Spinner";

import { toast } from "react-toastify";

import {
    getProductReviews,
    getRatingSummary,
    createReview,
    updateReview,
    deleteReview,
} from "../../services/review.service";

import RatingSummary from "./RatingSummary";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";

const ReviewList = ({
    productId,
    currentUser,
}) => {

    const queryClient =
        useQueryClient();

    const [page, setPage] =
        useState(1);

    const [editingReview, setEditingReview] =
        useState(null);

    /*
    |--------------------------------------------------------------------------
    | Reviews
    |--------------------------------------------------------------------------
    */

    const {

        data: reviews,

        isLoading,

    } = useQuery({

        queryKey: [
            "reviews",
            productId,
            page,
        ],

        queryFn: () =>
            getProductReviews(
                productId,
                page
            ),

    });

    /*
    |--------------------------------------------------------------------------
    | Rating Summary
    |--------------------------------------------------------------------------
    */

    const {

        data: summary,

    } = useQuery({

        queryKey: [
            "rating-summary",
            productId,
        ],

        queryFn: () =>
            getRatingSummary(
                productId
            ),

    });

    /*
    |--------------------------------------------------------------------------
    | Create Review
    |--------------------------------------------------------------------------
    */

    const createMutation =
        useMutation({

            mutationFn: createReview,

            onSuccess: () => {

                toast.success(
                    "Review submitted."
                );

                queryClient.invalidateQueries({
                    queryKey: [
                        "reviews",
                        productId,
                    ],
                });

                queryClient.invalidateQueries({
                    queryKey: [
                        "rating-summary",
                        productId,
                    ],
                });

            },

            onError: (error) => {

                toast.error(

                    error.response?.data?.message ||

                    "Unable to submit review."

                );

            },

        });

    /*
    |--------------------------------------------------------------------------
    | Update Review
    |--------------------------------------------------------------------------
    */

    const updateMutation =
        useMutation({

            mutationFn: ({ id, payload }) =>
                updateReview(
                    id,
                    payload
                ),

            onSuccess: () => {

                toast.success(
                    "Review updated."
                );

                setEditingReview(
                    null
                );

                queryClient.invalidateQueries({
                    queryKey: [
                        "reviews",
                        productId,
                    ],
                });

                queryClient.invalidateQueries({
                    queryKey: [
                        "rating-summary",
                        productId,
                    ],
                });

            },

        });

    /*
    |--------------------------------------------------------------------------
    | Delete Review
    |--------------------------------------------------------------------------
    */

    const deleteMutation =
        useMutation({

            mutationFn: deleteReview,

            onSuccess: () => {

                toast.success(
                    "Review deleted."
                );

                queryClient.invalidateQueries({
                    queryKey: [
                        "reviews",
                        productId,
                    ],
                });

                queryClient.invalidateQueries({
                    queryKey: [
                        "rating-summary",
                        productId,
                    ],
                });

            },

        });

    const handleCreate = (
        formData
    ) => {

        formData.append(
            "product",
            productId
        );

        createMutation.mutate(
            formData
        );

    };

    const handleUpdate = (
        formData
    ) => {

        updateMutation.mutate({

            id: editingReview._id,

            payload: formData,

        });

    };

    if (isLoading) {

        return (
            <div className="text-center py-5">
                <Spinner />
            </div>
        );

    }

    return (

        <div className="mt-5">

            <h3 className="mb-4">

                Customer Reviews

            </h3>

            <RatingSummary
                summary={summary}
            />

            <div className="my-4">

                <ReviewForm

                    initialData={
                        editingReview
                    }

                    loading={
                        createMutation.isPending ||
                        updateMutation.isPending
                    }

                    onSubmit={

                        editingReview
                            ? handleUpdate
                            : handleCreate

                    }

                />

            </div>

            {reviews?.docs?.length === 0 && (

                <Alert
                    variant="info"
                >

                    No reviews yet.

                    Be the first to review this product.

                </Alert>

            )}

            {reviews?.docs?.map(
                (review) => (

                    <ReviewCard

                        key={
                            review._id
                        }

                        review={
                            review
                        }

                        currentUser={
                            currentUser
                        }

                        onEdit={
                            setEditingReview
                        }

                        onDelete={() =>

                            deleteMutation.mutate(
                                review._id
                            )

                        }

                    />

                )
            )}

            {reviews?.totalPages >
                1 && (

                    <Pagination className="justify-content-center mt-4">

                        <Pagination.Prev

                            disabled={
                                page === 1
                            }

                            onClick={() =>
                                setPage(
                                    (prev) =>
                                        prev - 1
                                )
                            }

                        />

                        {[...Array(
                            reviews.totalPages
                        )].map(
                            (_, index) => (

                                <Pagination.Item

                                    key={index}

                                    active={
                                        page ===
                                        index + 1
                                    }

                                    onClick={() =>
                                        setPage(
                                            index +
                                            1
                                        )
                                    }

                                >

                                    {index + 1}

                                </Pagination.Item>

                            )
                        )}

                        <Pagination.Next

                            disabled={
                                page ===
                                reviews.totalPages
                            }

                            onClick={() =>
                                setPage(
                                    (prev) =>
                                        prev + 1
                                )
                            }

                        />

                    </Pagination>

                )}

        </div>

    );

};

export default ReviewList;