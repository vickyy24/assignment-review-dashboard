import React, { useEffect, useRef, useState } from "react";
import {
    CalendarDays,
    Check,
    CloudUpload,
    FileText,
    Link2,
    TriangleAlert,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import Button from "../ui/Button";

export default function SubmissionFormModal({ assignment, onClose }) {
    const { submitAssignment } = useApp();
    const fileInputRef = useRef(null);
    const [form, setForm] = useState({
        type: "file",
        file: null,
        text: "",
        link: "",
    });
    const [error, setError] = useState("");
    const [step, setStep] = useState("form");
    const [isSaving, setIsSaving] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleDialogClick = (event) => {
        event.stopPropagation();
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setForm((currentForm) => {
            return { ...currentForm, [name]: value };
        });
        setError("");
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] || null;
        setForm((currentForm) => {
            return { ...currentForm, file };
        });
        setError("");
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsDragging(false);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0] || null;
        if (file) {
            setForm((currentForm) => {
                return { ...currentForm, file };
            });
            setError("");
        }
    };

    const handleChooseFile = () => {
        fileInputRef.current?.click();
    };

    const validateSubmission = () => {
        if (form.type === "file" && !form.file) {
            return "Choose a file before confirming your submission.";
        }
        if (form.type === "text" && !form.text.trim()) {
            return "Enter your submission text before confirming your submission.";
        }
        if (form.type === "link") {
            try {
                const submissionUrl = new URL(form.link.trim());
                if (!["http:", "https:"].includes(submissionUrl.protocol)) {
                    return "Enter a valid web link.";
                }
            } catch {
                return "Enter a valid web link.";
            }
        }
        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationError = validateSubmission();
        if (validationError) {
            setError(validationError);
            return;
        }
        setIsSaving(true);
        await new Promise((resolve) => {
            setTimeout(resolve, 500);
        });
        submitAssignment(assignment.id, {
            submissionType: form.type,
            fileName: form.file?.name || "",
            fileType: form.file?.type || "",
            text: form.type === "text" ? form.text.trim() : "",
            link: form.type === "link" ? form.link.trim() : "",
        });
        setIsSaving(false);
        setStep("done");
        setTimeout(onClose, 1100);
    };

    const formattedDueDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(`${assignment.dueDate}T12:00:00`));

    return (
        <div
            className="modal-overlay fixed inset-0 z-30 grid place-items-center overflow-y-auto p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="submission-dialog-title"
        >
            <section
                className="modal-box modal-scroll relative max-h-[92vh] w-full max-w-[520px] overflow-y-auto p-5 text-left sm:p-6"
                onClick={handleDialogClick}
            >
                <Button
                    className="modal-close absolute right-3 top-3 h-[30px] w-[30px]"
                    onClick={onClose}
                    aria-label="Close submission dialog"
                >
                    ×
                </Button>

                <h2
                    id="submission-dialog-title"
                    className="modal-title mb-5 pr-9 text-left"
                >
                    {step === "confirm"
                        ? "Confirm Submission"
                        : step === "done"
                          ? "Submission Recorded"
                          : "Submit Assignment"}
                </h2>

                <div className="mb-4 flex items-start gap-3 rounded-lg border border-[var(--border-color)] bg-[var(--secondary-panel-background-color)] p-3">
                    <span className="stat-icon grid flex-none place-items-center">
                        <FileText size={19} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                        <h3 className="asgn-card-title m-0 break-words">
                            {assignment.title}
                        </h3>
                        <p className="meta-item mt-1">Subject: {assignment.subject}</p>
                        <p className="meta-item mt-1 inline-flex items-center gap-1.5">
                            <CalendarDays size={14} aria-hidden="true" />
                            Due date: {formattedDueDate}
                        </p>
                    </div>
                </div>

                {step === "form" && (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <label className="block">
                            <span className="field-label mb-1.5 block">
                                Submission Type
                                <span className="text-[var(--error-color)]">
                                    {" "}*
                                </span>
                            </span>
                            <select
                                className="field-input w-full"
                                name="type"
                                value={form.type}
                                onChange={handleFormChange}
                            >
                                <option value="file">Upload File</option>
                                <option value="text">Text Entry</option>
                                <option value="link">External Link</option>
                            </select>
                        </label>

                        {form.type === "file" && (
                            <div>
                                <span className="field-label mb-1.5 block">
                                    Upload File
                                    <span className="text-[var(--error-color)]">
                                        {" "}*
                                    </span>
                                </span>
                                <input
                                    className="hidden"
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileChange}
                                    aria-label="Choose submission file"
                                />
                                <div
                                    className={`rounded-lg border border-dashed p-5 text-center transition-colors ${isDragging ? "border-[var(--brand-primary-color)] bg-[var(--outline-button-hover-background)]" : "border-[var(--outline-button-border-color)]"}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <CloudUpload
                                        className="mx-auto text-[var(--brand-primary-color)]"
                                        size={28}
                                        aria-hidden="true"
                                    />
                                    {form.file ? (
                                        <p className="modal-body mt-2 break-all">
                                            {form.file.name}
                                        </p>
                                    ) : (
                                        <p className="modal-body mt-2">
                                            Drag and drop your file here
                                        </p>
                                    )}
                                    <p className="stat-label my-1">or</p>
                                    <Button
                                        variant="outline"
                                        className="inline-flex items-center justify-center gap-2"
                                        onClick={handleChooseFile}
                                    >
                                        Choose File
                                    </Button>
                                </div>
                            </div>
                        )}

                        {form.type === "text" && (
                            <label className="block">
                                <span className="field-label mb-1.5 block">
                                    Submission Text
                                    <span className="text-[var(--error-color)]">
                                        {" "}*
                                    </span>
                                </span>
                                <textarea
                                    className="field-input min-h-32 w-full resize-y"
                                    name="text"
                                    value={form.text}
                                    onChange={handleFormChange}
                                    placeholder="Write your submission here"
                                />
                            </label>
                        )}

                        {form.type === "link" && (
                            <label className="block">
                                <span className="field-label mb-1.5 block">
                                    Submission Link
                                    <span className="text-[var(--error-color)]">
                                        {" "}*
                                    </span>
                                </span>
                                <span className="relative block">
                                    <Link2
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text-color)]"
                                        size={16}
                                        aria-hidden="true"
                                    />
                                    <input
                                        className="field-input w-full !pl-10"
                                        name="link"
                                        value={form.link}
                                        onChange={handleFormChange}
                                        placeholder="https://"
                                    />
                                </span>
                            </label>
                        )}

                        {error && (
                            <p
                                className="m-0 flex items-center gap-2 text-sm text-[var(--error-color)]"
                                role="alert"
                            >
                                <TriangleAlert size={16} aria-hidden="true" />
                                {error}
                            </p>
                        )}

                        <div className="flex flex-col-reverse justify-end gap-2 pt-1 sm:flex-row">
                            <Button
                                variant="outline"
                                className="inline-flex min-h-10 items-center justify-center"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                className="inline-flex min-h-10 items-center justify-center"
                                disabled={isSaving}
                            >
                                {isSaving ? "Submitting…" : "Submit"}
                            </Button>
                        </div>
                    </form>
                )}

                {step === "done" && (
                    <div className="py-3 text-center">
                        <Check
                            className="mx-auto text-[var(--success-color)]"
                            size={34}
                            aria-hidden="true"
                        />
                        <p className="modal-body mt-3">
                            Your submission has been recorded.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
