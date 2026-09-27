import React, { Suspense, lazy, useState } from "react";
import {
    BookOpenCheck,
    ChartNoAxesColumnIncreasing,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Eye,
    FileText,
    RotateCcw,
    Search,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import EditAssignmentModal from "../components/admin/EditAssignmentModal";
import Panel from "../components/ui/Panel";
import { useApp } from "../context/AppContext";
import Button from "../components/ui/Button";

const ProgressCharts = lazy(() => import("../components/admin/ProgressCharts"));
const TEACHER_NAVIGATION = [
    { label: "Assignments", target: "assignments", Icon: FileText },
    { label: "Submissions", target: "submissions", Icon: BookOpenCheck },
    { label: "Progress", target: "progress", Icon: ChartNoAxesColumnIncreasing },
];

const formatDate = (date) =>
    new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(`${date}T12:00:00`));

export default function AdminDashboard() {
    const {
        visibleAssignments,
        getAllStudents,
        createAssignment,
    } = useApp();
    const [activeSection, setActiveSection] = useState("assignments");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [globalSearch, setGlobalSearch] = useState("");
    const [assignmentSearch, setAssignmentSearch] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("All Subjects");
    const [editTarget, setEditTarget] = useState(null);
    const [reviewTarget, setReviewTarget] = useState(null);
    const [progressTarget, setProgressTarget] = useState(null);

    const students = getAllStudents();
    const assignments = visibleAssignments;
    const filteredAssignments = assignments.filter((assignment) => {
        const matchesSearch = `${assignment.title} ${assignment.subject}`
            .toLowerCase()
            .includes(assignmentSearch.trim().toLowerCase());
        const matchesSubject = subjectFilter === "All Subjects" || assignment.subject === subjectFilter;
        return matchesSearch && matchesSubject;
    });

    const handleNavigate = (event) => {
        const section = event.currentTarget.dataset.target;
        setActiveSection(section);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const handleCreate = (form) => {
        createAssignment(form);
    };

    return (
        <AppLayout
            navigationItems={TEACHER_NAVIGATION}
            activeSection={activeSection}
            onNavigate={handleNavigate}
            sidebarOpen={sidebarOpen}
            mobileNavOpen={mobileNavOpen}
            onToggleSidebar={() => setSidebarOpen((open) => !open)}
            onOpenMobile={() => setMobileNavOpen(true)}
            onCloseMobile={() => setMobileNavOpen(false)}
            search={activeSection === "assignments" ? assignmentSearch : globalSearch}
            onSearchChange={(event) => {
                if (activeSection === "assignments") setAssignmentSearch(event.target.value);
                else setGlobalSearch(event.target.value);
            }}
            searchPlaceholder="Search students, assignments..."
            onNotificationClick={() => {}}
            notificationLabel="View notifications"
            roleLabel="Teacher"
        >
            {activeSection === "assignments" && (
                <TeacherAssignmentsView
                    assignments={filteredAssignments}
                    subjectOptions={[...new Set(assignments.map((assignment) => assignment.subject))]}
                    search={assignmentSearch}
                    onSearchChange={(event) => setAssignmentSearch(event.target.value)}
                    subjectFilter={subjectFilter}
                    onSubjectFilterChange={(event) => setSubjectFilter(event.target.value)}
                    onCreate={handleCreate}
                    onEdit={setEditTarget}
                    sidebarOpen={sidebarOpen}
                />
            )}

            {activeSection === "submissions" && (
                <TeacherSubmissionsView
                    assignments={assignments}
                    students={students}
                    sidebarOpen={sidebarOpen}
                    reviewSubmission={setReviewTarget}
                />
            )}

            {activeSection === "progress" && (
                <TeacherProgressView
                    assignments={assignments}
                    students={students}
                    sidebarOpen={sidebarOpen}
                    search={globalSearch}
                    onViewStudent={setProgressTarget}
                />
            )}

            {editTarget && (
                <EditAssignmentModal
                    assignment={editTarget}
                    onClose={() => setEditTarget(null)}
                />
            )}
            {reviewTarget && (
                <SubmissionDetailsModal
                    record={reviewTarget}
                    onClose={() => setReviewTarget(null)}
                />
            )}
            {progressTarget && (
                <StudentProgressModal
                    record={progressTarget}
                    onClose={() => setProgressTarget(null)}
                />
            )}
        </AppLayout>
    );
}

function TeacherAssignmentsView({ assignments, subjectOptions, search, onSearchChange, subjectFilter, onSubjectFilterChange, onCreate, onEdit, sidebarOpen }) {
    const [form, setForm] = useState({
        subject: "Computer Engineering",
        title: "",
        description: "",
        driveLink: "",
        dueDate: "",
        maxMarks: 100,
    });
    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!form.title.trim() || !form.description.trim() || !form.driveLink.trim() || !form.dueDate) {
            setError("Complete each required field before creating the assignment.");
            return;
        }
        try {
                            const parsedLink = new URL(form.driveLink);
                            if (parsedLink.hostname !== "drive.google.com") throw new Error("Not a Google Drive URL");
        } catch {
            setError("Enter a valid Google Drive link.");
            return;
        }
        onCreate({
            ...form,
            materials: [{ type: "link", title: "Drive link", url: form.driveLink.trim() }],
        });
        setForm((current) => ({ ...current, title: "", description: "", driveLink: "", dueDate: "" }));
        setError("");
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
        setError("");
    };

    return (
        <main className={`min-w-0 space-y-4 px-4 py-5 transition-all duration-200 ease-in-out md:px-7 md:py-7 ${sidebarOpen ? "lg:ml-60" : "lg:ml-20"}`}>
            <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="welcome-title text-[28px] max-sm:text-2xl">Assignments</h1>
                    <p className="welcome-sub">Create, manage and track your assignments.</p>
                </div>
                <Button type="button" variant="primary" className="inline-flex items-center justify-center gap-2" onClick={() => document.getElementById("create-assignment-title")?.focus()}>
                    <span className="text-xl leading-none">＋</span> Create Assignment
                </Button>
            </header>

            <Panel title="Create Assignment" icon={<FileText size={22} aria-hidden="true" />}>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2" noValidate>
                    <FormField label="Subject *">
                        <select className="field-input" name="subject" value={form.subject} onChange={handleChange}>
                            {["Computer Engineering", "Data Structures", "Operating Systems", "Database Management", "Computer Networks", "Web Development", "Other"].map((subject) => <option key={subject}>{subject}</option>)}
                        </select>
                    </FormField>
                    <FormField label="Assignment Title *">
                        <input id="create-assignment-title" className="field-input" name="title" value={form.title} onChange={handleChange} placeholder="Enter assignment title..." required />
                    </FormField>
                    <FormField label="Description *">
                        <textarea className="field-input field-textarea min-h-28" name="description" value={form.description} onChange={handleChange} placeholder="Describe the assignment requirements..." required />
                    </FormField>
                    <div className="grid content-start gap-4">
                        <FormField label="Google Drive Link *">
                            <input className="field-input" name="driveLink" type="url" inputMode="url" value={form.driveLink} onChange={handleChange} placeholder="https://drive.google.com/..." required />
                        </FormField>
                        <FormField label="Due Date *">
                            <input className="field-input" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required />
                        </FormField>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            {error && <p className="field-error m-0" role="alert">{error}</p>}
                            <div className="ml-auto flex flex-wrap justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => { setForm({ subject: "Computer Engineering", title: "", description: "", driveLink: "", dueDate: "", maxMarks: 100 }); setError(""); }}>Cancel</Button>
                                <Button type="submit" variant="primary" className="inline-flex items-center justify-center gap-2">Create Assignment</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Panel>

            <Panel title="Existing Assignments" icon={<FileText size={22} aria-hidden="true" />}>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="search-bar-wrap min-w-[220px] flex-1">
                        <Search className="search-icon" size={16} aria-hidden="true" />
                        <input className="search-bar" type="search" placeholder="Search assignments..." value={search} onChange={onSearchChange} aria-label="Search existing assignments" />
                    </div>
                    <select className="field-input w-full max-w-56" aria-label="Filter by subject" value={subjectFilter} onChange={onSubjectFilterChange}>
                        <option>All Subjects</option>
                        {[...new Set(["Computer Engineering", ...subjectOptions])].map((subject) => <option key={subject}>{subject}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-sm">
                        <thead className="bg-[var(--table-header-background-color)] text-[var(--muted-text-color)]">
                            <tr>
                                <th className="px-3 py-3 font-semibold">#</th>
                                <th className="px-3 py-3 font-semibold">Assignment Title</th>
                                <th className="px-3 py-3 font-semibold">Subject</th>
                                <th className="px-3 py-3 font-semibold">Due Date</th>
                                <th className="px-3 py-3 font-semibold">Status</th>
                                <th className="px-3 py-3 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map((assignment, index) => (
                                <tr key={assignment.id} className="border-b border-[var(--border-color)] last:border-0">
                                    <td className="px-3 py-3">{index + 1}</td>
                                    <td className="px-3 py-3 font-semibold">{assignment.title}</td>
                                    <td className="px-3 py-3">{assignment.subject}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{formatDate(assignment.dueDate)}</td>
                                    <td className="px-3 py-3"><span className="badge badge-green">Active</span></td>
                                    <td className="px-3 py-3"><Button type="button" variant="outline" className="inline-flex items-center justify-center gap-2" onClick={() => onEdit(assignment)}>Edit</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!assignments.length && <p className="empty-state py-6 text-center">No assignments match this search.</p>}
                </div>
            </Panel>
        </main>
    );
}

function TeacherSubmissionsView({ assignments, students, sidebarOpen, reviewSubmission }) {
    const [subjectFilter, setSubjectFilter] = useState("All Subjects");
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(assignments[0]?.id || "");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const subjects = [...new Set(assignments.map((assignment) => assignment.subject))];
    const subjectAssignments = assignments.filter((assignment) => subjectFilter === "All Subjects" || assignment.subject === subjectFilter);
    const assignment = subjectAssignments.find((item) => item.id === selectedAssignmentId) || subjectAssignments[0];
    const rows = students
        .map((student) => ({
            student,
            submission: assignment?.submissions?.[student.id] || { submitted: false, submittedAt: null },
        }))
        .filter(({ student }) => student.name.toLowerCase().includes(search.trim().toLowerCase()));
    const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
    const currentPage = Math.min(page, pageCount);
    const visibleRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const firstRow = rows.length ? (currentPage - 1) * pageSize + 1 : 0;
    const lastRow = Math.min(currentPage * pageSize, rows.length);

    const handleSubjectChange = (event) => {
        setSubjectFilter(event.target.value);
        setPage(1);
    };
    const handleAssignmentChange = (event) => {
        setSelectedAssignmentId(event.target.value);
        setPage(1);
    };
    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(1);
    };

    return (
        <main className={`min-w-0 space-y-4 px-4 py-5 transition-all duration-200 ease-in-out md:px-7 md:py-7 ${sidebarOpen ? "lg:ml-60" : "lg:ml-20"}`}>
            <header>
                <h1 className="welcome-title text-[28px] max-sm:text-2xl">Submissions</h1>
                <p className="welcome-sub">View and manage student submissions for each assignment.</p>
            </header>

            <section className="grid grid-cols-1 gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--panel-background-color)] p-4 md:grid-cols-2 md:p-5">
                <FormField label="Select Assignment *">
                    <select className="field-input" value={assignment?.id || ""} onChange={handleAssignmentChange} aria-label="Select assignment">
                        {subjectAssignments.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                    </select>
                </FormField>
                <FormField label="Select Subject">
                    <select className="field-input" value={subjectFilter} onChange={handleSubjectChange} aria-label="Select subject">
                        <option>All Subjects</option>
                        {subjects.map((subject) => <option key={subject}>{subject}</option>)}
                    </select>
                </FormField>
            </section>

            <Panel
                title="Submission Details"
                icon={<FileText size={22} aria-hidden="true" />}
                action={
                    <div className="search-bar-wrap w-full sm:w-60">
                        <Search className="search-icon" size={16} aria-hidden="true" />
                        <input className="search-bar" type="search" placeholder="Search students..." value={search} onChange={handleSearchChange} aria-label="Search students" />
                    </div>
                }
            >
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[920px] text-left text-sm">
                        <thead className="bg-[var(--table-header-background-color)] text-[var(--muted-text-color)]">
                            <tr>
                                <th className="px-3 py-3 font-semibold">#</th>
                                <th className="px-3 py-3 font-semibold">Student Name</th>
                                <th className="px-3 py-3 font-semibold">Submission Status</th>
                                <th className="px-3 py-3 font-semibold">Submission Date</th>
                                <th className="px-3 py-3 font-semibold">Google Drive Link</th>
                                <th className="px-3 py-3 font-semibold">Progress</th>
                                <th className="px-3 py-3 text-right font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleRows.map(({ student, submission }, index) => {
                                const submitted = submission.submitted;
                                const row = { assignment, student, submission };
                                return (
                                    <tr key={student.id} className="border-b border-[var(--border-color)] last:border-0">
                                        <td className="px-3 py-3">{firstRow + index}</td>
                                        <td className="px-3 py-3 font-medium">{student.name}</td>
                                        <td className="px-3 py-3"><span className={`badge ${submitted ? "badge-green" : "badge-amber"}`}>{submitted ? "Submitted" : "Pending"}</span></td>
                                        <td className="whitespace-nowrap px-3 py-3">{submission.submittedAt ? formatDate(submission.submittedAt.slice(0, 10)) : "—"}</td>
                                        <td className="px-3 py-3">
                                            {submitted && submission.link ? (
                                                <a className="inline-flex items-center gap-2 text-[var(--brand-primary-color)] underline underline-offset-2" href={submission.link} target="_blank" rel="noopener noreferrer">
                                                    <DriveMark /> Open Submission
                                                </a>
                                            ) : <span className="text-[var(--muted-text-color)]">—</span>}
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex min-w-32 items-center gap-2">
                                                <div className="progress-track h-2 flex-1"><div className="progress-fill" style={{ width: submitted ? "100%" : "0%" }} /></div>
                                                <span className="w-10 text-right text-[var(--muted-text-color)]">{submitted ? "100%" : "0%"}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 text-right">
                                            <Button type="button" variant="outline" className="inline-flex min-w-[68px] items-center justify-center gap-1.5" disabled={!submitted} onClick={() => reviewSubmission(row)}><Eye size={15} aria-hidden="true" /> View</Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {!visibleRows.length && <p className="empty-state py-8 text-center">No students match your search.</p>}
                </div>

                <div className="space-y-3 md:hidden">
                    {visibleRows.map(({ student, submission }, index) => {
                        const submitted = submission.submitted;
                        const row = { assignment, student, submission };
                        return (
                            <article key={student.id} className="rounded-lg border border-[var(--border-color)] bg-[var(--secondary-panel-background-color)] p-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0"><p className="stat-label mb-1">Student {firstRow + index}</p><h3 className="asgn-card-title m-0 break-words">{student.name}</h3></div>
                                    <span className={`badge shrink-0 ${submitted ? "badge-green" : "badge-amber"}`}>{submitted ? "Submitted" : "Pending"}</span>
                                </div>
                                <p className="meta-item mt-2">{submission.submittedAt ? formatDate(submission.submittedAt.slice(0, 10)) : "No submission date"}</p>
                                {submitted && submission.link && <a className="mt-2 inline-flex items-center gap-2 text-sm text-[var(--brand-primary-color)] underline" href={submission.link} target="_blank" rel="noopener noreferrer"><DriveMark /> Open Submission</a>}
                                <div className="mt-3 flex items-center gap-3"><div className="progress-track h-2 flex-1"><div className="progress-fill" style={{ width: submitted ? "100%" : "0%" }} /></div><span className="text-sm text-[var(--muted-text-color)]">{submitted ? "100%" : "0%"}</span><Button type="button" variant="outline" disabled={!submitted} onClick={() => reviewSubmission(row)}>View</Button></div>
                            </article>
                        );
                    })}
                    {!visibleRows.length && <p className="empty-state py-8 text-center">No students match your search.</p>}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-color)] pt-4">
                    <p className="stat-label m-0">Showing {firstRow} to {lastRow} of {rows.length} students</p>
                    <nav className="flex items-center gap-2" aria-label="Submission pages">
                        <PaginationButton label="Previous page" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft size={17} /></PaginationButton>
                        {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                            <button key={pageNumber} type="button" aria-current={currentPage === pageNumber ? "page" : undefined} onClick={() => setPage(pageNumber)} className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-semibold transition-colors ${currentPage === pageNumber ? "border-[var(--primary-button-background)] bg-[var(--primary-button-background)] text-white" : "border-[var(--border-color)] bg-[var(--panel-background-color)] text-[var(--muted-text-color)] hover:border-[var(--brand-primary-color)]"}`}>{pageNumber}</button>
                        ))}
                        <PaginationButton label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}><ChevronRight size={17} /></PaginationButton>
                    </nav>
                </div>
            </Panel>
        </main>
    );
}

function PaginationButton({ label, disabled, onClick, children }) {
    return <button type="button" aria-label={label} disabled={disabled} onClick={onClick} className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border-color)] bg-[var(--panel-background-color)] text-[var(--muted-text-color)] transition-colors hover:border-[var(--brand-primary-color)] disabled:cursor-not-allowed disabled:opacity-40">{children}</button>;
}

function DriveMark() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 flex-none">
            <path fill="#00875A" d="M8.4 3h5.2L23 19h-5.2z" />
            <path fill="#FFBA00" d="M8.4 3h5.2L5.2 19H0z" />
            <path fill="#2684FC" d="M5.2 19H23l-2.6 4H2.6z" />
        </svg>
    );
}

function SubmissionDetailsModal({ record, onClose }) {
    const { assignment, student, submission } = record;
    return (
        <div className="modal-overlay fixed inset-0 z-40 grid place-items-center overflow-y-auto p-4" onClick={onClose}>
            <section className="modal-box relative w-full max-w-lg p-6" role="dialog" aria-modal="true" aria-labelledby="submission-view-title" onClick={(event) => event.stopPropagation()}>
                <button type="button" className="modal-close absolute right-3 top-3 h-[30px] w-[30px]" onClick={onClose} aria-label="Close submission details">×</button>
                <div className="flex items-start justify-between gap-4 pr-9">
                    <div><p className="stat-label mb-1">Student submission</p><h2 id="submission-view-title" className="modal-title m-0">{student.name}</h2></div>
                    <span className="badge badge-green">Submitted</span>
                </div>
                <dl className="mt-5 grid gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--secondary-panel-background-color)] p-4 text-sm sm:grid-cols-2">
                    <div><dt className="stat-label">Assignment</dt><dd className="mt-1 font-semibold">{assignment.title}</dd></div>
                    <div><dt className="stat-label">Submitted</dt><dd className="mt-1 font-semibold">{submission.submittedAt ? formatDate(submission.submittedAt.slice(0, 10)) : "—"}</dd></div>
                    <div><dt className="stat-label">Status</dt><dd className="mt-1 font-semibold">Submitted</dd></div>
                </dl>
                {submission.link && <a href={submission.link} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5 inline-flex w-full items-center justify-center gap-2">Open Submission <ExternalLink size={16} aria-hidden="true" /></a>}
                <div className="mt-5 flex justify-end"><Button type="button" variant="outline" className="teacher-modal-dismiss" onClick={onClose}>Close</Button></div>
            </section>
        </div>
    );
}

function TeacherProgressView({ assignments, students, sidebarOpen, search, onViewStudent }) {
    const subjects = [...new Set(assignments.map((assignment) => assignment.subject))];
    const [view, setView] = useState("student");
    const [draft, setDraft] = useState({ subject: "All Subjects", student: "All Students", status: "All Statuses" });
    const [applied, setApplied] = useState(draft);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const matchingAssignments = assignments.filter((assignment) => applied.subject === "All Subjects" || assignment.subject === applied.subject);
    const matchingStudents = students.filter((student) => {
        const selectedStudent = applied.student === "All Students" || student.id === applied.student;
        const matchesSearch = `${student.name} ${matchingAssignments.map((assignment) => assignment.title).join(" ")}`.toLowerCase().includes(search.trim().toLowerCase());
        return selectedStudent && matchesSearch;
    });
    const records = view === "student"
        ? matchingStudents.map((student) => makeProgressRecord(student, applied.subject === "All Subjects" ? "All Subjects" : applied.subject, matchingAssignments))
        : [...new Set(matchingAssignments.map((assignment) => assignment.subject))].flatMap((subject) => {
            const subjectAssignments = matchingAssignments.filter((assignment) => assignment.subject === subject);
            return matchingStudents.map((student) => makeProgressRecord(student, subject, subjectAssignments));
        });
    const statusFilteredRows = records.filter((record) => {
        if (applied.status === "Submitted") return record.submitted > 0;
        if (applied.status === "Pending") return record.pending > 0;
        return true;
    });
    const pageCount = Math.max(1, Math.ceil(statusFilteredRows.length / pageSize));
    const activePage = Math.min(page, pageCount);
    const pageRows = statusFilteredRows.slice((activePage - 1) * pageSize, activePage * pageSize);
    const startRow = statusFilteredRows.length ? (activePage - 1) * pageSize + 1 : 0;
    const endRow = Math.min(activePage * pageSize, statusFilteredRows.length);
    const chartData = matchingAssignments.map((assignment) => {
        const submitted = matchingStudents.filter((student) => assignment.submissions?.[student.id]?.submitted).length;
        return {
            name: assignment.title,
            submitted,
            pending: Math.max(0, matchingStudents.length - submitted),
        };
    });
    const chartTotals = chartData.reduce((totals, item) => ({
        submitted: totals.submitted + item.submitted,
        pending: totals.pending + item.pending,
    }), { submitted: 0, pending: 0 });

    const updateDraft = (event) => setDraft((current) => ({ ...current, [event.target.name]: event.target.value }));
    const applyFilters = () => {
        setApplied({ ...draft });
        setPage(1);
    };
    const resetFilters = () => {
        const reset = { subject: "All Subjects", student: "All Students", status: "All Statuses" };
        setDraft(reset);
        setApplied(reset);
        setPage(1);
    };

    return (
        <main className={`min-w-0 space-y-4 px-4 py-5 transition-all duration-200 ease-in-out md:px-7 md:py-7 ${sidebarOpen ? "lg:ml-60" : "lg:ml-20"}`}>
            <header>
                <h1 className="welcome-title text-[28px] max-sm:text-2xl">Progress</h1>
                <p className="welcome-sub">View and analyze student progress for assignments.</p>
            </header>

            <section className="teacher-progress-filters grid grid-cols-1 items-end gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--panel-background-color)] p-4 sm:grid-cols-2 2xl:grid-cols-[repeat(3,minmax(0,1fr))_auto]" aria-label="Progress filters">
                <FormField label="Subject">
                    <select className="field-input teacher-progress-filter-select" name="subject" value={draft.subject} onChange={updateDraft}>
                        <option>All Subjects</option>
                        {subjects.map((subject) => <option key={subject}>{subject}</option>)}
                    </select>
                </FormField>
                <FormField label="Student">
                    <select className="field-input teacher-progress-filter-select" name="student" value={draft.student} onChange={updateDraft}>
                        <option>All Students</option>
                        {students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}
                    </select>
                </FormField>
                <FormField label="Status">
                    <select className="field-input teacher-progress-filter-select" name="status" value={draft.status} onChange={updateDraft}>
                        <option>All Statuses</option>
                        <option>Submitted</option>
                        <option>Pending</option>
                    </select>
                </FormField>
                <div className="teacher-progress-filter-actions flex flex-wrap gap-2 sm:col-span-2 2xl:col-span-1">
                    <Button type="button" variant="primary" className="inline-flex items-center justify-center gap-2" onClick={applyFilters}>Apply Filters</Button>
                    <Button type="button" variant="outline" className="inline-flex items-center justify-center gap-2" onClick={resetFilters}><RotateCcw size={15} aria-hidden="true" /> Reset</Button>
                </div>
            </section>

            <div className="flex w-full max-w-[420px] rounded-lg border border-[var(--border-color)] bg-[var(--panel-background-color)] p-0.5" role="tablist" aria-label="Progress view">
                {[{ id: "student", label: "Student-wise" }, { id: "subject", label: "Subject-wise" }].map(({ id, label }) => (
                    <button key={id} type="button" role="tab" aria-selected={view === id} onClick={() => { setView(id); setPage(1); }} className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${view === id ? "border border-[var(--primary-button-background)] bg-[var(--secondary-panel-background-color)] text-[var(--brand-primary-color)]" : "text-[var(--muted-text-color)] hover:bg-[var(--secondary-panel-background-color)]"}`}>{label}</button>
                ))}
            </div>

            <Suspense fallback={<p className="stat-label py-8 text-center">Loading progress charts…</p>}>
                <ProgressCharts
                    data={chartData}
                    totals={chartTotals}
                    onStatusSelect={(status) => {
                        const next = { ...draft, status };
                        setDraft(next);
                        setApplied(next);
                        setPage(1);
                    }}
                />
            </Suspense>

            <Panel title={view === "student" ? "Student Progress" : "Subject Progress"}>
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[920px] text-left text-sm">
                        <thead className="bg-[var(--table-header-background-color)] text-[var(--muted-text-color)]">
                            <tr>
                                <th className="px-3 py-3 font-semibold">#</th>
                                <th className="px-3 py-3 font-semibold">Student Name</th>
                                <th className="px-3 py-3 font-semibold">Subject</th>
                                <th className="px-3 py-3 text-center font-semibold">Total Assignments</th>
                                <th className="px-3 py-3 text-center font-semibold">Submitted</th>
                                <th className="px-3 py-3 text-center font-semibold">Pending</th>
                                <th className="px-3 py-3 font-semibold">Completion %</th>
                                <th className="px-3 py-3 text-right font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageRows.map((record, index) => (
                                <tr key={`${record.student.id}-${record.subject}`} className="border-b border-[var(--border-color)] last:border-0">
                                    <td className="px-3 py-3">{startRow + index}</td>
                                    <td className="px-3 py-3 font-medium">{record.student.name}</td>
                                    <td className="px-3 py-3">{record.subject}</td>
                                    <td className="px-3 py-3 text-center">{record.total}</td>
                                    <td className="px-3 py-3 text-center">{record.submitted}</td>
                                    <td className="px-3 py-3 text-center">{record.pending}</td>
                                    <td className="px-3 py-3"><CompletionBar value={record.completion} /></td>
                                    <td className="px-3 py-3 text-right"><Button type="button" variant="outline" className="min-w-[68px]" onClick={() => onViewStudent(record)}>View</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!pageRows.length && <p className="empty-state py-8 text-center">No progress records match these filters.</p>}
                </div>

                <div className="space-y-3 md:hidden">
                    {pageRows.map((record, index) => (
                        <article key={`${record.student.id}-${record.subject}`} className="rounded-lg border border-[var(--border-color)] bg-[var(--secondary-panel-background-color)] p-3">
                            <div className="flex items-start justify-between gap-3"><div><p className="stat-label mb-1">Student {startRow + index}</p><h3 className="asgn-card-title m-0">{record.student.name}</h3><p className="meta-item mt-1">{record.subject}</p></div><Button type="button" variant="outline" onClick={() => onViewStudent(record)}>View</Button></div>
                            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm"><div><span className="stat-label block">Total</span>{record.total}</div><div><span className="stat-label block">Submitted</span>{record.submitted}</div><div><span className="stat-label block">Pending</span>{record.pending}</div></div>
                            <div className="mt-3"><CompletionBar value={record.completion} /></div>
                        </article>
                    ))}
                    {!pageRows.length && <p className="empty-state py-8 text-center">No progress records match these filters.</p>}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-color)] pt-4">
                    <p className="stat-label m-0">Showing {startRow} to {endRow} of {statusFilteredRows.length} {view === "student" ? "students" : "records"}</p>
                    <nav className="flex items-center gap-2" aria-label="Progress pages">
                        <PaginationButton label="Previous page" disabled={activePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft size={17} /></PaginationButton>
                        {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} type="button" aria-current={activePage === pageNumber ? "page" : undefined} onClick={() => setPage(pageNumber)} className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-semibold transition-colors ${activePage === pageNumber ? "border-[var(--primary-button-background)] bg-[var(--primary-button-background)] text-white" : "border-[var(--border-color)] bg-[var(--panel-background-color)] text-[var(--muted-text-color)] hover:border-[var(--brand-primary-color)]"}`}>{pageNumber}</button>)}
                        <PaginationButton label="Next page" disabled={activePage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}><ChevronRight size={17} /></PaginationButton>
                    </nav>
                </div>
            </Panel>
        </main>
    );
}

function makeProgressRecord(student, subject, assignments) {
    const outcomes = assignments.map((assignment) => ({
        assignment,
        submission: assignment.submissions?.[student.id] || { submitted: false, submittedAt: null },
    }));
    const submitted = outcomes.filter(({ submission }) => submission.submitted).length;
    const total = outcomes.length;
    return {
        student,
        subject,
        assignments: outcomes,
        total,
        submitted,
        pending: total - submitted,
        completion: total ? Math.round((submitted / total) * 100) : 0,
    };
}

function CompletionBar({ value }) {
    return (
        <div className="flex min-w-28 items-center gap-2">
            <div className="progress-track h-2 flex-1"><div className={`progress-fill ${value === 100 ? "bg-[var(--success-color)]" : ""}`} style={{ width: `${value}%` }} /></div>
            <span className="w-10 text-right text-[var(--muted-text-color)]">{value}%</span>
        </div>
    );
}

function StudentProgressModal({ record, onClose }) {
    return (
        <div className="modal-overlay fixed inset-0 z-40 grid place-items-center overflow-y-auto p-4" onClick={onClose}>
            <section className="modal-box relative w-full max-w-2xl p-5 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="student-progress-title" onClick={(event) => event.stopPropagation()}>
                <button type="button" className="modal-close absolute right-3 top-3 h-[30px] w-[30px]" onClick={onClose} aria-label="Close student progress">×</button>
                <div className="flex flex-wrap items-start justify-between gap-3 pr-9">
                    <div><p className="stat-label mb-1">Progress details</p><h2 id="student-progress-title" className="modal-title m-0">{record.student.name}</h2><p className="meta-item mt-1">{record.subject}</p></div>
                    <CompletionBar value={record.completion} />
                </div>
                <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[440px] text-left text-sm">
                        <thead className="bg-[var(--table-header-background-color)] text-[var(--muted-text-color)]"><tr><th className="px-3 py-2.5 font-semibold">Assignment</th><th className="px-3 py-2.5 font-semibold">Status</th><th className="px-3 py-2.5 font-semibold">Submission Date</th></tr></thead>
                        <tbody>{record.assignments.map(({ assignment, submission }) => <tr key={assignment.id} className="border-b border-[var(--border-color)] last:border-0"><td className="px-3 py-2.5">{assignment.title}</td><td className="px-3 py-2.5"><span className={`badge ${submission.submitted ? "badge-green" : "badge-amber"}`}>{submission.submitted ? "Submitted" : "Pending"}</span></td><td className="whitespace-nowrap px-3 py-2.5">{submission.submittedAt ? formatDate(submission.submittedAt.slice(0, 10)) : "—"}</td></tr>)}</tbody>
                    </table>
                </div>
                <div className="mt-5 flex justify-end"><Button type="button" variant="outline" className="teacher-modal-dismiss" onClick={onClose}>Close</Button></div>
            </section>
        </div>
    );
}

function FormField({ label, children }) {
    return <label className="field flex flex-col gap-2"><span className="field-label">{label}</span>{children}</label>;
}
