import React from "react";
import { Bell, ChevronDown, Menu, Moon, Search, Sun } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function Topbar({
    sidebarOpen,
    mobileNavOpen,
    onOpenMobile,
    search,
    onSearchChange,
    searchPlaceholder = "Search assignments...",
    onNotificationClick,
    notificationLabel = "View notifications",
}) {
    const { currentUser, theme, toggleTheme } = useApp();

    return (
        <header className={`navbar sticky top-0 z-10 flex min-w-0 flex-wrap items-center gap-3 border-b border-[var(--border-color)] px-3 py-2 transition-all duration-200 ease-in-out sm:px-4 lg:flex-nowrap lg:px-7 ${sidebarOpen ? "lg:ml-60" : "lg:ml-20"}`}>
            <div className="flex w-full min-w-0 items-center gap-2 lg:hidden">
                <button type="button" className="theme-toggle inline-flex h-9 w-9 flex-none items-center justify-center" onClick={onOpenMobile} aria-label="Open navigation menu" aria-expanded={mobileNavOpen} aria-controls="app-navigation-drawer">
                    <Menu size={19} aria-hidden="true" />
                </button>
                <a href="#dashboard" className="flex min-w-0 items-center gap-2" aria-label="EduBoard dashboard">
                    <img className="h-7 w-7 flex-none object-contain" src="/eduboard-mark.svg" alt="" />
                    <span className="navbar-appname truncate">EduBoard</span>
                </a>
                <div className="ml-auto flex flex-none items-center gap-2">
                    <button type="button" data-target="announcements" className="theme-toggle relative inline-flex h-9 w-9 items-center justify-center" onClick={onNotificationClick} aria-label={notificationLabel} title={notificationLabel}>
                        <Bell className="text-[var(--warning-color)]" size={18} aria-hidden="true" />
                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
                    </button>
                    <ThemeButton theme={theme} toggleTheme={toggleTheme} />
                    <div className="user-avatar grid h-9 w-9 flex-none place-items-center" aria-label={currentUser.name}>{currentUser.name.charAt(0)}</div>
                </div>
            </div>

            <div className="relative order-last flex h-9 w-full min-w-0 items-center lg:order-none lg:flex-1">
                <Search className="search-icon" size={16} aria-hidden="true" />
                <input type="search" className="search-bar h-9 w-full py-2" placeholder={searchPlaceholder} value={search} onChange={onSearchChange} aria-label={searchPlaceholder} />
            </div>
            <div className="hidden flex-none items-center gap-3 lg:flex">
                <button type="button" data-target="announcements" className="theme-toggle relative inline-flex h-9 w-9 flex-none items-center justify-center" onClick={onNotificationClick} aria-label={notificationLabel} title={notificationLabel}>
                    <Bell className="text-[var(--warning-color)]" size={18} aria-hidden="true" />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
                </button>
                <ThemeButton theme={theme} toggleTheme={toggleTheme} />
                <div className="flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--panel-background-color)] px-1.5 py-1">
                    <div className="user-avatar grid flex-none place-items-center">{currentUser.name.charAt(0)}</div>
                    <div className="min-w-0"><p className="user-name m-0 truncate">{currentUser.name}</p></div>
                    <ChevronDown size={16} aria-hidden="true" />
                </div>
            </div>
        </header>
    );
}

function ThemeButton({ theme, toggleTheme }) {
    return (
        <button type="button" className="theme-toggle inline-flex h-9 w-9 items-center justify-center" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
            {theme === "dark" ? <Sun className="text-[var(--warning-color)]" size={17} aria-hidden="true" /> : <Moon className="text-[var(--brand-primary-color)]" size={17} aria-hidden="true" />}
        </button>
    );
}
