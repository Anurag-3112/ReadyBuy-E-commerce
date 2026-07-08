import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";

const CouponTable = ({
    coupons,
    onEdit,
    onDelete,
}) => {

    if (!coupons.length) {

        return (

            <div className="text-center py-5">

                <h4>No Coupons Found</h4>

            </div>

        );

    }

    const getStatusVariant = (status) => {

        switch (status) {

            case "ACTIVE":
                return "success";

            case "INACTIVE":
                return "secondary";

            case "EXPIRED":
                return "danger";

            default:
                return "dark";

        }

    };

    const getDiscount = (coupon) => {

        if (
            coupon.discountType === "PERCENTAGE"
        ) {

            return `${coupon.discountValue}%`;

        }

        return `₹${coupon.discountValue}`;

    };

    return (

        <Table
            hover
            bordered
            striped
            responsive
            className="align-middle"
        >

            <thead>

                <tr>

                    <th>#</th>

                    <th>Coupon Code</th>

                    <th>Type</th>

                    <th>Discount</th>

                    <th>Min Order</th>

                    <th>Max Discount</th>

                    <th>Usage</th>

                    <th>Expiry</th>

                    <th>Status</th>

                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                {

                    coupons.map(

                        (coupon, index) => (

                            <tr
                                key={coupon._id}
                            >

                                <td>

                                    {index + 1}

                                </td>

                                <td>

                                    <strong>

                                        {coupon.code}

                                    </strong>

                                </td>

                                <td>

                                    {

                                        coupon.discountType

                                    }

                                </td>

                                <td>

                                    {

                                        getDiscount(
                                            coupon
                                        )

                                    }

                                </td>

                                <td>

                                    ₹

                                    {

                                        coupon.minimumOrderAmount

                                    }

                                </td>

                                <td>

                                    {

                                        coupon.maximumDiscount > 0

                                            ? `₹${coupon.maximumDiscount}`

                                            : "-"

                                    }

                                </td>

                                <td>

                                    {

                                        coupon.usedCount

                                    }

                                    {" / "}

                                    {

                                        coupon.usageLimit

                                    }

                                </td>

                                <td>

                                    {

                                        new Date(

                                            coupon.expiryDate

                                        ).toLocaleDateString()

                                    }

                                </td>

                                <td>

                                    <Badge

                                        bg={

                                            getStatusVariant(

                                                coupon.status

                                            )

                                        }

                                    >

                                        {

                                            coupon.status

                                        }

                                    </Badge>

                                </td>

                                <td>

                                    <Stack
                                        direction="horizontal"
                                        gap={2}
                                    >

                                        <Button

                                            size="sm"

                                            onClick={() =>

                                                onEdit(
                                                    coupon
                                                )

                                            }

                                        >

                                            Edit

                                        </Button>

                                        <Button

                                            size="sm"

                                            variant="danger"

                                            onClick={() =>

                                                onDelete(
                                                    coupon
                                                )

                                            }

                                        >

                                            Delete

                                        </Button>

                                    </Stack>

                                </td>

                            </tr>

                        )

                    )

                }

            </tbody>

        </Table>

    );

};

export default CouponTable;