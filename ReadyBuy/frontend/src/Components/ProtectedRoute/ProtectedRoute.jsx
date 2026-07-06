import {
    Navigate,
} from "react-router-dom";

import {
    useContext,
} from "react";

import {
    AuthContext,
} from "../../Context/AuthContext";

const ProtectedRoute = ({
    children,
}) => {

    const {
        isAuthenticated,
        loading,
    } = useContext(AuthContext);

    if (loading)
        return <h2>Loading...</h2>;

    if (!isAuthenticated)
        return (
            <Navigate
                to="/login"
                replace
            />
        );

    return children;
};

export default ProtectedRoute;