import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import GuestRoute from "../components/auth/GuestRoute";
import ProjectPage from "../pages/ProjectPage";
import CreateProjectPage from "../pages/CreateProjectPage";
import ProjectDetail from "../pages/ProjectDetail";
import EditProjectPage from "../pages/EditProjectPage";
import ScrumBoardPage from "../pages/ScrumBoardPage";
import BacklogPage from "../pages/BacklogPage";
import SprintPage from "../pages/SprintPage";
import ProjectMembersPage from '../pages/ProjectMembersPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import Notifications from '../pages/Notifications';
import DocumentsPage from '../pages/DocumentsPage';
const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route element={<GuestRoute />}>
                    <Route element={<AuthLayout />}> 
                        <Route path="/login" element={<Login />} /> 
                        <Route path="/register" element={<Register />} /> 
                    </Route>
                </Route>
                <Route element={<ProtectedRoute/>}>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/projects" element={<ProjectPage />} />
                    <Route path="/projects/create" element={<CreateProjectPage />} />
                    <Route path="/projects/:id" element={<ProjectDetail />}/>
                    <Route path="/projects/:id/edit" element={<EditProjectPage />}/>
                    <Route path="/projects/:id/board" element={<ScrumBoardPage />} />
                    <Route path="/projects/:id/backlog" element={<BacklogPage />} />
                    <Route path="/projects/:id/sprints" element={<SprintPage />}/>
                    <Route path="/projects/:id/members" element={<ProjectMembersPage />}/>
                    <Route path="/profile" element={<ProfilePage />}/>
                    <Route path="/settings" element={<SettingsPage />}/>
                    <Route path="/notifications" element={<Notifications />}/>
                    <Route path="/projects/:id/documents"element={<DocumentsPage />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
export default AppRoutes;


