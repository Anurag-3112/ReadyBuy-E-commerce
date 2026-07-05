import Form from "react-bootstrap/Form";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { toast } from "react-toastify";

import {
    updateUserRole,
} from "../services/user.admin.service";

const RoleDropdown = ({ user }) => {

    const queryClient =
        useQueryClient();

    const mutation =
        useMutation({

            mutationFn: (role) =>

                updateUserRole(

                    user.id,

                    role

                ),

            onSuccess: () => {

                toast.success(

                    "Role updated."

                );

                queryClient.invalidateQueries({

                    queryKey: ["users"]

                });

            },

            onError: () => {

                toast.error(

                    "Unable to update role."

                );

            }

        });

    return (

        <Form.Select

            size="sm"

            value={user.role}

            disabled={
                mutation.isPending
            }

            onChange={(e) =>

                mutation.mutate(

                    e.target.value

                )

            }

        >

            <option value="USER">

                USER

            </option>

            <option value="ADMIN">

                ADMIN

            </option>

        </Form.Select>

    );

};

export default RoleDropdown;