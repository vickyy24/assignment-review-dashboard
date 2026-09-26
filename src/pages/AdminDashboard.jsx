import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import AdminAssignmentCard from "../components/admin/AdminAssignmentCard";
import CreateAssignmentModal from "../components/admin/CreateAssignmentModal";
import EditAssignmentModal from "../components/admin/EditAssignmentModal";
import { ClipboardList, GraduationCap, CheckCircle2, ChartNoAxesColumnIncreasing, Search, Inbox, SearchX } from "lucide-react";

export default function AdminDashboard() {
    const { currentUser, visibleAssignments, getAllStudents, theme } = useApp();
    const [showCreate, setShowCreate] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [search, setSearch] = useState("");

    const students = getAllStudents();
    const totalStudents = students.length;

    // Aggregate stats
    const totalAssignments = visibleAssignments.length;
    const totalSubmissions = visibleAssignments.reduce((sum, a) => {
        return (
            sum +
            Object.values(a.submissions).filter((submission) => {
                return submission.submitted;
            }).length
        );
    }, 0);
    const maxSubmissions = totalAssignments * totalStudents;
    const overallRate =
        maxSubmissions > 0
            ? Math.round((totalSubmissions / maxSubmissions) * 100)
            : 0;
    const overallRateColor =
        theme === "light" ? "text-[#367e59]" : "text-[#83cba1]";

    const filtered = visibleAssignments.filter((a) => {
        return (
            a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.subject.toLowerCase().includes(search.toLowerCase())
        );
    });

    const handleOpenCreate = () => {
        setShowCreate(true);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleEditAssignment = (event) => {
        const assignment = visibleAssignments.find((item) => {
            return item.id === event.currentTarget.dataset.assignmentId;
        });
        if (assignment) setEditTarget(assignment);
    };

    const handleCloseCreate = () => {
        setShowCreate(false);
    };

    const handleCloseEdit = () => {
        setEditTarget(null);
    };

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="mx-auto max-w-[1200px] px-7 pt-8 pb-[60px] max-md:px-4 max-md:pt-5 max-md:pb-12">
                {/* ── Welcome banner ── */}
                <section className="welcome-banner max-md:flex-col max-md:items-start max-md:gap-2 max-md:p-5 flex items-center justify-between gap-5 p-[25px_28px] mb-5">
                    <div className="relative z-10">
                        <h1 className="welcome-title text-[24px] max-md:text-[1.3rem]">
                            Welcome, {currentUser.name}
                        </h1>
                        <p className="welcome-sub">
                            Manage assignments and track student submission
                            progress.
                        </p>
                    </div>
                    <button
                        className="btn-primary btn-create inline-flex items-center justify-center gap-2"
                        onClick={handleOpenCreate}
                    >
                        <span>＋</span> New Assignment
                    </button>
                </section>

                {/* ── Stats row ── */}
                <div className="grid-cols-2 md:grid-cols-4 max-sm:gap-2 grid gap-3 mb-5">
                    <StatCard
                        Icon={ClipboardList}
                        label="Assignments"
                        value={totalAssignments}
                        color="blue"
                    />
                    <StatCard
                        Icon={GraduationCap}
                        label="Students"
                        value={totalStudents}
                        color="purple"
                    />
                    <StatCard
                        Icon={CheckCircle2}
                        label="Submissions"
                        value={totalSubmissions}
                        color="green"
                    />
                    <StatCard
                        Icon={ChartNoAxesColumnIncreasing}
                        label="Submit Rate"
                        value={`${overallRate}%`}
                        color="amber"
                    />
                </div>

                {/* ── Overall progress bar ── */}
                <div className="overall-progress-card">
                    <div className="op-header flex justify-between">
                        <span className="font-semibold">
                            Overall Submission Rate
                        </span>
                        <span className={overallRateColor}>{overallRate}%</span>
                    </div>
                    <div className="progress-track">
                        <div
                            className="progress-fill"
                            style={{ width: `${overallRate}%` }}
                        />
                    </div>
                    <p className="op-sub">
                        {totalSubmissions} of {maxSubmissions} possible
                        submissions received
                    </p>
                </div>

                {/* ── Search ── */}
                <div className="search-bar-wrap">
                    <span className="search-icon">
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        className={`search-bar ${theme === "light" ? "[&::placeholder]:text-[#8491a3]" : "[&::placeholder]:text-[#78879c]"}`}
                        placeholder="Search assignments by title or subject…"
                        value={search}
                        onChange={handleSearchChange}
                        aria-label="Search assignments"
                    />
                </div>

                {/* ── Assignment cards ── */}
                {filtered.length === 0 ? (
                    <div className="empty-state flex flex-col items-center gap-3">
                        <div className="text-4xl text-[#7798c1]">
                            {search ? (
                                <SearchX size={32} strokeWidth={1.7} />
                            ) : (
                                <Inbox size={32} strokeWidth={1.7} />
                            )}
                        </div>
                        <p>
                            {search
                                ? "No matching assignments."
                                : "No assignments yet. Create one!"}
                        </p>
                        {!search && (
                            <button
                                className="btn-primary inline-flex items-center justify-center gap-2"
                                onClick={handleOpenCreate}
                            >
                                Create Assignment
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-[14px]">
                        {filtered.map((assignment) => {
                            return (
                                <AdminAssignmentCard
                                    key={assignment.id}
                                    assignment={assignment}
                                    students={students}
                                    onEdit={handleEditAssignment}
                                />
                            );
                        })}
                    </div>
                )}
            </main>

            {showCreate && (
                <CreateAssignmentModal onClose={handleCloseCreate} />
            )}
            {editTarget && (
                <EditAssignmentModal
                    assignment={editTarget}
                    onClose={handleCloseEdit}
                />
            )}
        </div>
    );
}

function StatCard({ Icon, label, value, color }) {
    const iconBackground = {
        blue: "bg-[var(--stat-icon-background-color)]",
        green: "bg-[var(--stat-icon-green-background-color)]",
        amber: "bg-[var(--stat-icon-amber-background-color)]",
        red: "bg-[var(--stat-icon-red-background-color)]",
        purple: "bg-[var(--stat-icon-purple-background-color)]",
    }[color];

    return (
        <div className="stat-card max-sm:gap-2 max-sm:p-3 flex items-center gap-3 p-4">
            <span
                className={`stat-icon grid place-items-center ${iconBackground}`}
            >
                <Icon size={19} strokeWidth={1.8} />
            </span>
            <div>
                <p className="stat-value">{value}</p>
                <p className="stat-label">{label}</p>
            </div>
        </div>
    );
}
