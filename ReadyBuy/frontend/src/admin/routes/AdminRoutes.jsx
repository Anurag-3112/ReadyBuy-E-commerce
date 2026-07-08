import { Routes, Route } from "react-router-dom";

import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/Dashboard";
import ProductList from "../products/ProductList";
import OrdersList from "../orders/OrdersList";
import CategoriesList from "../categories/CategoriesList";
import UsersList from "../users/UsersList";
import CouponsList from "../coupons/CouponsList";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="orders" element={<OrdersList />} />
                <Route path="categories" element={<CategoriesList />} />
                <Route path="users" element={<UsersList />} />
                <Route path="coupons" element={<CouponsList />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;