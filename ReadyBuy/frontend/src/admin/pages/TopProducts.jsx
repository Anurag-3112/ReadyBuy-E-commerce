import { useQuery } from "@tanstack/react-query";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";

import LoadingState from "./LoadingState";
import { getTopProducts } from "../services/admin.service";

const TopProducts = () => {
    const {
        data = [],
        isLoading,
    } = useQuery({
        queryKey: ["topProducts"],
        queryFn: getTopProducts,
    });

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <Card className="shadow-sm h-100">
            <Card.Header>
                <strong>Top Selling Products</strong>
            </Card.Header>

            <Card.Body className="p-0">
                <Table hover responsive className="mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Sold</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="text-center py-4"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            data.map((product, index) => (
                                <tr key={product._id}>
                                    <td>{index + 1}</td>

                                    <td>{product.name}</td>

                                    <td>
                                        <Badge bg="success">
                                            {product.totalSold}
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

export default TopProducts;