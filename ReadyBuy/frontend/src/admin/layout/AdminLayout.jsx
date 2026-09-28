import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const HEADER_HEIGHT = 70;

const AdminLayout = () => {
    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "#f8f9fa" }}>
            <Header />
            <div style={{ flex: 1, display: "flex", overflow: "hidden", height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
                <aside style={{ width: "250px", flexShrink: 0, overflowY: "auto", background: "#212529" }}>
                    <Sidebar />
                </aside>
                <main style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;