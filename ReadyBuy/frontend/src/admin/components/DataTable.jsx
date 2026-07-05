import Table from "react-bootstrap/Table";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";

const DataTable = ({
    columns = [],
    data = [],
    loading = false,
    emptyTitle = "No Data Found",
    emptySubtitle = "",
    renderRow,
}) => {

    if (loading) {
        return <LoadingState />;
    }

    if (!data.length) {
        return (
            <EmptyState
                title={emptyTitle}
                subtitle={emptySubtitle}
            />
        );
    }

    return (
        <Table
            responsive
            striped
            bordered
            hover
            className="align-middle"
        >

            <thead>

                <tr>

                    {columns.map((column) => (

                        <th key={column}>
                            {column}
                        </th>

                    ))}

                </tr>

            </thead>

            <tbody>

                {data.map((item, index) =>
                    renderRow(item, index)
                )}

            </tbody>

        </Table>
    );
};

export default DataTable;