import {
    Line,
} from "react-chartjs-2";

import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SalesChart = ({
    sales,
    title = "Revenue",
}) => {

    const data = {

        labels: sales.labels,

        datasets: [

            {

                label: title,

                data: sales.data,

                borderWidth: 2,

                tension: 0.4,

            },

        ],

    };

    const options = {

        responsive: true,

        plugins: {

            legend: {

                display: true,

            },

        },

    };

    return (

        <Line

            data={data}

            options={options}

        />

    );

};

export default SalesChart;