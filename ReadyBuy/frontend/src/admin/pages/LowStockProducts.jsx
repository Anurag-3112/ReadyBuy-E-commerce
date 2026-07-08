import { useQuery } from "@tanstack/react-query";

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";

import LoadingState from "./LoadingState";

import {
    getLowStockProducts,
} from "../services/admin.service";

const LowStockProducts = () => {

    const {

        data = [],

        isLoading,

    } = useQuery({

        queryKey: ["lowStock"],

        queryFn: getLowStockProducts,

    });

    if (isLoading) {

        return <LoadingState />;

    }

    return (

        <Card className="shadow-sm h-100">

            <Card.Header>

                <strong>

                    Low Stock Products

                </strong>

            </Card.Header>

            <Card.Body className="p-0">

                <Table
                    hover
                    responsive
                    className="mb-0"
                >

                    <thead>

                        <tr>

                            <th>

                                Product

                            </th>

                            <th>

                                Stock

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            data.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={2}
                                        className="text-center py-4"
                                    >

                                        No Low Stock Products

                                    </td>

                                </tr>

                            ) : (

                                data.map((product) => (

                                    <tr
                                        key={product._id}
                                    >

                                        <td>

                                            {product.name}

                                        </td>

                                        <td>

                                            <Badge
                                                bg="danger"
                                            >

                                                {product.stock}

                                            </Badge>

                                        </td>

                                    </tr>

                                ))

                            )

                        }

                    </tbody>

                </Table>

            </Card.Body>

        </Card>

    );

};

export default LowStockProducts;