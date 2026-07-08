import { useQuery } from "@tanstack/react-query";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";

import LoadingState from "./LoadingState";
import { getRecentOrders } from "../services/admin.service";

const statusVariant = {
    PENDING: "warning",
    PROCESSING: "info",
    SHIPPED: "primary",
    DELIVERED: "success",
    CANCELLED: "danger",
};

const RecentOrders = () => {
    const {
        data = [],
        isLoading,
    } = useQuery({
        queryKey: ["recentOrders"],
        queryFn: getRecentOrders,
    });

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <Card className="shadow-sm h-100">
            <Card.Header>
                <strong>Recent Orders</strong>
            </Card.Header>

            <Card.Body className="p-0">

                <Table
                    hover
                    responsive
                    className="mb-0"
                >

                    <thead>

                        <tr>

                            <th>Order</th>

                            <th>Customer</th>

                            <th>Total</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {data.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={4}
                                    className="text-center py-4"
                                >

                                    No Recent Orders

                                </td>

                            </tr>

                        ) : (

                            data.map((order) => (

                                <tr key={order._id}>

                                    <td>

                                        #{order.orderNumber}

                                    </td>

                                    <td>

                                        {order.user?.name}

                                    </td>

                                    <td>

                                        ₹{order.totalAmount}

                                    </td>

                                    <td>

                                        <Badge
                                            bg={
                                                statusVariant[
                                                order.orderStatus
                                                ] || "secondary"
                                            }
                                        >

                                            {order.orderStatus}

                                        </Badge>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </Table>

            </Card.Body>

        </Card>

    );

};

export default RecentOrders;