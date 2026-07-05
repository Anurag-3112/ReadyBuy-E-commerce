import Badge from "react-bootstrap/Badge";

const colors = {
    ACTIVE: "success",
    INACTIVE: "secondary",
    BLOCKED: "danger",

    PENDING: "warning",
    PROCESSING: "info",
    SHIPPED: "primary",
    DELIVERED: "success",
    CANCELLED: "danger",

    PAID: "success",
    FAILED: "danger",
};

const StatusBadge = ({ status }) => {

    return (

        <Badge
            bg={colors[status] || "secondary"}
        >
            {status}
        </Badge>

    );

};

export default StatusBadge;