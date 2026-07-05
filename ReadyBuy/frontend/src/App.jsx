import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppNavbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

import Shop from "./Pages/Shop";
import ShopCateogory from "./Pages/ShopCateogory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import OrderSuccess from "./Pages/OrderSuccess";
import LoginSignUp from "./Pages/LoginSignUp";
import MyOrders from "./Pages/MyOrders";
import OrderDetails from "./Pages/OrderDetails";

import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

import men_banner from "./Components/assets/man_banner.png";
import women_banner from "./Components/assets/woman_banner.png";
import kids_banner from "./Components/assets/kids_banner.png";

import AdminRoutes from "./admin/routes/AdminRoutes";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";

function StoreLayout() {
  return (
    <>
      <AppNavbar />

      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/men" element={<ShopCateogory banner={men_banner} category="men" />} />
        <Route path="/women" element={<ShopCateogory banner={women_banner} category="women" />} />
        <Route path="/kids" element={<ShopCateogory banner={kids_banner} category="kids" />} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminProtectedRoute> <AdminRoutes /> </AdminProtectedRoute>} />
        <Route path="/*" element={<StoreLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;