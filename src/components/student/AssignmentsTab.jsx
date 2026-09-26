import React from "react";
import { CalendarDays, FileText } from "lucide-react";
import Button from "../ui/Button";

const statusFilters = ["All", "Pending", "Submitted"];
const filterBadgeClassNames = {
    All: "bg-[var(--outline-button-hover-background)] text-[var(--brand-primary-color)]",
    Pending: "bg-[var(--stat-icon-amber-background-color)] text-[var(--warning-color)]",
    Submitted: "bg-[var(--stat-icon-green-background-color)] text-[var(--success-color)]",
};

export default function AssignmentsTab({
    assignments,
    selectedFilter,
    filterCounts,
    onFilterChange,
    onViewDetails,
    getAssignmentStatus,
    formatDueDate,
    sidebarOpen,
}) {
    const visibleAssignments = assignments.filter((assignment) => {
        const status = getAssignmentStatus(assignment).label;
        if (selectedFilter === "All") {
            return true;
        }
        if (selectedFilter === "Pending") {
            return status === "Pending";
        }
        return status === selectedFilter;
    });

    const handleFilterChange = (event) => {
        onFilterChange(event.currentTarget.dataset.filter);
    };

    return (
        <main
            className={`min-w-0 space-y-4 px-4 py-5 transition-all duration-200 ease-in-out md:px-7 md:py-7 ${sidebarOpen ? "lg:ml-60" : "lg:ml-20"}`}
        >
            <header>
                <h1 className="welcome-title text-3xl">Assignments</h1>
                <p className="welcome-sub">
                    View all your assignments and submit your work.
                </p>
            </header>

            <div
                className="grid grid-cols-2 gap-2 md:grid-cols-4"
                role="group"
                aria-label="Filter assignments by status"
            >
                {statusFilters.map((filter) => {
                    const isSelected = selectedFilter === filter;
                    return (
                        <Button
                            variant="plain"
                            key={filter}
                            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 ${isSelected ? "border border-[var(--brand-primary-color)] bg-[var(--panel-background-color)] font-semibold text-[var(--brand-primary-color)]" : "border-[var(--border-color)] bg-[var(--panel-background-color)] text-[var(--muted-text-color)] hover:bg-[var(--outline-button-hover-background)] hover:text-[var(--brand-primary-color)]"}`}
                            data-filter={filter}
                            onClick={handleFilterChange}
                            aria-pressed={isSelected}
                        >
                            <span>{filter}</span>
                            <span
                                className={`rounded-full px-2 py-0.5 text-xs ${filterBadgeClassNames[filter]}`}
                            >
                                {filterCounts[filter]}
                            </span>
                        </Button>
                    );
                })}
            </div>

            <section
                className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--panel-background-color)] p-2 shadow-sm md:p-3"
                aria-label="Assignment list"
            >
                <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full min-w-[900px] table-fixed border-collapse text-left text-sm">
                        <colgroup>
                            <col className="w-[5%]" />
                            <col className="w-[37%]" />
                            <col className="w-[14%]" />
                            <col className="w-[17%]" />
                            <col className="w-[13%]" />
                            <col className="w-[14%]" />
                        </colgroup>
                        <thead className="bg-[var(--table-header-background-color)]">
                            <tr className="border-b border-[var(--border-color)] text-[var(--assignment-title-color)]">
                                <th className="px-3 py-3 font-semibold">#</th>
                                <th className="px-3 py-3 font-semibold">
                                    Assignment
                                </th>
                                <th className="px-3 py-3 font-semibold">
                                    Subject
                                </th>
                                <th className="px-3 py-3 font-semibold">
                                    Due Date
                                </th>
                                <th className="px-3 py-3 font-semibold">
                                    Status
                                </th>
                                <th className="px-3 py-3 font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleAssignments.map((assignment, index) => {
                                const status = getAssignmentStatus(assignment);
                                return (
                                    <tr
                                        key={assignment.id}
                                        className="border-b border-[var(--border-color)] transition-opacity last:border-0 hover:opacity-95"
                                    >
                                        <td className="px-3 py-4 font-medium">
                                            {index + 1}
                                        </td>
                                        <td className="px-3 py-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span className="stat-icon grid flex-none place-items-center">
                                                    <FileText
                                                        size={19}
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                                <div className="min-w-0">
                                                    <h2 className="asgn-card-title m-0 truncate">
                                                        {assignment.title}
                                                    </h2>
                                                    <p className="asgn-card-desc mt-1 line-clamp-2">
                                                        {assignment.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 text-[var(--assignment-meta-color)]">
                                            {assignment.subject}
                                        </td>
                                        <td className="px-3 py-4">
                                            <span className="inline-flex items-center gap-2 whitespace-nowrap text-[var(--assignment-meta-color)]">
                                                <CalendarDays
                                                    size={17}
                                                    aria-hidden="true"
                                                />
                                                {formatDueDate(
                                                    assignment.dueDate,
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4">
                                            <span
                                                className={`badge ${status.className}`}
                                            >
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4">
                                            <Button
                                                variant="outline"
                                                className="inline-flex h-10 w-[112px] items-center justify-center rounded-lg px-3 text-sm"
                                                onClick={onViewDetails}
                                                data-assignment-id={
                                                    assignment.id
                                                }
                                            >
                                                View Details
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-3 p-1 lg:hidden">
                    {visibleAssignments.map((assignment, index) => {
                        const status = getAssignmentStatus(assignment);
                        return (
                            <article
                                key={assignment.id}
                                className="rounded-lg border border-[var(--border-color)] bg-[var(--secondary-panel-background-color)] p-3"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="stat-icon grid flex-none place-items-center">
                                        <FileText
                                            size={19}
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <p className="stat-label mb-1">
                                                    Assignment {index + 1}
                                                </p>
                                                <h2 className="asgn-card-title m-0 break-words">
                                                    {assignment.title}
                                                </h2>
                                            </div>
                                            <span
                                                className={`badge ${status.className}`}
                                            >
                                                {status.label}
                                            </span>
                                        </div>
                                        <p className="asgn-card-desc mt-2">
                                            {assignment.description}
                                        </p>
                                        <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                                            <p className="m-0 text-[var(--assignment-meta-color)]">
                                                <span className="font-semibold">
                                                    Subject:
                                                </span>
                                                {" "}
                                                {assignment.subject}
                                            </p>
                                            <p className="m-0 inline-flex items-center gap-2 text-[var(--assignment-meta-color)]">
                                                <CalendarDays
                                                    size={15}
                                                    aria-hidden="true"
                                                />
                                                Due {formatDueDate(
                                                    assignment.dueDate,
                                                )}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg px-3 text-sm"
                                            onClick={onViewDetails}
                                            data-assignment-id={assignment.id}
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {visibleAssignments.length === 0 && (
                    <p className="empty-state px-3 py-10 text-center">
                        No assignments match this filter.
                    </p>
                )}
            </section>
        </main>
    );
}
