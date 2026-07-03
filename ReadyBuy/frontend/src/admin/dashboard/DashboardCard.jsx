import Card from "react-bootstrap/Card";

const DashboardCard = ({
    title,
    value,
    color = "primary",
}) => {

    return (

        <Card
            border={color}
            className="shadow-sm h-100"
        >

            <Card.Body>

                <Card.Title>

                    {title}

                </Card.Title>

                <h2>

                    {value}

                </h2>

            </Card.Body>

        </Card>

    );

};

export default DashboardCard;