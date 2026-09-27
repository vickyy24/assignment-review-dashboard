import React, { useEffect } from "react";
import {
    AlignLeft,
    CalendarDays,
    ExternalLink,
    FileText,
    Link2,
} from "lucide-react";
import Button from "../ui/Button";

function getAssignmentMaterials(assignment) {
    const materials = Array.isArray(assignment.materials)
        ? [...assignment.materials]
        : [];

    if (assignment.pdfUrl) {
        materials.push({
            type: "pdf",
            title: "PDF document",
            url: assignment.pdfUrl,
        });
    }

    if (assignment.pdfLink) {
        materials.push({
            type: "pdf",
            title: "PDF document",
            url: assignment.pdfLink,
        });
    }

    if (assignment.driveLink) {
        materials.push({
            type: "link",
            url: assignment.driveLink,
        });
    }

    return materials.filter((material, index) => {
        if (!material.url) {
            return true;
        }

        return materials.findIndex((candidate) => {
            return candidate.url === material.url;
        }) === index;
    });
}

export default function AssignmentDetailsModal({
    assignment,
    status,
    showSubmittedWork = false,
    onClose,
}) {
    const materials = getAssignmentMaterials(assignment);
    const submission = assignment.mySubmission;

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleDialogClick = (event) => {
        event.stopPropagation();
    };

    return (
        <div
            className="modal-overlay fixed inset-0 z-30 grid place-items-center overflow-y-auto p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="assignment-details-title"
        >
            <section
                className="modal-box modal-scroll relative max-h-[90vh] w-full max-w-[620px] overflow-y-auto p-6 text-left sm:p-7"
                onClick={handleDialogClick}
            >
                <Button
                    className="modal-close absolute right-3 top-3 h-[30px] w-[30px]"
                    onClick={onClose}
                    aria-label="Close assignment details"
                >
                    ×
                </Button>

                <div className="mb-5 flex flex-wrap items-start justify-between gap-3 pr-9">
                    <div className="flex min-w-0 items-start gap-3">
                        <span className="stat-icon grid flex-none place-items-center">
                            <FileText size={20} aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                            <p className="stat-label mb-1">Assignment details</p>
                            <h2
                                id="assignment-details-title"
                                className="modal-title m-0 break-words text-left"
                            >
                                {assignment.title}
                            </h2>
                        </div>
                    </div>
                    <span className={`badge ${status.className}`}>
                        {status.label}
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-[var(--border-color)] bg-[var(--secondary-panel-background-color)] p-3">
                        <p className="stat-label mb-1">Subject</p>
                        <p className="m-0 font-semibold">{assignment.subject}</p>
                    </div>
                    <div className="rounded-lg border border-[var(--border-color)] bg-[var(--secondary-panel-background-color)] p-3">
                        <p className="stat-label mb-1 inline-flex items-center gap-1.5">
                            <CalendarDays size={14} aria-hidden="true" /> Due date
                        </p>
                        <p className="m-0 font-semibold">
                            {new Intl.DateTimeFormat("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            }).format(
                                new Date(`${assignment.dueDate}T12:00:00`),
                            )}
                        </p>
                    </div>
                </div>

                <div className="mt-5">
                    <h3 className="asgn-card-title m-0">Instructions / text</h3>
                    <p className="modal-body mt-2 whitespace-pre-wrap text-left">
                        {assignment.description ||
                            "No additional instructions were provided."}
                    </p>
                </div>

                {showSubmittedWork ? (
                    <div className="mt-5 rounded-lg border border-[var(--border-color)] p-4">
                        <h3 className="asgn-card-title m-0">Your submitted work</h3>
                        {submission?.submissionType === "link" && submission.link ? (
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--border-color)] bg-[var(--secondary-panel-background-color)] p-3">
                                <p className="stat-label m-0 inline-flex items-center gap-2">
                                    <Link2 size={16} aria-hidden="true" />
                                    Google Drive submission
                                </p>
                                <a
                                    className="assignment-material-open inline-flex items-center justify-center gap-2"
                                    href={submission.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Open submitted Google Drive link"
                                >
                                    Open
                                    <ExternalLink size={14} aria-hidden="true" />
                                </a>
                            </div>
                        ) : submission?.submissionType === "file" ? (
                            <p className="modal-body mt-2 break-words">
                                Submitted file: {submission.fileName || "Uploaded file"}
                            </p>
                        ) : submission?.submissionType === "text" ? (
                            <p className="modal-body mt-2 whitespace-pre-wrap break-words">
                                {submission.text}
                            </p>
                        ) : (
                            <p className="stat-label mt-2">No submitted work was recorded.</p>
                        )}
                        {submission?.submittedAt && (
                            <p className="stat-label mt-3">
                                Submitted {new Intl.DateTimeFormat("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                }).format(new Date(submission.submittedAt))}
                            </p>
                        )}
                    </div>
                ) : materials.length > 0 && <div className="mt-5 rounded-lg border border-[var(--border-color)] p-4">
                    <h3 className="asgn-card-title m-0">Materials from your instructor</h3>
                    {materials.length > 0 ? (
                        <div className="mt-3 space-y-3">
                            {materials.map((material, index) => {
                                const materialType = String(
                                    material.type || "link",
                                ).toLowerCase();
                                const isText = materialType === "text";
                                const isFile = materialType === "file";
                                const isPdf =
                                    materialType === "pdf" ||
                                    /\.pdf(?:$|[?#])/i.test(
                                        material.url || "",
                                    );
                                const materialTitle =
                                    material.title ||
                                    (isText
                                        ? "Text material"
                                        : isPdf
                                          ? "PDF document"
                                          : isFile
                                            ? "Attached file"
                                            : "Drive link");

                                return (
                                    <div
                                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--border-color)] bg-[var(--secondary-panel-background-color)] p-3"
                                        key={`${material.url || materialTitle}-${index}`}
                                    >
                                        <div className="min-w-0 flex-1">
                                            {!isText && <p className="stat-label m-0 inline-flex items-center gap-2">
                                                {isText ? (
                                                    <AlignLeft
                                                        size={16}
                                                        aria-hidden="true"
                                                    />
                                                ) : isPdf || isFile ? (
                                                    <FileText
                                                        size={16}
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <Link2
                                                        size={16}
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                {materialTitle}
                                            </p>}
                                            {isText && material.content && (
                                                <p className="modal-body mt-2 whitespace-pre-wrap text-left">
                                                    {material.content}
                                                </p>
                                            )}
                                        </div>
                                        {!isText && material.url && (
                                            <a
                                            className="assignment-material-open inline-flex items-center justify-center gap-2"
                                                href={material.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            aria-label={`Open ${materialTitle}`}
                                            >
                                            Open
                                                <ExternalLink
                                                    size={14}
                                                    aria-hidden="true"
                                                />
                                            </a>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="stat-label mt-2">
                            No external file or link was attached. Follow the
                            written instructions above.
                        </p>
                    )}
                </div>}

                <div className="mt-6 flex flex-wrap justify-end gap-2">
                    <Button
                        variant="danger"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            </section>
        </div>
    );
}
