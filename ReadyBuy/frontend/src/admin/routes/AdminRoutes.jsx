import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import ProductList from "../products/ProductList";

const AdminRoutes = () => {

    return (

        <Routes>

            <Route
                index
                element={<Dashboard />}
            />

            <Route
                path="products"
                element={
                    <ProductList />
                }
            />

        </Routes>




    );

};

export default AdminRoutes;