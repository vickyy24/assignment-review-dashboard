import React, { useState } from "react";
import { ChevronRight, FileText } from "lucide-react";
import Button from "../ui/Button";

const statusOptions = [
    "All Statuses",
    "Submitted",
    "Pending",
];

function formatSubmissionDate(date) {
    if (!date) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

function getProgressColor(status) {
    if (status === "Submitted") {
        return "bg-[var(--success-color)]";
    }
    if (status === "Pending") {
        return "bg-[var(--warning-color)]";
    }
    return "bg-[var(--progress-track-background-color)]";
}

function AssignmentProgress({ assignment, status }) {
    const percent = assignment.mySubmission?.submitted ? 100 : 0;
    const showPendingMarker = percent === 0 && status.label === "Pending";

    return (
        <div className="flex min-w-24 items-center gap-2">
            <div
                className="relative h-2 min-w-12 flex-1 overflow-hidden rounded-full bg-[var(--progress-track-background-color)]"
                role="progressbar"
                aria-label={`${assignment.title} completion`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
            >
                <div
                    className={`h-full rounded-full transition-all duration-300 ${percent ? getProgressColor(status.label) : "bg-transparent"}`}
                    style={{ width: `${percent}%` }}
                />
                {showPendingMarker && (
                    <span
                        className={`absolute left-0 top-0 h-2 w-2 rounded-full ${getProgressColor(status.label)}`}
                        aria-hidden="true"
                    />
                )}
            </div>
            <span className="min-w-9 text-right text-xs text-[var(--muted-text-color)]">
                {percent}%
            </span>
        </div>
    );
}

function getSubjectSummaries(assignments, getAssignmentStatus) {
    const groups = assignments.reduce((subjects, assignment) => {
        if (!subjects[assignment.subject]) {
            subjects[assignment.subject] = {
                name: assignment.subject,
                assignments: [],
                submitted: 0,
                pending: 0,
            };
        }

        const group = subjects[assignment.subject];
        const status = getAssignmentStatus(assignment).label;
        group.assignments.push(assignment);

        if (status === "Submitted") {
            group.submitted += 1;
        } else {
            group.pending += 1;
        }

        return subjects;
    }, {});

    return Object.values(groups);
}

export default function ProgressTab({
    assignments,
    getAssignmentStatus,
    onViewDetails,
    sidebarOpen,
}) {
    const [view, setView] = useState("assignment");
    const [subjectFilter, setSubjectFilter] = useState("All Subjects");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const subjects = [
        "All Subjects",
        ...new Set(assignments.map((assignment) => assignment.subject)),
    ];
    const filteredAssignments = assignments.filter((assignment) => {
        const matchesSubject =
            subjectFilter === "All Subjects" ||
            assignment.subject === subjectFilter;
        const matchesStatus =
            statusFilter === "All Statuses" ||
            getAssignmentStatus(assignment).label === statusFilter;

        return matchesSubject && matchesStatus;
    });
    const subjectSummaries = getSubjectSummaries(
        filteredAssignments,
        getAssignmentStatus,
    );

    const handleSubjectChange = (event) => {
        setSubjectFilter(event.target.value);
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const handleViewDetails = (event) => {
        onViewDetails(event.currentTarget.dataset.assignmentId);
    };

    const handleOpenSubject = (subject) => {
        setSubjectFilter(subject);
        setStatusFilter("All Statuses");
        setView("assignment");
    };

    const handleOpenSubjectClick = (event) => {
        handleOpenSubject(event.currentTarget.dataset.subject);
    };

    return (
        <main
            className={`min-w-0 space-y-4 px-4 py-5 transition-all duration-200 ease-in-out md:px-7 md:py-7 ${sidebarOpen ? "lg:ml-60" : "lg:ml-20"}`}
        >
            <header>
                <h1 className="welcome-title text-3xl">Progress</h1>
                <p className="welcome-sub">
                    Track your assignment completion status.
                </p>
            </header>

            <section className="flex flex-col gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--panel-background-color)] p-3 md:flex-row md:items-end md:justify-between md:p-4">
                <div
                    className="grid grid-cols-2 rounded-lg border border-[var(--border-color)] p-1 md:w-[330px]"
                    role="group"
                    aria-label="Choose progress view"
                >
                    <Button
                        variant="plain"
                        className={`inline-flex min-h-10 items-center justify-center rounded-md px-3 text-sm transition-colors ${view === "assignment" ? "border border-[var(--brand-primary-color)] font-semibold text-[var(--brand-primary-color)]" : "border border-transparent text-[var(--muted-text-color)] hover:text-[var(--assignment-title-color)]"}`}
                        onClick={() => setView("assignment")}
                        aria-pressed={view === "assignment"}
                    >
                        Assignment-wise
                    </Button>
                    <Button
                        variant="plain"
                        className={`inline-flex min-h-10 items-center justify-center rounded-md px-3 text-sm transition-colors ${view === "subject" ? "border border-[var(--brand-primary-color)] font-semibold text-[var(--brand-primary-color)]" : "border border-transparent text-[var(--muted-text-color)] hover:text-[var(--assignment-title-color)]"}`}
                        onClick={() => setView("subject")}
                        aria-pressed={view === "subject"}
                    >
                        Subject-wise
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:w-[440px]">
                    <label className="space-y-1 text-xs font-medium text-[var(--muted-text-color)]">
                        <span className="block">Select Subject</span>
                        <select
                            className="field-input h-10 py-2 text-sm"
                            value={subjectFilter}
                            onChange={handleSubjectChange}
                        >
                            {subjects.map((subject) => (
                                <option key={subject}>{subject}</option>
                            ))}
                        </select>
                    </label>
                    <label className="space-y-1 text-xs font-medium text-[var(--muted-text-color)]">
                        <span className="block">Select Status</span>
                        <select
                            className="field-input h-10 py-2 text-sm"
                            value={statusFilter}
                            onChange={handleStatusChange}
                        >
                            {statusOptions.map((status) => (
                                <option key={status}>{status}</option>
                            ))}
                        </select>
                    </label>
                </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--panel-background-color)] p-2 md:p-3">
                {view === "assignment" ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[860px] table-fixed border-collapse text-left text-sm">
                            <colgroup>
                                <col className="w-[5%]" />
                                <col className="w-[28%]" />
                                <col className="w-[19%]" />
                                <col className="w-[16%]" />
                                <col className="w-[13%]" />
                                <col className="w-[16%]" />
                                <col className="w-[3%]" />
                            </colgroup>
                            <thead className="bg-[var(--table-header-background-color)] text-[var(--assignment-title-color)]">
                                <tr className="border-b border-[var(--border-color)]">
                                    <th className="px-3 py-3 font-semibold">#</th>
                                    <th className="px-3 py-3 font-semibold">Assignment</th>
                                    <th className="px-3 py-3 font-semibold">Subject</th>
                                    <th className="px-3 py-3 font-semibold">Submitted Date</th>
                                    <th className="px-3 py-3 font-semibold">Status</th>
                                    <th className="px-3 py-3 font-semibold">Progress</th>
                                    <th className="px-2 py-3" aria-label="Details" />
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssignments.map((assignment, index) => {
                                    const status = getAssignmentStatus(assignment);
                                    const submitted = assignment.mySubmission?.submitted;

                                    return (
                                        <tr
                                            className="border-b border-[var(--border-color)] transition-opacity last:border-0 hover:opacity-95"
                                            key={assignment.id}
                                        >
                                            <td className="px-3 py-3 font-semibold">{index + 1}</td>
                                            <td className="px-3 py-3">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <span className="stat-icon grid flex-none place-items-center">
                                                        <FileText size={18} aria-hidden="true" />
                                                    </span>
                                                    <span className="truncate font-semibold">{assignment.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3">{assignment.subject}</td>
                                            <td className="whitespace-nowrap px-3 py-3 text-[var(--muted-text-color)]">
                                                {formatSubmissionDate(assignment.mySubmission?.submittedAt)}
                                            </td>
                                            <td className="px-3 py-3">
                                                <span className={`badge whitespace-nowrap ${status.className}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3">
                                                <AssignmentProgress assignment={assignment} status={status} />
                                            </td>
                                            <td className="px-2 py-3">
                                                <Button
                                                    variant="plain"
                                                    className="inline-grid h-8 w-8 place-items-center rounded-md text-[var(--brand-primary-color)] transition-colors hover:text-[var(--assignment-title-color)]"
                                                    data-assignment-id={assignment.id}
                                                    onClick={handleViewDetails}
                                                    aria-label={`View ${assignment.title}`}
                                                >
                                                    <ChevronRight size={18} aria-hidden="true" />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {!filteredAssignments.length && (
                            <p className="empty-state">No assignments match these filters.</p>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] table-fixed border-collapse text-left text-sm">
                            <colgroup>
                                <col className="w-[5%]" />
                                <col className="w-[31%]" />
                                <col className="w-[15%]" />
                                <col className="w-[15%]" />
                                <col className="w-[15%]" />
                                <col className="w-[19%]" />
                            </colgroup>
                            <thead className="bg-[var(--table-header-background-color)] text-[var(--assignment-title-color)]">
                                <tr className="border-b border-[var(--border-color)]">
                                    <th className="px-3 py-3 font-semibold">#</th>
                                    <th className="px-3 py-3 font-semibold">Subject</th>
                                    <th className="px-3 py-3 font-semibold">Assignments</th>
                                    <th className="px-3 py-3 font-semibold">Submitted</th>
                                    <th className="px-3 py-3 font-semibold">Remaining</th>
                                    <th className="px-3 py-3 font-semibold">Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjectSummaries.map((summary, index) => {
                                    const total = summary.assignments.length;
                                    const percent = total
                                        ? Math.round((summary.submitted / total) * 100)
                                        : 0;
                                    const remaining = total - summary.submitted;

                                    return (
                                        <tr
                                            className="border-b border-[var(--border-color)] transition-opacity last:border-0 hover:opacity-95"
                                            key={summary.name}
                                        >
                                            <td className="px-3 py-4 font-semibold">{index + 1}</td>
                                            <td className="px-3 py-4">
                                                <Button
                                                    variant="plain"
                                                    className="text-left font-semibold text-[var(--assignment-title-color)] hover:text-[var(--brand-primary-color)]"
                                                    data-subject={summary.name}
                                                    onClick={handleOpenSubjectClick}
                                                >
                                                    {summary.name}
                                                </Button>
                                            </td>
                                            <td className="px-3 py-4">{total}</td>
                                            <td className="px-3 py-4">
                                                <span className="badge badge-green whitespace-nowrap">{summary.submitted}</span>
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {summary.pending > 0 && (
                                                        <span className="badge badge-amber whitespace-nowrap">{summary.pending} pending</span>
                                                    )}
                                                    {!remaining && <span className="text-[var(--muted-text-color)]">—</span>}
                                                </div>
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-2 min-w-12 flex-1 overflow-hidden rounded-full bg-[var(--progress-track-background-color)]"
                                                        role="progressbar"
                                                        aria-label={`${summary.name} completion`}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                        aria-valuenow={percent}
                                                    >
                                                        <div
                                                            className="h-full rounded-full bg-[var(--success-color)] transition-all duration-300"
                                                            style={{ width: `${percent}%` }}
                                                        />
                                                    </div>
                                                    <span className="min-w-9 text-right text-xs text-[var(--muted-text-color)]">{percent}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {!subjectSummaries.length && (
                            <p className="empty-state">No subjects match these filters.</p>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}
