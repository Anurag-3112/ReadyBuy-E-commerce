import { useState } from "react";

import Button from "react-bootstrap/Button";

import { useQuery } from "@tanstack/react-query";

import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import PaginationControls from "../components/PaginationControls";

import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";
import OrderDetailsModal from "./OrderDetailsModal";

import { getOrders } from "../services/order.admin.service";

const OrdersList = () => {

    const [page, setPage] = useState(1);

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [
        selectedOrder,
        setSelectedOrder,
    ] = useState(null);

    const [
        showDetails,
        setShowDetails,
    ] = useState(false);

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useQuery({

        queryKey: [
            "orders",
            page,
            search,
            status,
        ],

        queryFn: () =>
            getOrders({
                page,
                search,
                status,
            }),

        keepPreviousData: true,

    });

    const openDetails = (order) => {

        setSelectedOrder(order);

        setShowDetails(true);

    };

    const closeDetails = () => {

        setSelectedOrder(null);

        setShowDetails(false);

    };

    if (isLoading) {
        return <LoadingState />;
    }

    if (isError) {
        return (
            <EmptyState
                title="Failed to load orders"
                subtitle="Please try again."
            />
        );
    }

    return (

        <>

            <PageHeader
                title="Orders"
            />

            <OrderFilters

                search={search}

                setSearch={setSearch}

                status={status}

                setStatus={setStatus}

            />

            {data.docs.length === 0 ? (

                <EmptyState
                    title="No Orders"
                    subtitle="No orders found."
                />

            ) : (

                <OrderTable

                    orders={data.docs}

                    onView={openDetails}

                    refetch={refetch}

                />

            )}

            <PaginationControls

                page={data.page}

                hasPrevPage={data.hasPrevPage}

                hasNextPage={data.hasNextPage}

                onPrevious={() =>
                    setPage((prev) => prev - 1)
                }

                onNext={() =>
                    setPage((prev) => prev + 1)
                }

            />

            {selectedOrder && (

                <OrderDetailsModal

                    show={showDetails}

                    handleClose={closeDetails}

                    order={selectedOrder}

                />

            )}

        </>

    );

};

export default OrdersList;