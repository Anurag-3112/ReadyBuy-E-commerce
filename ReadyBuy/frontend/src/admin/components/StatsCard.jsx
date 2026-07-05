import Card from "react-bootstrap/Card";

const StatCard = ({
    title,
    value,
    color,
}) => {

    return (

        <Card
            className="shadow-sm border-0 h-100"
        >

            <Card.Body>

                <Card.Title
                    className="text-muted"
                >
                    {title}
                </Card.Title>

                <h2
                    style={{
                        color,
                        fontWeight: 700,
                    }}
                >
                    {value}
                </h2>

            </Card.Body>

        </Card>

    );
};

export default StatCard;