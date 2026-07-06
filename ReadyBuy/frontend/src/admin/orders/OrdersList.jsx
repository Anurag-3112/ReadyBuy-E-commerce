import { useState } from "react";

import Button from "react-bootstrap/Button";

import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import PaginationControls from "../components/PaginationControls";

import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";
import OrderDetailsModal from "./OrderDetailsModal";

import {
    getOrders,
    deleteOrder,
} from "../services/order.admin.service";

import { toast } from "react-toastify";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

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

    const queryClient = useQueryClient();

    const [deleteOrderData, setDeleteOrderData] =
        useState(null);

    const {
        data,
        isLoading,
        isError,
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

    const deleteMutation = useMutation({

        mutationFn: deleteOrder,

        onSuccess: () => {

            toast.success(
                "Order deleted successfully."
            );

            queryClient.invalidateQueries({
                queryKey: ["orders"],
            });

            setDeleteOrderData(null);

        },

        onError: (error) => {

            toast.error(

                error.response?.data?.message ||

                "Unable to delete order."

            );

        },

    });


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
            <ConfirmDeleteModal

                show={!!deleteOrderData}

                handleClose={() =>
                    setDeleteOrderData(null)
                }

                title="Delete Order"

                message={`Are you sure you want to delete order "${deleteOrderData?._id}"?`}

                loading={deleteMutation.isPending}

                onConfirm={() =>
                    deleteMutation.mutate(
                        deleteOrderData._id
                    )
                }

            />
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
                    onDelete={(order) =>
                        setDeleteOrderData(order)
                    }
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