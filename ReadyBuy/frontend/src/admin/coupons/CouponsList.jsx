import { useState } from "react";

import Button from "react-bootstrap/Button";

import { useQuery } from "@tanstack/react-query";

import CouponTable from "./CouponTable";
import CouponModal from "./CouponModal";
import CouponFilters from "./CouponFilters";
import DeleteCouponModal from "./DeleteCouponModal";

import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import PaginationControls from "../components/PaginationControls";

import { getCoupons } from "../services/coupon.admin.service";

const CouponsList = () => {

    const [page, setPage] = useState(1);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [selectedCoupon, setSelectedCoupon] =
        useState(null);

    const [deleteCoupon, setDeleteCoupon] =
        useState(null);

    const [discountType, setDiscountType] =
        useState("");

    const {
        data,
        isLoading,
        isError,
    } = useQuery({

        queryKey: [

            "coupons",

            page,

            search,

            status,

            discountType,

        ],

        queryFn: () =>

            getCoupons({

                page,

                search,

                status,

                discountType,

            })

    });

    if (isLoading) {

        return <LoadingState />;

    }

    if (isError) {

        return (

            <EmptyState

                title="Unable to load coupons"

                subtitle="Please try again."

            />

        );

    }

    const coupons = data?.docs || [];

    return (

        <>

            <PageHeader

                title="Coupons"

                action={

                    <Button

                        onClick={() => {

                            setSelectedCoupon(null);

                            setShowModal(true);

                        }}

                    >

                        Add Coupon

                    </Button>

                }

            />

            <CouponFilters

                search={search}
                setSearch={setSearch}

                status={status}
                setStatus={setStatus}

                discountType={discountType}
                setDiscountType={setDiscountType}

            />

            {

                coupons.length === 0 ? (

                    <EmptyState

                        title="No Coupons"

                        subtitle="Create your first coupon."

                    />

                ) : (

                    <CouponTable

                        coupons={coupons}

                        onEdit={(coupon) => {

                            setSelectedCoupon(coupon);

                            setShowModal(true);

                        }}

                        onDelete={setDeleteCoupon}

                    />

                )

            }

            <PaginationControls

                page={

                    data?.page ||

                    page

                }

                hasPrevPage={

                    data?.hasPrevPage

                }

                hasNextPage={

                    data?.hasNextPage

                }

                onPrevious={() =>

                    setPage(

                        (prev) => prev - 1

                    )

                }

                onNext={() =>

                    setPage(

                        (prev) => prev + 1

                    )

                }

            />

            <CouponModal

                show={showModal}

                handleClose={() =>

                    setShowModal(false)

                }

                coupon={selectedCoupon}

            />

            <DeleteCouponModal

                show={!!deleteCoupon}

                handleClose={() =>

                    setDeleteCoupon(null)

                }

                coupon={deleteCoupon}

            />

        </>

    );

};

export default CouponsList;