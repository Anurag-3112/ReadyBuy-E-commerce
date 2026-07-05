import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import {
    FaRupeeSign,
    FaShoppingCart,
    FaBox,
    FaUsers,
} from "react-icons/fa";

import StatsCard from "../components/StatsCard";

const StatsGrid = ({
    stats,
}) => {

    return (

        <Row className="mb-4 g-4">

            <Col md={3}>

                <StatsCard
                    title="Revenue"
                    value={`₹${stats.revenue}`}
                    color="success"
                    icon={<FaRupeeSign />}
                />

            </Col>

            <Col md={3}>

                <StatsCard
                    title="Orders"
                    value={stats.orders}
                    color="primary"
                    icon={<FaShoppingCart />}
                />

            </Col>

            <Col md={3}>

                <StatsCard
                    title="Products"
                    value={stats.products}
                    color="warning"
                    icon={<FaBox />}
                />

            </Col>

            <Col md={3}>

                <StatsCard
                    title="Users"
                    value={stats.users}
                    color="info"
                    icon={<FaUsers />}
                />

            </Col>

        </Row>

    );

};

export default StatsGrid;