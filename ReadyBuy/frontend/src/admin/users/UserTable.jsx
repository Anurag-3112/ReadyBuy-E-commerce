import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

import DataTable from "../components/DataTable";
import ImageThumbnail from "../components/ImageThumbnail";

import RoleDropdown from "./RoleDropdown";
import StatusDropdown from "./StatusDropdown";

const UsersTable = ({
    users,
    onView,
    onDelete,
}) => {

    const columns = [
        "#",
        "Avatar",
        "Name",
        "Email",
        "Role",
        "Status",
        "Joined",
        "Actions",
    ];

    return (

        <DataTable

            columns={columns}

            data={users}

            emptyTitle="No Users Found"

            emptySubtitle="No users match your filters."

            renderRow={(user, index) => (

                <tr key={user.id}>

                    <td>

                        {index + 1}

                    </td>

                    <td>

                        <ImageThumbnail

                            src={user.avatar}

                            alt={user.name}

                            size={55}

                        />

                    </td>

                    <td>

                        {user.name}

                    </td>

                    <td>

                        {user.email}

                    </td>

                    <td>

                        <RoleDropdown
                            user={user}
                        />

                    </td>

                    <td>

                        <StatusDropdown
                            user={user}
                        />

                    </td>

                    <td>

                        {new Date(
                            user.createdAt
                        ).toLocaleDateString()}

                    </td>

                    <td>

                        <Stack
                            direction="horizontal"
                            gap={2}
                        >

                            <Button

                                size="sm"

                                onClick={() =>
                                    onView(user)
                                }

                            >

                                View

                            </Button>

                            <Button

                                variant="danger"

                                size="sm"

                                onClick={() =>
                                    onDelete?.(user)
                                }

                            >

                                Delete

                            </Button>

                        </Stack>

                    </td>

                </tr>

            )}

        />

    );

};

export default UsersTable;