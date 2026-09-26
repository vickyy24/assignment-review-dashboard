import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import StudentProgressBar from "./StudentProgressBar";
import Button from "../ui/Button";
import { CalendarDays, Link2, Pencil, Trash2, TriangleAlert } from "lucide-react";

export default function AdminAssignmentCard({ assignment, students, onEdit }) {
    const { deleteAssignment } = useApp();
    const [expanded, setExpanded] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const submittedCount = Object.values(assignment.submissions).filter(
        (submission) => {
            return submission.submitted;
        },
    ).length;
    const total = students.length;
    const rate = total > 0 ? Math.round((submittedCount / total) * 100) : 0;

    const due = new Date(assignment.dueDate);
    const isOverdue = due < new Date();

    const handleDelete = () => {
        if (confirmDelete) {
            deleteAssignment(assignment.id);
        } else {
            setConfirmDelete(true);
            setTimeout(() => {
                setConfirmDelete(false);
            }, 3000);
        }
    };

    const handleToggleStudents = () => {
        setExpanded((isExpanded) => {
            return !isExpanded;
        });
    };

    return (
        <article className="admin-card">
            {/* Header */}
            <div className="max-sm:flex-col flex items-start justify-between gap-[14px]">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="subject-chip">{assignment.subject}</span>
                    {isOverdue && (
                        <span className="badge badge-red">Overdue</span>
                    )}
                </div>
                <div className="admin-card-actions flex items-center gap-2 flex-wrap">
                    <Button
                        variant="plain"
                        className="icon-btn icon-btn-edit inline-flex items-center justify-center gap-2"
                        onClick={onEdit}
                        data-assignment-id={assignment.id}
                        aria-label="Edit assignment"
                    >
                        <Pencil size={14} aria-hidden="true" />
                    </Button>
                    <Button
                        variant="plain"
                        className={`icon-btn inline-flex items-center justify-center gap-2 ${confirmDelete ? "icon-btn-confirm animate-pulse" : "icon-btn-delete"}`}
                        onClick={handleDelete}
                        aria-label="Delete assignment"
                    >
                        {confirmDelete ? (
                            <>
                                <TriangleAlert size={14} aria-hidden="true" />{" "}
                                Confirm?
                            </>
                        ) : (
                            <Trash2 size={14} aria-hidden="true" />
                        )}
                    </Button>
                </div>
            </div>

            <h2 className="admin-card-title">{assignment.title}</h2>
            <p className="admin-card-desc">{assignment.description}</p>

            {/* Due date & drive link */}
            <div className="admin-card-info inline-flex items-center gap-2 flex-wrap justify-between">
                <span className="meta-item inline-flex items-center gap-[7px]">
                    <CalendarDays size={14} aria-hidden="true" />{" "}
                    {due.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                </span>
                {assignment.driveLink && (
                    <a
                        href={assignment.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline btn-outline-sm hover:bg-[var(--outline-button-hover-background)] inline-flex items-center justify-center gap-2"
                    >
                        <>
                            <Link2 size={14} aria-hidden="true" /> Drive Link
                        </>
                    </a>
                )}
            </div>

            {/* Overall progress bar */}
            <div className="submission-summary mt-[14px] mb-[10px]">
                <div className="flex items-center gap-2">
                    <span className="ss-label flex-1">Submissions</span>
                    <span className="ss-count">
                        {submittedCount}/{total}
                    </span>
                    <span className="ss-pct">{rate}%</span>
                </div>
                <div className="progress-track h-[5px]">
                    <div
                        className={`progress-fill ${rate === 100 ? "bg-[linear-gradient(90deg,var(--primary-button-background),var(--success-color))]" : ""}`}
                        style={{ width: `${rate}%` }}
                    />
                </div>
            </div>

            {/* Toggle student list */}
            <Button
                variant="plain"
                className="toggle-students-btn self-start hover:bg-[var(--toggle-students-hover-background)]"
                onClick={handleToggleStudents}
                aria-expanded={expanded}
            >
                {expanded ? "▲ Hide" : "▼ View"} student status
            </Button>

            {expanded && (
                <div className="flex flex-col gap-[7px]">
                    {students.map((student) => {
                        const sub = assignment.submissions[student.id] || {
                            submitted: false,
                        };
                        return (
                            <StudentProgressBar
                                key={student.id}
                                student={student}
                                submission={sub}
                            />
                        );
                    })}
                </div>
            )}
        </article>
    );
}
