import React from "react";

export default function Panel({ title, subtitle, action, icon, children }) {
    return (
        <section className="min-w-0 overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--panel-background-color)] p-4 md:p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    {icon && <span className="stat-icon grid flex-none place-items-center bg-[var(--stat-icon-background-color)] text-[var(--brand-primary-color)]">{icon}</span>}
                    <div>
                        <h2 className="asgn-card-title m-0">{title}</h2>
                        {subtitle && <p className="stat-label mt-1">{subtitle}</p>}
                    </div>
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}
