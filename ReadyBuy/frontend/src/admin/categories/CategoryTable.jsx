import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";

const CategoryTable = ({
    categories,
    onEdit,
    onDelete,
}) => {

    if (!categories.length) {

        return (

            <div className="text-center py-5">

                <h4>

                    No Categories Found

                </h4>

            </div>

        );

    }

    return (

        <Table
            hover
            bordered
            striped
            responsive
        >

            <thead>

                <tr>

                    <th>#</th>

                    <th>Image</th>

                    <th>Name</th>

                    <th>Slug</th>

                    <th>Status</th>

                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                {

                    categories.map(
                        (category, index) => (

                            <tr
                                key={category._id}
                            >

                                <td>

                                    {index + 1}

                                </td>

                                <td>

                                    <Image

                                        src={
                                            category.image ||

                                            "/placeholder.png"
                                        }

                                        width={70}

                                        height={70}

                                        rounded

                                        style={{

                                            objectFit: "cover"

                                        }}

                                    />

                                </td>

                                <td>

                                    {category.name}

                                </td>

                                <td>

                                    {category.slug}

                                </td>

                                <td>

                                    <Badge

                                        bg={
                                            category.status === "ACTIVE"

                                                ? "success"

                                                : "secondary"
                                        }

                                    >

                                        {category.status}

                                    </Badge>

                                </td>

                                <td>

                                    <Stack
                                        direction="horizontal"
                                        gap={2}
                                    >

                                        <Button

                                            size="sm"

                                            onClick={() => {

                                                onEdit(category);

                                            }}

                                        >

                                            Edit

                                        </Button>

                                        <Button

                                            size="sm"

                                            variant="danger"

                                            onClick={() => {

                                                onDelete(category);

                                            }}

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

export default CategoryTable;