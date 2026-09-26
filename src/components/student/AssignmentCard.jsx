import React from "react";
import { CalendarDays, Check, CircleAlert, Link2 } from "lucide-react";
import Button from "../ui/Button";

/**
 * Individual assignment card shown to the student.
 */
export default function AssignmentCard({ assignment, onSubmit }) {
    const { title, description, dueDate, driveLink, subject, mySubmission } =
        assignment;
    const submitted = mySubmission?.submitted;

    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    const isOverdue = !submitted && diffDays < 0;
    const isDueSoon = !submitted && diffDays >= 0 && diffDays <= 3;

    const dueBadge = submitted
        ? { label: "Submitted", cls: "badge-green" }
        : isOverdue
          ? { label: "Overdue", cls: "badge-red" }
          : isDueSoon
            ? { label: `Due in ${diffDays}d`, cls: "badge-amber" }
            : {
                  label: `Due ${due.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`,
                  cls: "badge-blue",
              };

    return (
        <article
            className={`asgn-card border-l-[3px] ${submitted ? "border-l-[var(--success-color)]" : isOverdue ? "border-l-[var(--error-color)]" : "border-l-transparent"}`}
        >
            {/* Subject chip */}
            <div className="flex items-center justify-between gap-2">
                <span className="subject-chip">{subject}</span>
                <span className={`badge ${dueBadge.cls}`}>
                    {dueBadge.label}
                </span>
            </div>

            <h2 className="asgn-card-title">{title}</h2>
            <p className="asgn-card-desc">{description}</p>

            <div className="asgn-card-footer max-sm:flex-col max-sm:items-start flex items-center justify-between gap-3">
                <div className="asgn-meta">
                    <span className="meta-item inline-flex items-center gap-[7px]">
                        <CalendarDays size={14} aria-hidden="true" />
                        {due.toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                </div>

                <div className="max-sm:w-full max-sm:justify-between flex flex-wrap items-center gap-2">
                    {driveLink && (
                        <a
                            href={driveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline hover:bg-[var(--outline-button-hover-background)] inline-flex items-center justify-center gap-2"
                            aria-label="Open Drive link"
                        >
                            <Link2 size={14} aria-hidden="true" /> Drive
                        </a>
                    )}
                    {submitted ? (
                        <div className="submitted-chip">
                            <Check size={14} aria-hidden="true" />
                            Submitted{" "}
                            {mySubmission.submittedAt
                                ? new Date(
                                      mySubmission.submittedAt,
                                  ).toLocaleDateString("en-IN", {
                                      month: "short",
                                      day: "numeric",
                                  })
                                : ""}
                        </div>
                    ) : (
                        <Button
                            variant="submit"
                            className="inline-flex items-center justify-center gap-2"
                            onClick={onSubmit}
                            data-assignment-id={assignment.id}
                            disabled={isOverdue}
                        >
                            {isOverdue ? (
                                <>
                                    <CircleAlert size={14} aria-hidden="true" />{" "}
                                    Overdue
                                </>
                            ) : (
                                "Submit Assignment"
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </article>
    );
}
