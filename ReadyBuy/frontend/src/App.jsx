import './App.css'
import AppNavbar from './Components/Navbar/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import ShopCateogory from './Pages/ShopCateogory'
import Shop from './Pages/Shop'
import Product from './Pages/Product'
import Cart from './Pages/Cart'
import OrderSuccess from './Pages/OrderSuccess'
import LoginSignUp from './Pages/LoginSignUp'
import Footer from './Components/Footer/Footer'
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute"
import MyOrders from "./Pages/MyOrders";
import OrderDetails from "./Pages/OrderDetails";
import Checkout from "./Pages/Checkout";

import men_banner from './Components/assets/man_banner.png'
import women_banner from './Components/assets/woman_banner.png'
import kids_banner from './Components/assets/kids_banner.png'

import AdminRoutes from "./admin/routes/AdminRoutes";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";

import AdminLayout from "./admin/layout/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import ProductsList from "./admin/products/ProductList";
import OrdersList from "./admin/orders/OrdersList";
import CategoriesList from "./admin/categories/CategoriesList";
import AdminRoute from "./admin/components/AdminProtectedRoute";

function App() {
  return (
    <div>
      <BrowserRouter>
        <AppNavbar />
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/men' element={<ShopCateogory banner={men_banner} category='men' />} />
          <Route path='/women' element={<ShopCateogory banner={women_banner} category='women' />} />
          <Route path='/kids' element={<ShopCateogory banner={kids_banner} category='kids' />} />
          <Route path='/product/:slug' element={<Product />} />
          <Route path="/cart" element={<ProtectedRoute> <Cart /> </ProtectedRoute>} />
          <Route path="/order-success" element={<ProtectedRoute> <OrderSuccess /> </ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute> <MyOrders /> </ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute> <OrderDetails /> </ProtectedRoute>} />
          <Route path='/login' element={<LoginSignUp />} />
          <Route path="/admin/*" element={<AdminProtectedRoute> <AdminRoutes /> </AdminProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute> <Checkout /> </ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute> <AdminLayout /> </AdminRoute>} >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="orders" element={<OrdersList />} />
            <Route path="categories" element={<CategoriesList />} />
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App