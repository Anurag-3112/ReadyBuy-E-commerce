import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import FilterBar from "../components/FilterBar";
import SearchInput from "../components/SearchInput";

const UserFilters = ({
    search,
    setSearch,
    role,
    setRole,
    status,
    setStatus,
}) => {

    const resetFilters = () => {

        setSearch("");

        setRole("");

        setStatus("");

    };

    return (

        <FilterBar>

            <SearchInput

                value={search}

                onChange={setSearch}

                placeholder="Search users..."

            />

            <Form.Select

                value={role}

                onChange={(e) =>

                    setRole(
                        e.target.value
                    )

                }

            >

                <option value="">

                    All Roles

                </option>

                <option value="ADMIN">

                    Admin

                </option>

                <option value="USER">

                    User

                </option>

            </Form.Select>

            <Form.Select

                value={status}

                onChange={(e) =>

                    setStatus(
                        e.target.value
                    )

                }

            >

                <option value="">

                    All Status

                </option>

                <option value="ACTIVE">

                    Active

                </option>

                <option value="BLOCKED">

                    Blocked

                </option>

            </Form.Select>

            <Button

                variant="secondary"

                className="w-100"

                onClick={resetFilters}

            >

                Reset

            </Button>

        </FilterBar>

    );

};

export default UserFilters;