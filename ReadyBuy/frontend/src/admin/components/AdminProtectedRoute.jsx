import { Navigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../../Context/AuthContext";

const AdminProtectedRoute = ({
    children,
}) => {

    const {

        user,

        loading,

    } = useContext(AuthContext);

    if (loading)
        return <h2>Loading...</h2>;

    if (!user)
        return (
            <Navigate
                to="/login"
                replace
            />
        );

    if (user.role !== "ADMIN")
        return (
            <Navigate
                to="/"
                replace
            />
        );

    return children;

};

export default AdminProtectedRoute;