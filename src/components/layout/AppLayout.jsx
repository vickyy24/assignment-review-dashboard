import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({
    navigationItems,
    activeSection,
    onNavigate,
    sidebarOpen,
    mobileNavOpen,
    onToggleSidebar,
    onOpenMobile,
    onCloseMobile,
    search,
    onSearchChange,
    searchPlaceholder,
    onNotificationClick,
    notificationLabel,
    roleLabel,
    children,
}) {
    return (
        <div className="student-app page-root min-h-screen bg-[var(--page-background-color)] text-[var(--assignment-title-color)]">
            <Sidebar
                navigationItems={navigationItems}
                activeSection={activeSection}
                onNavigate={onNavigate}
                sidebarOpen={sidebarOpen}
                mobileNavOpen={mobileNavOpen}
                onToggleSidebar={onToggleSidebar}
                onCloseMobile={onCloseMobile}
                roleLabel={roleLabel}
            />
            <Topbar
                sidebarOpen={sidebarOpen}
                onOpenMobile={onOpenMobile}
                search={search}
                onSearchChange={onSearchChange}
                searchPlaceholder={searchPlaceholder}
                onNotificationClick={onNotificationClick}
                notificationLabel={notificationLabel}
            />
            {children}
        </div>
    );
}
