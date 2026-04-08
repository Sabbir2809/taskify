import AppLayout from "@/components/layouts/AppLayout";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AuditLogsPage from "@/pages/admin/AuditLogsPage";
import UserListPage from "@/pages/admin/UserListPage";
import UserDashboardPage from "@/pages/user/DashboardPage";
import MyTasksPage from "@/pages/user/MyTasksPage";
import ProfilePage from "@/pages/user/ProfilePage";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import RootRedirect from "./RootRedirect";

export const routers = createBrowserRouter([
  // public
  { path: "/login", element: <LoginPage /> },
  // admin
  {
    path: "/admin",
    element: (
      <ProtectedRoute roles={["ADMIN"]}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <AdminDashboardPage /> },
      { path: "audit-logs", element: <AuditLogsPage /> },
      { path: "users", element: <UserListPage /> },
    ],
  },
  // user
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute roles={["USER"]}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <UserDashboardPage /> },
      { path: "my-tasks", element: <MyTasksPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },

  { path: "/", element: <RootRedirect /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);
