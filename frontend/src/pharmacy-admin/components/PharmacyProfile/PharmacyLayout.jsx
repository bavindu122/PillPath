import Sidebar from "../Sidebar";
import Header from "../Header";
import { Outlet } from "react-router-dom";

const PharmacyAdminLayout = () => {
    return (
        <div className="flex min-h-screen"><Sidebar />
        <div className="flex flex-col flex-grow"><Header />
        <main className="flex-grow p-4">
            <Outlet />
        </main>
        </div>
        </div>
    );
};

export default PharmacyAdminLayout;



