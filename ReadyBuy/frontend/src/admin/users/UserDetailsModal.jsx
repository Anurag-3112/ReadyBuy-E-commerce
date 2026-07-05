import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

import ImageThumbnail from "../components/ImageThumbnail";
import StatusBadge from "../components/StatusBadge";

const UserDetailsModal = ({
    show,
    handleClose,
    user,
}) => {

    if (!user) return null;

    return (

        <Modal
            show={show}
            onHide={handleClose}
            centered
        >

            <Modal.Header closeButton>

                <Modal.Title>

                    User Details

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <div className="text-center mb-3">

                    <ImageThumbnail

                        src={user.avatar}

                        alt={user.name}

                        size={120}

                    />

                </div>

                <ListGroup>

                    <ListGroup.Item>

                        <strong>Name:</strong>

                        {" "}

                        {user.name}

                    </ListGroup.Item>

                    <ListGroup.Item>

                        <strong>Email:</strong>

                        {" "}

                        {user.email}

                    </ListGroup.Item>

                    <ListGroup.Item>

                        <strong>Role:</strong>

                        {" "}

                        {user.role}

                    </ListGroup.Item>

                    <ListGroup.Item>

                        <strong>Status:</strong>

                        {" "}

                        <StatusBadge
                            status={user.status}
                        />

                    </ListGroup.Item>

                    <ListGroup.Item>

                        <strong>Joined:</strong>

                        {" "}

                        {new Date(
                            user.createdAt
                        ).toLocaleString()}

                    </ListGroup.Item>

                </ListGroup>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={handleClose}
                >

                    Close

                </Button>

            </Modal.Footer>

        </Modal>

    );

};

export default UserDetailsModal;