import { useQuery } from "@tanstack/react-query";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import {
    FaRupeeSign,
    FaShoppingCart,
    FaBox,
    FaUsers,
    FaClock,
    FaCheckCircle,
} from "react-icons/fa";

import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import SalesChart from "../components/SalesChart";

import {
    getDashboardStats,
    getMonthlyRevenue,
} from "../services/admin.service";

const Dashboard = () => {

    const {

        data: stats,

        isLoading,

    } = useQuery({

        queryKey: ["adminStats"],

        queryFn: getDashboardStats,

    });

    const {

        data: revenue = [],

    } = useQuery({

        queryKey: ["monthlyRevenue"],

        queryFn: getMonthlyRevenue,

    });

    if (isLoading) {

        return <LoadingState />;

    }

    const sales = {

        labels: revenue.map(item =>
            `${item._id.month}/${item._id.year}`
        ),

        data: revenue.map(
            item => item.revenue
        ),

    };

    return (

        <>

            <PageHeader
                title="Dashboard"
            />

            <Row className="g-4">

                <Col md={4}>

                    <StatsCard

                        title="Revenue"

                        value={`₹${stats.revenue}`}

                        color="primary"

                        icon={<FaRupeeSign />}

                    />

                </Col>

                <Col md={4}>

                    <StatsCard

                        title="Orders"

                        value={stats.orders}

                        color="success"

                        icon={<FaShoppingCart />}

                    />

                </Col>

                <Col md={4}>

                    <StatsCard

                        title="Products"

                        value={stats.products}

                        color="warning"

                        icon={<FaBox />}

                    />

                </Col>

                <Col md={4}>

                    <StatsCard

                        title="Users"

                        value={stats.users}

                        color="info"

                        icon={<FaUsers />}

                    />

                </Col>

                <Col md={4}>

                    <StatsCard

                        title="Pending Orders"

                        value={stats.pendingOrders}

                        color="danger"

                        icon={<FaClock />}

                    />

                </Col>

                <Col md={4}>

                    <StatsCard

                        title="Delivered Orders"

                        value={stats.deliveredOrders}

                        color="success"

                        icon={<FaCheckCircle />}

                    />

                </Col>

            </Row>

            <Card className="mt-5 shadow-sm">

                <Card.Body>

                    <h4 className="mb-4">

                        Monthly Revenue

                    </h4>

                    <SalesChart
                        sales={sales}
                    />

                </Card.Body>

            </Card>

        </>

    );

};

export default Dashboard;