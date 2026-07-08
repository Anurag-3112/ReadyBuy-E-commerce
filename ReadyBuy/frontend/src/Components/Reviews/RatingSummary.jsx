import { FaStar, FaRegStar } from "react-icons/fa";

const RatingStars = ({
    rating = 0,
    size = 20,
    interactive = false,
    onChange,
}) => {

    const handleClick = (value) => {

        if (!interactive) return;

        onChange?.(value);

    };

    return (

        <div
            className="d-flex align-items-center"
            style={{
                gap: "4px",
            }}
        >

            {[1, 2, 3, 4, 5].map((star) => (

                <span
                    key={star}
                    style={{
                        cursor: interactive
                            ? "pointer"
                            : "default",
                    }}
                    onClick={() =>
                        handleClick(star)
                    }
                >

                    {star <= rating ? (

                        <FaStar
                            size={size}
                            color="#ffc107"
                        />

                    ) : (

                        <FaRegStar
                            size={size}
                            color="#ffc107"
                        />

                    )}

                </span>

            ))}

        </div>

    );

};

export default RatingStars;