import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown, LayoutDashboard, LogOut, Menu, Moon, Sun, X } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout, theme, toggleTheme } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle = () => setMenuOpen((isOpen) => !isOpen);

  return (
    <header className="navbar sticky top-0 z-10">
      <div className="mx-auto flex h-[70px] max-w-[1200px] items-center justify-between px-7 max-md:px-4">
        {/* Logo */}
        <div className="flex items-center gap-[11px]">
          <div className="navbar-logo grid place-items-center" aria-hidden="true">
            <LayoutDashboard size={19} strokeWidth={2} />
          </div>
          <span className="navbar-appname">EduBoard</span>
          <span className={`navbar-badge navbar-badge-${currentUser.role}`}>
            {currentUser.role === 'admin' ? 'Professor' : 'Student'}
          </span>
        </div>

        {/* Desktop user info */}
        <div className="hidden sm:flex max-sm:hidden items-center gap-[10px]">
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--panel-background-color)] px-2 py-1.5">
            <div className="user-avatar grid place-items-center">{currentUser.avatar}</div>
            <div className="user-info">
              <p className="user-name m-0">{currentUser.name}</p>
              <p className="user-email m-0">{currentUser.email}</p>
            </div>
            <ChevronDown size={16} aria-hidden="true" />
          </div>
          <button className="theme-toggle inline-flex items-center justify-center gap-[7px]" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
            <span>{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
          </button>
          <button
            className="btn-logout inline-flex items-center justify-center gap-2"
            onClick={logout}
            aria-label="Sign out"
          >
            <LogOut size={16} aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar-hamburger block sm:hidden"
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar-mobile-menu block sm:hidden px-5 pt-3.5 pb-[18px]">
          <div className="mobile-user flex items-center gap-[10px]">
            <div className="user-avatar grid place-items-center">{currentUser.avatar}</div>
            <div>
              <p className="user-name m-0">{currentUser.name}</p>
              <p className="user-email m-0">{currentUser.email}</p>
            </div>
          </div>
          <button className="theme-toggle theme-toggle-mobile inline-flex items-center justify-center gap-[7px]" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
            <span>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</span>
          </button>
          <button className="btn-logout btn-logout-mobile inline-flex items-center justify-center gap-2 w-full mt-3.5" onClick={logout}>
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
