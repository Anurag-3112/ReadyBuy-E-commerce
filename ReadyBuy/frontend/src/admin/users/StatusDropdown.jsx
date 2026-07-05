import Form from "react-bootstrap/Form";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { toast } from "react-toastify";

import {
    updateUserStatus,
} from "../services/user.admin.service";

const StatusDropdown = ({
    user,
}) => {

    const queryClient =
        useQueryClient();

    const mutation =
        useMutation({

            mutationFn: (status) =>

                updateUserStatus(

                    user.id,

                    status

                ),

            onSuccess: () => {

                toast.success(

                    "Status updated."

                );

                queryClient.invalidateQueries({

                    queryKey: ["users"]

                });

            },

            onError: () => {

                toast.error(

                    "Unable to update status."

                );

            }

        });

    return (

        <Form.Select

            size="sm"

            value={user.status}

            disabled={
                mutation.isPending
            }

            onChange={(e) =>

                mutation.mutate(

                    e.target.value

                )

            }

        >

            <option value="ACTIVE">

                ACTIVE

            </option>

            <option value="BLOCKED">

                BLOCKED

            </option>

        </Form.Select>

    );

};

export default StatusDropdown;