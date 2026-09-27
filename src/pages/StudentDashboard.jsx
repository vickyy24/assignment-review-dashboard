import React, { useState } from "react";
import AssignmentDetailsModal from "../components/student/AssignmentDetailsModal";
import AssignmentsTab from "../components/student/AssignmentsTab";
import ProgressTab from "../components/student/ProgressTab";
import SubmissionFormModal from "../components/student/SubmissionFormModal";
import SubmissionsTab from "../components/student/SubmissionsTab";
import AppLayout from "../components/layout/AppLayout";
import Button from "../components/ui/Button";
import { useApp } from "../context/AppContext";
import { CalendarDays, ChartNoAxesColumnIncreasing, ClipboardCheck, FileText, GraduationCap, House, Info, Megaphone } from "lucide-react";

const announcements = [
    {
        title: "Mid Term Submission Guidelines",
        date: "28 Sep 2026",
        description:
            "Review the submission checklist before uploading your work.",
        Icon: Megaphone,
    },
    {
        title: "Lab Files Updated",
        date: "25 Sep 2026",
        description:
            "Updated reference files are available in your assignment Drive links.",
        Icon: FileText,
    },
    {
        title: "System Maintenance",
        date: "20 Sep 2026",
        description: "The portal will be under maintenance on 2 Oct 2026.",
        Icon: Info,
    },
];

const formatDueDate = (date) => {
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(`${date}T12:00:00`));
};

const formatActivityDate = (date) => {
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(date));
};

function getAssignmentStatus(assignment) {
    if (assignment.mySubmission.submitted) {
        return { label: "Submitted", className: "badge-green" };
    }

    return { label: "Pending", className: "badge-amber" };
}

export default function StudentDashboard() {
    const {
        currentUser,
        visibleAssignments,
    } = useApp();
    const [search, setSearch] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("All Subjects");
    const [activeSection, setActiveSection] = useState("dashboard");
    const [assignmentStatusFilter, setAssignmentStatusFilter] =
        useState("All");
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [activeSubmissionAssignment, setActiveSubmissionAssignment] =
        useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const myAssignments = visibleAssignments.map((assignment) => {
        return {
            ...assignment,
            mySubmission: assignment.submissions[currentUser.id] || {
                submitted: false,
                submittedAt: null,
            },
        };
    });
    const submittedCount = myAssignments.filter((assignment) => {
        return assignment.mySubmission.submitted;
    }).length;
    const pendingCount = myAssignments.length - submittedCount;
    const completionPercent = myAssignments.length
        ? (submittedCount / myAssignments.length) * 100
        : 0;
    const subjects = [
        "All Subjects",
        ...new Set(
            myAssignments.map((assignment) => {
                return assignment.subject;
            }),
        ),
    ];
    const searchMatchedAssignments = myAssignments.filter((assignment) => {
        const matchesSearch = `${assignment.title} ${assignment.subject} ${assignment.description}`
            .toLowerCase()
            .includes(search.toLowerCase());
        return matchesSearch;
    });
    const matchingAssignments = searchMatchedAssignments.filter((assignment) => {
        const matchesSubject =
            subjectFilter === "All Subjects" ||
            assignment.subject === subjectFilter;
        return matchesSubject;
    });
    const assignmentFilterCounts = myAssignments.reduce(
        (counts, assignment) => {
            const status = getAssignmentStatus(assignment).label;
            counts.All += 1;
            if (status === "Submitted") {
                counts.Submitted += 1;
            } else {
                counts.Pending += 1;
            }
            return counts;
        },
        { All: 0, Pending: 0, Submitted: 0 },
    );
    const upcomingAssignments = [...matchingAssignments]
        .sort((first, second) => {
            return new Date(first.dueDate) - new Date(second.dueDate);
        })
        .slice(0, 4);
    const recentSubmissions = myAssignments
        .filter((assignment) => {
            return assignment.mySubmission.submittedAt;
        })
        .sort((first, second) => {
            return (
                new Date(second.mySubmission.submittedAt) -
                new Date(first.mySubmission.submittedAt)
            );
        })
        .slice(0, 4);
    const hour = new Date().getHours();
    const greeting =
        hour < 12
            ? "Good Morning"
            : hour < 17
              ? "Good Afternoon"
              : "Good Evening";
    const today = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date());
    const firstName = currentUser.name.split(" ")[0];
    const panelClassName =
        "rounded-xl border border-[var(--border-color)] bg-[var(--panel-background-color)]";
    const navigationItems = [
        { label: "Dashboard", target: "dashboard", Icon: House },
        { label: "Assignments", target: "assignments", Icon: FileText },
        {
            label: "Submissions",
            target: "submissions",
            Icon: ClipboardCheck,
        },
        {
            label: "Progress",
            target: "progress",
            Icon: ChartNoAxesColumnIncreasing,
        },
    ];

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleSubjectChange = (event) => {
        setSubjectFilter(event.target.value);
    };
    const handleAssignmentStatusFilterChange = (filter) => {
        setAssignmentStatusFilter(filter);
    };
    const handleSectionNavigation = (event) => {
        const target = event.currentTarget.dataset.target;
        setActiveSection(target);
        if (
            target === "assignments" ||
            target === "submissions" ||
            target === "progress"
        ) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        requestAnimationFrame(() => {
            document
                .getElementById(target)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };
    const handleOpenAssignment = (eventOrAssignmentId) => {
        const assignmentId =
            typeof eventOrAssignmentId === "string"
                ? eventOrAssignmentId
                : eventOrAssignmentId.currentTarget.dataset.assignmentId;
        const assignment = myAssignments.find((item) => {
            return item.id === assignmentId;
        });
        if (assignment) setSelectedAssignment(assignment);
    };

    const handleOpenSubmittedWork = (assignmentId) => {
        const assignment = myAssignments.find((item) => {
            return item.id === assignmentId;
        });
        if (assignment?.mySubmission?.submitted) {
            setSelectedAssignment({ ...assignment, showSubmittedWork: true });
        }
    };

    const handleOpenSubmission = (assignmentId) => {
        const assignment = myAssignments.find((item) => {
            return item.id === assignmentId;
        });
        if (assignment) setActiveSubmissionAssignment(assignment);
    };

    const handleCloseSubmission = () => {
        setActiveSubmissionAssignment(null);
    };

    const handleCloseAssignmentDetails = () => {
        setSelectedAssignment(null);
    };

    const handleSidebarToggle = () => {
        setSidebarOpen((isOpen) => {
            return !isOpen;
        });
    };

    return (
        <AppLayout
            navigationItems={navigationItems}
            activeSection={activeSection}
            onNavigate={handleSectionNavigation}
            sidebarOpen={sidebarOpen}
            mobileNavOpen={mobileNavOpen}
            onToggleSidebar={handleSidebarToggle}
            onOpenMobile={() => setMobileNavOpen(true)}
            onCloseMobile={() => setMobileNavOpen(false)}
            search={search}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search assignments..."
            onNotificationClick={handleSectionNavigation}
            notificationLabel="View announcements"
            roleLabel="Student"
        >
            {activeSection === "assignments" && (
                <AssignmentsTab
                    assignments={searchMatchedAssignments}
                    selectedFilter={assignmentStatusFilter}
                    filterCounts={assignmentFilterCounts}
                    onFilterChange={handleAssignmentStatusFilterChange}
                    onViewDetails={handleOpenAssignment}
                    getAssignmentStatus={getAssignmentStatus}
                    formatDueDate={formatDueDate}
                    sidebarOpen={sidebarOpen}
                />
            )}

            {activeSection === "submissions" && (
                <SubmissionsTab
                    assignments={searchMatchedAssignments}
                    onViewDetails={handleOpenSubmittedWork}
                    onSubmitAssignment={handleOpenSubmission}
                    formatDueDate={formatDueDate}
                    sidebarOpen={sidebarOpen}
                />
            )}

            {activeSection === "progress" && (
                <ProgressTab
                    assignments={searchMatchedAssignments}
                    getAssignmentStatus={getAssignmentStatus}
                    onViewDetails={handleOpenAssignment}
                    sidebarOpen={sidebarOpen}
                />
            )}

            <main
                id="dashboard"
                className={`min-w-0 scroll-mt-16 space-y-4 px-4 py-5 transition-all duration-200 ease-in-out md:px-7 md:py-7 ${sidebarOpen ? "lg:ml-60" : "lg:ml-20"}`}
                hidden={
                    activeSection === "assignments" ||
                    activeSection === "submissions" ||
                    activeSection === "progress"
                }
            >
                <section className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-4">
                    <div className="lg:col-span-2">
                        <h1 className="welcome-title text-[24px]">
                            {greeting}, {firstName}!
                        </h1>
                        <p className="welcome-sub">
                            Here are your assignments and important updates.
                        </p>
                    </div>

                    <div
                        className={`${panelClassName} flex h-full items-center gap-3 p-4`}
                    >
                        <CalendarDays size={28} aria-hidden="true" />
                        <div>
                            <p className="stat-label m-0">Today</p>
                            <p className="stat-value mt-1 text-base">{today}</p>
                        </div>
                    </div>

                    <div
                        id="progress-overview"
                        className={`${panelClassName} h-full scroll-mt-16 p-4`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <p className="stat-value">{pendingCount}</p>
                                <p className="stat-label">
                                    Pending Assignments
                                </p>
                            </div>
                            <div
                                className="flex h-[38px] w-16 flex-none flex-col items-center justify-center gap-1"
                                aria-label={`${pendingCount} pending out of ${myAssignments.length} assignments`}
                            >
                                <div className="h-1.5 w-14 overflow-hidden rounded-full bg-[var(--progress-track-background-color)]">
                                    <div
                                        className="h-full rounded-full bg-[var(--success-color)]"
                                        style={{
                                            width: `${completionPercent}%`,
                                        }}
                                    />
                                </div>
                                <span className="text-[10px] leading-none text-[var(--stat-label-color)]">
                                    {submittedCount} of {myAssignments.length}{" "}
                                    done
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                    <section
                        id="upcoming-deadlines"
                        className={`${panelClassName} min-w-0 scroll-mt-16 p-4 xl:col-span-2`}
                    >
                        <div className="mb-3 flex items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                            <h2 className="asgn-card-title m-0">
                                Upcoming Deadlines
                            </h2>
                            <button
                                className="text-sm text-[var(--brand-primary-color)]"
                                type="button"
                                onClick={handleSectionNavigation}
                                data-target="assignments"
                            >
                                View All
                            </button>
                        </div>
                        {upcomingAssignments.length ? (
                            <div className="divide-y divide-[var(--border-color)]">
                                {upcomingAssignments.map((assignment) => {
                                    const status =
                                        getAssignmentStatus(assignment);
                                    return (
                                        <article
                                            key={assignment.id}
                                            className="grid grid-cols-1 items-center gap-3 py-3 md:grid-cols-12"
                                        >
                                            <div className="flex min-w-0 items-center gap-3 md:col-span-6">
                                                <span className="stat-icon grid flex-none place-items-center">
                                                    <FileText
                                                        size={18}
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                                <div className="min-w-0">
                                                    <h3 className="asgn-card-title m-0 truncate">
                                                        {assignment.title}
                                                    </h3>
                                                    <p className="meta-item mt-1">
                                                        Subject: {assignment.subject}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm md:col-span-3">
                                                <CalendarDays
                                                    size={16}
                                                    aria-hidden="true"
                                                />
                                                <div>
                                                    <p className="stat-label m-0">
                                                        Due Date
                                                    </p>
                                                    <p className="meta-item mt-1">
                                                        {formatDueDate(
                                                            assignment.dueDate,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center md:col-span-3 md:justify-center">
                                                <span
                                                    className={`badge ${status.className}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="empty-state">
                                No matching assignments found.
                            </p>
                        )}
                    </section>

                    <section
                        className={`${panelClassName} min-w-0 p-4`}
                        aria-labelledby="recent-activity-title"
                    >
                        <div className="mb-3 flex items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                            <h2
                                id="recent-activity-title"
                                className="asgn-card-title m-0"
                            >
                                Recent Activity
                            </h2>
                            <button
                                className="text-sm font-semibold text-[var(--brand-primary-color)]"
                                type="button"
                                onClick={handleSectionNavigation}
                                data-target="submissions"
                            >
                                View All
                            </button>
                        </div>
                        {recentSubmissions.length ? (
                            <ol className="space-y-4">
                                {recentSubmissions.map((assignment) => {
                                    return (
                                        <li
                                            key={assignment.id}
                                            className="flex gap-3"
                                        >
                                            <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[var(--success-color)]" />
                                            <div>
                                                <p className="text-sm">
                                                    You submitted{" "}
                                                    {assignment.title}
                                                </p>
                                                <time
                                                    className="meta-item mt-1 block"
                                                    dateTime={
                                                        assignment.mySubmission
                                                            .submittedAt
                                                    }
                                                >
                                                    {formatActivityDate(
                                                        assignment.mySubmission
                                                            .submittedAt,
                                                    )}
                                                </time>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ol>
                        ) : (
                            <p className="empty-state py-6">
                                Your submission activity will appear here.
                            </p>
                        )}
                    </section>

                    <section
                        id="assignment-table"
                        className={`${panelClassName} min-w-0 scroll-mt-16 p-4 xl:col-span-2`}
                    >
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <h2 className="asgn-card-title m-0">
                                Subject-wise Assignments
                            </h2>
                            <select
                                className="field-input w-full max-w-52"
                                value={subjectFilter}
                                onChange={handleSubjectChange}
                                aria-label="Filter by subject"
                            >
                                {subjects.map((subject) => {
                                    return (
                                        <option key={subject}>{subject}</option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="hidden overflow-x-auto 2xl:overflow-visible lg:block">
                            <table className="w-full min-w-[760px] table-fixed border-collapse text-left text-sm 2xl:min-w-0">
                                <colgroup>
                                    <col className="w-[5%]" />
                                    <col className="w-[32%]" />
                                    <col className="w-[21%]" />
                                    <col className="w-[18%]" />
                                    <col className="w-[24%]" />
                                </colgroup>
                                <thead className="bg-[var(--secondary-panel-background-color)]">
                                    <tr className="border-b border-[var(--border-color)]">
                                        <th className="px-3 py-2.5 font-semibold">
                                            #
                                        </th>
                                        <th className="px-3 py-2.5 font-semibold">
                                            Assignment
                                        </th>
                                        <th className="px-3 py-2.5 font-semibold">
                                            Subject
                                        </th>
                                        <th className="px-3 py-2.5 font-semibold">
                                            Due Date
                                        </th>
                                        <th className="px-3 py-2.5 font-semibold">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matchingAssignments.map(
                                        (assignment, index) => {
                                            const status =
                                                getAssignmentStatus(assignment);
                                            return (
                                                <tr
                                                    key={assignment.id}
                                                    className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--secondary-panel-background-color)]"
                                                >
                                                    <td className="px-3 py-2.5">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-3 py-2.5 font-medium">
                                                        {assignment.title}
                                                    </td>
                                                    <td className="px-3 py-2.5">
                                                        {assignment.subject}
                                                    </td>
                                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                                        {formatDueDate(
                                                            assignment.dueDate,
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2.5">
                                                        <span
                                                            className={`badge whitespace-nowrap ${status.className}`}
                                                        >
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        },
                                    )}
                                </tbody>
                            </table>
                            {!matchingAssignments.length && (
                                <p className="empty-state">
                                    No assignments match this filter.
                                </p>
                            )}
                        </div>
                        <div className="space-y-2 lg:hidden">
                            {matchingAssignments.map((assignment, index) => {
                                const status = getAssignmentStatus(assignment);
                                return (
                                    <article
                                        className="rounded-lg border border-[var(--border-color)] bg-[var(--secondary-panel-background-color)] p-3"
                                        key={assignment.id}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="stat-label mb-1">Assignment {index + 1}</p>
                                                <h3 className="asgn-card-title m-0 break-words">{assignment.title}</h3>
                                            </div>
                                            <span className={`badge flex-none ${status.className}`}>{status.label}</span>
                                        </div>
                                        <div className="mt-2 grid grid-cols-1 gap-1 text-sm text-[var(--assignment-meta-color)] sm:grid-cols-2">
                                            <p className="m-0 break-words">{assignment.subject}</p>
                                            <p className="m-0">Due {formatDueDate(assignment.dueDate)}</p>
                                        </div>
                                    </article>
                                );
                            })}
                            {!matchingAssignments.length && (
                                <p className="empty-state py-6 text-center">No assignments match this filter.</p>
                            )}
                        </div>
                    </section>

                    <section
                        id="announcements"
                        className={`${panelClassName} min-w-0 scroll-mt-16 p-4`}
                        aria-labelledby="announcements-title"
                    >
                        <div className="mb-3 flex items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                            <h2
                                id="announcements-title"
                                className="asgn-card-title m-0"
                            >
                                Announcements
                            </h2>
                            <span className="meta-item">
                                {announcements.length}
                            </span>
                        </div>
                        <ul className="space-y-2">
                            {announcements.map(
                                ({ title, date, description, Icon }) => {
                                    return (
                                        <li
                                            key={title}
                                            className="flex gap-3 rounded-lg border border-[var(--border-color)] p-3"
                                        >
                                            <span className="stat-icon grid flex-none place-items-center bg-[var(--stat-icon-background-color)]">
                                                <Icon
                                                    size={17}
                                                    aria-hidden="true"
                                                />
                                            </span>
                                            <div className="min-w-0">
                                                <h3 className="asgn-card-title m-0">
                                                    {title}
                                                </h3>
                                                <p className="meta-item mt-1">
                                                    {date}
                                                </p>
                                                <p className="stat-label mt-1">
                                                    {description}
                                                </p>
                                            </div>
                                        </li>
                                    );
                                },
                            )}
                        </ul>
                    </section>
                </div>
            </main>

            {selectedAssignment && (
                <AssignmentDetailsModal
                    assignment={selectedAssignment}
                    status={getAssignmentStatus(selectedAssignment)}
                    showSubmittedWork={selectedAssignment.showSubmittedWork}
                    onClose={handleCloseAssignmentDetails}
                />
            )}

            {activeSubmissionAssignment && (
                <SubmissionFormModal
                    assignment={activeSubmissionAssignment}
                    onClose={handleCloseSubmission}
                />
            )}
        </AppLayout>
    );
}
