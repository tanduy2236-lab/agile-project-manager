import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";
const GuestRoute = () => {
    if (isAuthenticated()) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default GuestRoute;

