import {
    Line
} from "react-chartjs-2";

import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from "chart.js";

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
);

const SalesChart = ({
    sales,
}) => {

    const data = {

        labels: sales.labels,

        datasets: [

            {

                label: "Sales",

                data: sales.data,

            },

        ],

    };

    return (

        <Line data={data} />

    );

};

export default SalesChart;