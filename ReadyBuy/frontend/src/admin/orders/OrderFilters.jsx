import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import FilterBar from "../components/FilterBar";
import SearchInput from "../components/SearchInput";

const OrderFilters = ({
    search,
    setSearch,
    status,
    setStatus,
}) => {

    const resetFilters = () => {

        setSearch("");

        setStatus("");

    };

    return (

        <FilterBar>

            <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by Order ID, Customer..."
            />

            <Form.Select
                value={status}
                onChange={(e) =>
                    setStatus(e.target.value)
                }
            >

                <option value="">
                    All Status
                </option>

                <option value="PENDING">
                    Pending
                </option>

                <option value="PAID">
                    Paid
                </option>

                <option value="SHIPPED">
                    Shipped
                </option>

                <option value="DELIVERED">
                    Delivered
                </option>

                <option value="CANCELLED">
                    Cancelled
                </option>

            </Form.Select>

            <Button
                variant="secondary"
                className="w-100"
                onClick={resetFilters}
            >

                Reset Filters

            </Button>

        </FilterBar>

    );

};

export default OrderFilters;