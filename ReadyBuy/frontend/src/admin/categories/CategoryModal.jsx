import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
    createCategory,
    updateCategory,
} from "../services/category.admin.service";

const CategoryModal = ({
    show,
    handleClose,
    category,
}) => {

    const queryClient =
        useQueryClient();

    const [form, setForm] =
        useState({

            name: "",
            description: "",
            image: "",
            status: "ACTIVE",

        });

    useEffect(() => {

        if (category) {

            setForm(category);

        } else {

            setForm({

                name: "",
                description: "",
                image: "",
                status: "ACTIVE",

            });

        }

    }, [category]);

    const mutation =
        useMutation({

            mutationFn: (payload) => {

                if (category) {

                    return updateCategory(
                        category._id,
                        payload
                    );
                }

                return createCategory(
                    payload
                );

            },

            onSuccess: () => {

                toast.success(

                    category

                        ? "Category Updated"

                        : "Category Created"

                );

                queryClient.invalidateQueries({

                    queryKey: ["categories"]

                });

                handleClose();

            }

        });

    const submit = (e) => {

        e.preventDefault();

        mutation.mutate(form);

    };

    return (

        <Modal
            show={show}
            onHide={handleClose}
        >

            <Form onSubmit={submit}>

                <Modal.Header closeButton>

                    <Modal.Title>

                        {

                            category

                                ? "Edit"

                                : "Create"

                        }

                        {" "}

                        Category

                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Name

                        </Form.Label>

                        <Form.Control

                            value={form.name}

                            onChange={(e) =>

                                setForm({

                                    ...form,

                                    name: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Description

                        </Form.Label>

                        <Form.Control

                            as="textarea"

                            rows={3}

                            value={form.description}

                            onChange={(e) =>

                                setForm({

                                    ...form,

                                    description: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Image URL

                        </Form.Label>

                        <Form.Control

                            value={form.image}

                            onChange={(e) =>

                                setForm({

                                    ...form,

                                    image: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={handleClose}
                    >

                        Cancel

                    </Button>

                    <Button
                        type="submit"
                    >

                        Save

                    </Button>

                </Modal.Footer>

            </Form>

        </Modal>

    );

};

export default CategoryModal;