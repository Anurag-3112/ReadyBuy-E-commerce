import { useQuery } from "@tanstack/react-query";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";

import LoadingState from "./LoadingState";
import { getTopCategories } from "../services/admin.service";

const TopCategories = () => {
    const {
        data = [],
        isLoading,
    } = useQuery({
        queryKey: ["topCategories"],
        queryFn: getTopCategories,
    });

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <Card className="shadow-sm h-100">
            <Card.Header>
                <strong>Top Categories</strong>
            </Card.Header>

            <Card.Body className="p-0">
                <Table hover responsive className="mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Category</th>
                            <th>Orders</th>
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
                            data.map((category, index) => (
                                <tr key={category._id}>
                                    <td>{index + 1}</td>

                                    <td>{category.name}</td>

                                    <td>
                                        <Badge bg="primary">
                                            {category.totalOrders}
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

export default TopCategories;