import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function Router() {
    const { currentUser } = useApp();

    if (!currentUser) return <LoginPage />;
    if (currentUser.role === "admin") return <AdminDashboard />;
    return <StudentDashboard />;
}

export default function App() {
    return (
        <AppProvider>
            <Router />
        </AppProvider>
    );
}
