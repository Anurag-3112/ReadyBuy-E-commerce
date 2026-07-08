import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import FilterBar from "../components/FilterBar";
import SearchInput from "../components/SearchInput";

const CouponFilters = ({
    search,
    setSearch,

    status,
    setStatus,

    discountType,
    setDiscountType,
}) => {

    const handleReset = () => {

        setSearch("");

        setStatus("");

        setDiscountType("");

    };

    return (

        <FilterBar>

            <Row className="g-3 align-items-center w-100">

                <Col lg={5} md={12}>

                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Search Coupon Code..."
                    />

                </Col>

                <Col lg={3} md={6}>

                    <Form.Select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="INACTIVE">
                            Inactive
                        </option>

                        <option value="EXPIRED">
                            Expired
                        </option>

                    </Form.Select>

                </Col>

                <Col lg={3} md={6}>

                    <Form.Select
                        value={discountType}
                        onChange={(e) =>
                            setDiscountType(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            All Types
                        </option>

                        <option value="PERCENTAGE">
                            Percentage
                        </option>

                        <option value="FIXED">
                            Fixed
                        </option>

                    </Form.Select>

                </Col>

                <Col lg={1} md={12}>

                    <Button

                        variant="outline-secondary"

                        className="w-100"

                        onClick={handleReset}

                    >

                        Reset

                    </Button>

                </Col>

            </Row>

        </FilterBar>

    );

};

export default CouponFilters;