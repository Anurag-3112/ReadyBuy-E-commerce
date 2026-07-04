import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";

import StatusDropdown from "./StatusDropdown";

const statusVariant = (status) => {
    switch (status) {
        case "PENDING":
            return "warning";

        case "PAID":
            return "primary";

        case "SHIPPED":
            return "info";

        case "DELIVERED":
            return "success";

        case "CANCELLED":
            return "danger";

        default:
            return "secondary";
    }
};

const OrderTable = ({
    orders,
    onView,
    onDelete,
    onStatusChange,
}) => {

    if (!orders.length) {

        return (

            <div className="text-center py-5">

                <h4>

                    No Orders Found

                </h4>

            </div>

        );

    }

    return (

        <Table
            responsive
            bordered
            hover
            striped
        >

            <thead>

                <tr>

                    <th>#</th>

                    <th>Image</th>

                    <th>Order</th>

                    <th>Customer</th>

                    <th>Items</th>

                    <th>Total</th>

                    <th>Status</th>

                    <th>Created</th>

                    <th>Update</th>

                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                {

                    orders.map(
                        (order, index) => {

                            const firstProduct =
                                order.items?.[0];

                            return (

                                <tr
                                    key={order._id}
                                >

                                    <td>

                                        {index + 1}

                                    </td>

                                    <td>

                                        <Image

                                            src={
                                                firstProduct
                                                    ?.product
                                                    ?.images?.[0] ||

                                                "/placeholder.png"
                                            }

                                            rounded

                                            width={70}

                                            height={70}

                                            style={{

                                                objectFit: "cover",

                                            }}

                                        />

                                    </td>

                                    <td>

                                        {order._id}

                                    </td>

                                    <td>

                                        <Stack>

                                            <strong>

                                                {
                                                    order.user
                                                        ?.name
                                                }

                                            </strong>

                                            <small>

                                                {
                                                    order.user
                                                        ?.email
                                                }

                                            </small>

                                        </Stack>

                                    </td>

                                    <td>

                                        {
                                            order.items.length
                                        }

                                    </td>

                                    <td>

                                        ₹

                                        {
                                            order.totalAmount
                                        }

                                    </td>

                                    <td>

                                        <Badge
                                            bg={
                                                statusVariant(
                                                    order.status
                                                )
                                            }
                                        >

                                            {
                                                order.status
                                            }

                                        </Badge>

                                    </td>

                                    <td>

                                        {

                                            new Date(

                                                order.createdAt

                                            ).toLocaleDateString()

                                        }

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

                                                onClick={() => {

                                                    onView(order)

                                                }}

                                            >

                                                View

                                            </Button>

                                            <Button

                                                variant="danger"

                                                size="sm"

                                                onClick={() => {

                                                    onDelete(order)

                                                }}

                                            >

                                                Delete

                                            </Button>

                                        </Stack>

                                    </td>

                                </tr>

                            );

                        }

                    )

                }

            </tbody>

        </Table>

    );

};

export default OrderTable;