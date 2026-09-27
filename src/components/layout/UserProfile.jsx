import React from "react";

export default function UserProfile({ user, collapsed = false }) {
    return (
        <div
            className={`student-sidebar-profile flex items-center ${collapsed ? "justify-center" : "gap-3"}`}
        >
            <div className="user-avatar grid flex-none place-items-center">
                {user.name.charAt(0)}
            </div>
            <div className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : "lg:block"}`}>
                <p className="user-name m-0 truncate">{user.name}</p>
                <p className="user-email m-0 truncate">{user.email}</p>
            </div>
        </div>
    );
}
