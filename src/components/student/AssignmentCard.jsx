import React from "react";
import { CalendarDays, Check, Link2 } from "lucide-react";

/**
 * Individual assignment card shown to the student.
 */
export default function AssignmentCard({ assignment }) {
    const { title, description, dueDate, driveLink, subject, mySubmission } =
        assignment;
    const submitted = mySubmission?.submitted;

    const due = new Date(dueDate);
    const dueBadge = submitted
        ? { label: "Submitted", cls: "badge-green" }
        : { label: "Pending", cls: "badge-amber" };

    return (
        <article
            className={`asgn-card border-l-[3px] ${submitted ? "border-l-[var(--success-color)]" : "border-l-transparent"}`}
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
                    ) : null}
                </div>
            </div>
        </article>
    );
}
