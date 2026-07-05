import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import ImageThumbnail from "../components/ImageThumbnail";

import StatusDropdown from "./StatusDropdown";

const OrderTable = ({
    orders,
    onView,
    onDelete,
    onStatusChange,
}) => {

    const columns = [
        "#",
        "Image",
        "Order",
        "Customer",
        "Items",
        "Total",
        "Status",
        "Created",
        "Update",
        "Actions",
    ];

    return (

        <DataTable

            columns={columns}

            data={orders}

            emptyTitle="No Orders Found"

            emptySubtitle="Orders will appear here."

            renderRow={(order, index) => {

                const firstProduct =
                    order.items?.[0];

                return (

                    <tr key={order._id}>

                        <td>

                            {index + 1}

                        </td>

                        <td>

                            <ImageThumbnail

                                src={
                                    firstProduct?.product
                                        ?.images?.[0]
                                }

                                alt={
                                    firstProduct?.name
                                }

                                size={70}

                            />

                        </td>

                        <td>

                            {order._id}

                        </td>

                        <td>

                            <Stack>

                                <strong>

                                    {order.user?.name}

                                </strong>

                                <small>

                                    {order.user?.email}

                                </small>

                            </Stack>

                        </td>

                        <td>

                            {order.items.length}

                        </td>

                        <td>

                            ₹{order.totalAmount}

                        </td>

                        <td>

                            <StatusBadge

                                status={order.status}

                            />

                        </td>

                        <td>

                            {new Date(
                                order.createdAt
                            ).toLocaleDateString()}

                        </td>

                        <td>

                            <StatusDropdown

                                order={order}

                                onChange={
                                    onStatusChange
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
                                    onClick={() =>
                                        onView(order)
                                    }
                                >

                                    View

                                </Button>

                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                        onDelete(order)
                                    }
                                >

                                    Delete

                                </Button>

                            </Stack>

                        </td>

                    </tr>

                );

            }}

        />

    );

};

export default OrderTable;