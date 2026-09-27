import React from "react";
import { ChevronLeft, ChevronRight, LogOut, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import UserProfile from "./UserProfile";

export default function Sidebar({
    navigationItems,
    activeSection,
    onNavigate,
    sidebarOpen,
    mobileNavOpen,
    onToggleSidebar,
    onCloseMobile,
    roleLabel,
}) {
    const { currentUser, logout } = useApp();

    return (
        <>
            {mobileNavOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-20 bg-slate-950/45 backdrop-blur-[1px] lg:hidden"
                    onClick={onCloseMobile}
                    aria-label="Close navigation menu"
                />
            )}
            <aside
                id="app-navigation-drawer"
                className={`z-30 ${mobileNavOpen ? "fixed inset-y-0 left-0 flex w-72 max-w-[85vw] shadow-2xl" : "hidden"} min-w-0 flex-col border-r border-[var(--border-color)] bg-gradient-to-b from-[var(--secondary-panel-background-color)] to-[var(--panel-background-color)] transition-all duration-200 ease-in-out lg:z-10 lg:flex lg:fixed lg:inset-y-0 lg:left-0 ${sidebarOpen ? "lg:w-60" : "lg:w-20"}`}
            >
                <div
                    className={`flex h-[70px] flex-none items-center ${sidebarOpen ? "justify-between px-5" : "justify-center px-3"}`}
                >
                    <a href="#" className="flex min-w-0 items-center gap-3" aria-label="EduBoard home">
                        <img className="h-9 w-9 flex-none object-contain" src="/eduboard-mark.svg" alt="" />
                        <span className={`navbar-appname truncate ${sidebarOpen ? "lg:inline" : "lg:hidden"}`}>EduBoard</span>
                    </a>
                    <button
                        className="theme-toggle sidebar-collapse-toggle hidden h-9 w-9 flex-none items-center justify-center p-0 lg:inline-flex"
                        type="button"
                        onClick={onToggleSidebar}
                        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                        title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {sidebarOpen ? <ChevronLeft className="text-[var(--brand-primary-color)]" size={18} aria-hidden="true" /> : <ChevronRight className="text-[var(--brand-primary-color)]" size={18} aria-hidden="true" />}
                    </button>
                    <button
                        className="theme-toggle ml-auto inline-flex h-9 w-9 flex-none items-center justify-center p-0 lg:hidden"
                        type="button"
                        onClick={onCloseMobile}
                        aria-label="Close navigation menu"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                <nav className="flex min-w-0 flex-1 flex-col gap-2 overflow-y-auto px-3 pb-3 pt-3 lg:overflow-visible lg:px-3" aria-label={`${roleLabel} navigation`}>
                    {navigationItems.map(({ label, target, Icon }) => (
                        <button
                            key={target}
                            type="button"
                            data-target={target}
                            onClick={(event) => {
                                onNavigate(event);
                                onCloseMobile();
                            }}
                            aria-current={activeSection === target ? "page" : undefined}
                            title={sidebarOpen ? undefined : label}
                            className={`flex w-full min-w-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200 lg:flex-none lg:gap-3 ${sidebarOpen ? "" : "lg:justify-center"} ${activeSection === target ? "bg-gradient-to-r from-[var(--primary-button-background)] to-[var(--primary-button-end-background)] font-semibold text-white shadow-sm" : "text-[var(--muted-text-color)] hover:translate-x-0.5 hover:bg-[var(--sidebar-item-hover-background-color)] hover:text-[var(--brand-primary-color)]"}`}
                        >
                            <Icon size={18} aria-hidden="true" />
                            <span className={sidebarOpen ? "lg:inline" : "lg:hidden"}>{label}</span>
                        </button>
                    ))}
                </nav>

                <div className="student-sidebar-footer mt-auto">
                    <button
                        className={`student-sidebar-logout inline-flex items-center ${sidebarOpen ? "justify-start gap-3" : "justify-center"}`}
                        type="button"
                        onClick={logout}
                        aria-label="Logout"
                        title="Logout"
                    >
                        <LogOut size={16} aria-hidden="true" />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                    <UserProfile user={currentUser} collapsed={!sidebarOpen} />
                </div>
            </aside>
        </>
    );
}
