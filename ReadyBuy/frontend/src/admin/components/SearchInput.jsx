import Form from "react-bootstrap/Form";

const SearchInput = ({
    value,
    onChange,
    placeholder = "Search...",
}) => {

    return (

        <Form.Control
            value={value}
            placeholder={placeholder}
            onChange={(e) =>
                onChange(
                    e.target.value
                )
            }
        />

    );

};

export default SearchInput;