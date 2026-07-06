import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "./Context/AuthContext";
import ShopContextProvider from "./Context/ShopContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ShopContextProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="colored"
        />
      </ShopContextProvider>
    </AuthProvider>
  </QueryClientProvider>
);