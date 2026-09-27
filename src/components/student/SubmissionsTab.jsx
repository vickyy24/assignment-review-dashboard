import React, { useState } from "react";
import { CalendarDays, FileText } from "lucide-react";
import Button from "../ui/Button";

export default function SubmissionsTab({
    assignments,
    onViewDetails,
    onSubmitAssignment,
    formatDueDate,
    sidebarOpen,
}) {
    const [subjectFilter, setSubjectFilter] = useState("All Subjects");
    const subjects = [
        "All Subjects",
        ...new Set(assignments.map((assignment) => assignment.subject)),
    ];
    const filteredAssignments = assignments.filter((assignment) => {
        return (
            subjectFilter === "All Subjects" ||
            assignment.subject === subjectFilter
        );
    });

    const handleViewDetails = (event) => {
        onViewDetails(event.currentTarget.dataset.assignmentId);
    };

    const handleSubmitAssignment = (event) => {
        onSubmitAssignment(event.currentTarget.dataset.assignmentId);
    };

    return (
        <main
            className={`min-w-0 space-y-4 px-4 py-5 transition-all duration-200 ease-in-out md:px-7 md:py-7 ${sidebarOpen ? "lg:ml-60" : "lg:ml-20"}`}
        >
            <header>
                <h1 className="welcome-title text-3xl">Submissions</h1>
                <p className="welcome-sub">Submit your assignments before the due date.</p>
            </header>

            <section className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--panel-background-color)] p-3 md:p-4">
                <div className="mb-3 flex justify-start">
                    <select
                        className="field-input w-full max-w-sm"
                        value={subjectFilter}
                        onChange={(event) => setSubjectFilter(event.target.value)}
                        aria-label="Filter submissions by subject"
                    >
                        {subjects.map((subject) => (
                            <option key={subject}>{subject}</option>
                        ))}
                    </select>
                </div>

                <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full min-w-[900px] table-fixed border-collapse text-left text-sm">
                        <colgroup>
                            <col className="w-[4%]" />
                            <col className="w-[29%]" />
                            <col className="w-[18%]" />
                            <col className="w-[13%]" />
                            <col className="w-[15%]" />
                            <col className="w-[21%]" />
                        </colgroup>
                        <thead className="bg-[var(--table-header-background-color)]">
                            <tr className="border-b border-[var(--border-color)]">
                                <th className="px-3 py-3 font-semibold">#</th>
                                <th className="px-3 py-3 font-semibold">Assignment</th>
                                <th className="px-3 py-3 font-semibold">Subject</th>
                                <th className="px-3 py-3 font-semibold">Due Date</th>
                                <th className="px-3 py-3 font-semibold">Status</th>
                                <th className="px-3 py-3 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssignments.map((assignment, index) => {
                                const isSubmitted = assignment.mySubmission?.submitted;
                                return (
                                    <tr className="border-b border-[var(--border-color)] last:border-0" key={assignment.id}>
                                        <td className="px-3 py-4">{index + 1}</td>
                                        <td className="px-3 py-4">
                                            <div className="min-w-0">
                                                <p className="m-0 font-semibold">{assignment.title}</p>
                                                <p className="meta-item mt-1 line-clamp-2">{assignment.description}</p>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4">{assignment.subject}</td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-2">
                                                <CalendarDays size={16} aria-hidden="true" />
                                                {formatDueDate(assignment.dueDate)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4">
                                            <span className={`badge ${isSubmitted ? "badge-green" : "badge-amber"}`}>
                                                {isSubmitted ? "Submitted" : "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4">
                                            <div className="flex items-center gap-2">
                                                {isSubmitted ? (
                                                    <Button
                                                        variant="outline"
                                                        className="inline-flex h-9 min-w-24 items-center justify-center rounded-md px-3 text-xs"
                                                        data-assignment-id={assignment.id}
                                                        onClick={handleViewDetails}
                                                    >
                                                        View
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="primary"
                                                        className="inline-flex h-9 min-w-24 items-center justify-center rounded-md px-3 text-xs"
                                                        data-assignment-id={assignment.id}
                                                        onClick={handleSubmitAssignment}
                                                    >
                                                        Submit
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-3 lg:hidden">
                    {filteredAssignments.map((assignment, index) => {
                        const isSubmitted = assignment.mySubmission?.submitted;
                        return (
                            <article
                                className="rounded-lg border border-[var(--border-color)] bg-[var(--secondary-panel-background-color)] p-3 sm:p-4"
                                key={assignment.id}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-start gap-2.5">
                                        <span className="stat-icon grid flex-none place-items-center">
                                            <FileText size={18} aria-hidden="true" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="stat-label mb-1">Assignment {index + 1}</p>
                                            <h2 className="asgn-card-title m-0 break-words">
                                                {assignment.title}
                                            </h2>
                                        </div>
                                    </div>
                                    <span className={`badge flex-none ${isSubmitted ? "badge-green" : "badge-amber"}`}>
                                        {isSubmitted ? "Submitted" : "Pending"}
                                    </span>
                                </div>
                                <p className="asgn-card-desc mt-2 break-words">
                                    {assignment.description}
                                </p>
                                <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                                    <p className="m-0 break-words text-[var(--assignment-meta-color)]">
                                        <span className="font-semibold">Subject:</span>{" "}
                                        {assignment.subject}
                                    </p>
                                    <p className="m-0 inline-flex items-center gap-2 text-[var(--assignment-meta-color)]">
                                        <CalendarDays size={15} aria-hidden="true" />
                                        Due {formatDueDate(assignment.dueDate)}
                                    </p>
                                </div>
                                <div className="mt-3 flex justify-end">
                                    {isSubmitted ? (
                                        <Button
                                            variant="outline"
                                            className="inline-flex h-9 min-w-24 items-center justify-center rounded-md px-3 text-xs"
                                            data-assignment-id={assignment.id}
                                            onClick={handleViewDetails}
                                        >
                                            View
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            className="inline-flex h-9 min-w-24 items-center justify-center rounded-md px-3 text-xs"
                                            data-assignment-id={assignment.id}
                                            onClick={handleSubmitAssignment}
                                        >
                                            Submit
                                        </Button>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>

                {filteredAssignments.length === 0 && (
                    <p className="empty-state py-8 text-center">No assignments match this subject.</p>
                )}
            </section>
        </main>
    );
}
