import { useQuery } from "@tanstack/react-query";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

import AdminLayout from "../layout/AdminLayout";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";

import {
    getDashboardStats,
    getMonthlyRevenue,
} from "../services/admin.service";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

const Dashboard = () => {

    const {

        data: stats,

        isLoading,

    } = useQuery({

        queryKey: ["adminStats"],

        queryFn: getDashboardStats,

    });

    const {

        data: revenue,

    } = useQuery({

        queryKey: ["monthlyRevenue"],

        queryFn: getMonthlyRevenue,

    });

    if (isLoading)
        return <Loader />;

    const chartData = {

        labels:
            revenue?.map(item => {

                return `${item._id.month}/${item._id.year}`;

            }) || [],

        datasets: [

            {

                label: "Revenue",

                data:

                    revenue?.map(

                        item => item.revenue

                    ) || [],

                borderWidth: 3,

                fill: false,

            }

        ]

    };

    return (

        <AdminLayout>

            <h2 className="mb-4">

                Dashboard

            </h2>

            <Row className="g-4">

                <Col md={4}>
                    <StatCard
                        title="Revenue"
                        value={`₹${stats.revenue}`}
                        color="#0d6efd"
                    />
                </Col>

                <Col md={4}>
                    <StatCard
                        title="Orders"
                        value={stats.orders}
                        color="#198754"
                    />
                </Col>

                <Col md={4}>
                    <StatCard
                        title="Products"
                        value={stats.products}
                        color="#fd7e14"
                    />
                </Col>

                <Col md={4}>
                    <StatCard
                        title="Users"
                        value={stats.users}
                        color="#6f42c1"
                    />
                </Col>

                <Col md={4}>
                    <StatCard
                        title="Pending"
                        value={stats.pendingOrders}
                        color="#dc3545"
                    />
                </Col>

                <Col md={4}>
                    <StatCard
                        title="Delivered"
                        value={stats.deliveredOrders}
                        color="#20c997"
                    />
                </Col>

            </Row>

            <Card className="mt-5 shadow-sm">

                <Card.Body>

                    <h4 className="mb-4">

                        Monthly Revenue

                    </h4>

                    <Line data={chartData} />

                </Card.Body>

            </Card>

        </AdminLayout>

    );

};

export default Dashboard;