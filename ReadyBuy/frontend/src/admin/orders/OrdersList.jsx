import { useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { useQuery } from "@tanstack/react-query";

import Loader from "../components/Loader";

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

    const [selectedOrder,
        setSelectedOrder] =
        useState(null);

    const [showDetails,
        setShowDetails] =
        useState(false);

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

    const openDetails =
        (order) => {

            setSelectedOrder(order);

            setShowDetails(true);

        };

    const closeDetails =
        () => {

            setShowDetails(false);

            setSelectedOrder(null);

        };

    if (isLoading) {

        return <Loader />;

    }

    if (isError) {

        return (

            <div>

                Failed to load orders.

            </div>

        );

    }

    return (

        <>

            <Row className="mb-4">

                <Col>

                    <h2>

                        Orders

                    </h2>

                </Col>

            </Row>

            <OrderFilters

                search={search}

                setSearch={setSearch}

                status={status}

                setStatus={setStatus}

            />

            <OrderTable

                orders={data.docs}

                onView={openDetails}

                refetch={refetch}

            />

            <div
                className="d-flex justify-content-between mt-4"
            >

                <Button

                    disabled={
                        !data.hasPrevPage
                    }

                    onClick={() => setPage(

                        prev => prev - 1

                    )}

                >

                    Previous

                </Button>

                <span>

                    Page {data.page}

                    {" "}

                    of

                    {" "}

                    {data.totalPages}

                </span>

                <Button

                    disabled={
                        !data.hasNextPage
                    }

                    onClick={() => setPage(

                        prev => prev + 1

                    )}

                >

                    Next

                </Button>

            </div>

            {

                selectedOrder && (

                    <OrderDetailsModal

                        show={showDetails}

                        handleClose={closeDetails}

                        order={selectedOrder}

                    />

                )

            }

        </>

    );

};

export default OrdersList;