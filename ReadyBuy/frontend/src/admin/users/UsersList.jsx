import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import PaginationControls from "../components/PaginationControls";

import UserFilters from "./UserFilters";
import UsersTable from "./UserTable";
import UserDetailsModal from "./UserDetailsModal";

import {
    getUsers,
} from "../services/user.admin.service";

const UsersList = () => {

    const [page, setPage] =
        useState(1);

    const [search, setSearch] =
        useState("");

    const [role, setRole] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [
        selectedUser,
        setSelectedUser,
    ] = useState(null);

    const [
        showDetails,
        setShowDetails,
    ] = useState(false);

    const {
        data,
        isLoading,
        isError,
    } = useQuery({

        queryKey: [
            "users",
            page,
            search,
            role,
            status,
        ],

        queryFn: () =>

            getUsers({

                page,

                search,

                role,

                status,

            }),

        placeholderData:
            previousData => previousData,

    });

    if (isLoading) {

        return <LoadingState />;

    }

    if (isError) {

        return (

            <EmptyState

                title="Failed to load users"

                subtitle="Please try again."

            />

        );

    }

    return (

        <>

            <PageHeader

                title="Users"

            />

            <UserFilters

                search={search}

                setSearch={setSearch}

                role={role}

                setRole={setRole}

                status={status}

                setStatus={setStatus}

            />

            {data.docs.length === 0 ? (

                <EmptyState

                    title="No Users"

                    subtitle="No users found."

                />

            ) : (

                <UsersTable

                    users={data.docs}

                    onView={(user) => {

                        setSelectedUser(user);

                        setShowDetails(true);

                    }}

                />

            )}

            <PaginationControls

                page={data.page}

                hasPrevPage={data.hasPrevPage}

                hasNextPage={data.hasNextPage}

                onPrevious={() =>
                    setPage(prev => prev - 1)
                }

                onNext={() =>
                    setPage(prev => prev + 1)
                }

            />

            {selectedUser && (

                <UserDetailsModal

                    show={showDetails}

                    handleClose={() => {

                        setShowDetails(false);

                        setSelectedUser(null);

                    }}

                    user={selectedUser}

                />

            )}

        </>

    );

};

export default UsersList;