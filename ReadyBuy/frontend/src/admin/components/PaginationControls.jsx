import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

const PaginationControls = ({
    page,
    hasNextPage,
    hasPrevPage,
    onPrevious,
    onNext,
}) => {
    return (
        <Stack
            direction="horizontal"
            gap={2}
            className="justify-content-end mt-4"
        >
            <Button
                variant="outline-secondary"
                disabled={!hasPrevPage}
                onClick={onPrevious}
            >
                Previous
            </Button>

            <span className="align-self-center">
                Page {page}
            </span>

            <Button
                variant="outline-primary"
                disabled={!hasNextPage}
                onClick={onNext}
            >
                Next
            </Button>
        </Stack>
    );
};

export default PaginationControls;