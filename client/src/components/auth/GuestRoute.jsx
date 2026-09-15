import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";

const GuestRoute = () => {
    // Đã đăng nhập → không cho truy cập Login/Register
    if (isAuthenticated()) {
        return <Navigate to="/dashboard" replace />;
    }

    // Chưa đăng nhập → cho phép truy cập
    return <Outlet />;
};

export default GuestRoute;

