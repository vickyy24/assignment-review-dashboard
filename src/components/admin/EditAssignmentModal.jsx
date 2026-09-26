import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Pencil, Save } from "lucide-react";
import { HTTP_URL_REGEX } from "../../utils/validation";

const SUBJECTS = [
    "Data Structures",
    "Operating Systems",
    "Database Management",
    "Computer Networks",
    "Web Development",
    "Machine Learning",
    "Software Engineering",
    "Other",
];

export default function EditAssignmentModal({ assignment, onClose }) {
    const { updateAssignment } = useApp();
    const [form, setForm] = useState({
        title: assignment.title,
        description: assignment.description,
        subject: assignment.subject,
        dueDate: assignment.dueDate,
        driveLink: assignment.driveLink || "",
        maxMarks: assignment.maxMarks || 100,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = "Title is required";
        if (!form.description.trim()) e.description = "Description is required";
        if (!form.dueDate) e.dueDate = "Due date is required";
        if (form.driveLink && !HTTP_URL_REGEX.test(form.driveLink.trim()))
            e.driveLink = "Enter a valid URL";
        return e;
    };

    const handleFieldChange = (event) => {
        const { name, value } = event.target;
        setForm((currentForm) => {
            return { ...currentForm, [name]: value };
        });
        setErrors((currentErrors) => {
            return { ...currentErrors, [name]: undefined };
        });
    };

    const handleDialogClick = (event) => {
        event.stopPropagation();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        setLoading(true);
        await new Promise((resolve) => {
            setTimeout(resolve, 500);
        });
        updateAssignment(assignment.id, form);
        setLoading(false);
        onClose();
    };

    return (
        <div
            className="modal-overlay fixed inset-0 z-30 grid place-items-center overflow-y-auto p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Edit assignment"
        >
            <div
                className="modal-box relative w-full max-w-[570px] max-h-screen overflow-auto p-[27px] text-left max-sm:p-[1.5rem_1.25rem]"
                onClick={handleDialogClick}
            >
                <button
                    className="modal-close absolute right-3 top-3 h-[30px] w-[30px]"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ✕
                </button>
                <div className="modal-icon text-[#7eaff4]">
                    <Pencil size={30} strokeWidth={1.7} />
                </div>
                <h2 className="modal-title">Edit Assignment</h2>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-[13px] mt-[18px]"
                    noValidate
                >
                    <div className="max-sm:grid-cols-1 grid grid-cols-2 gap-3">
                        <Field label="Title *" error={errors.title}>
                            <input
                                className={`field-input placeholder:text-[var(--field-placeholder-color)]${errors.title ? " border-[var(--error-color)]" : ""}`}
                                name="title"
                                value={form.title}
                                onChange={handleFieldChange}
                            />
                        </Field>
                        <Field label="Subject">
                            <select
                                className="field-input [&>option]:bg-[var(--select-option-background-color)]"
                                name="subject"
                                value={form.subject}
                                onChange={handleFieldChange}
                            >
                                {SUBJECTS.map((subject) => {
                                    return (
                                        <option key={subject}>{subject}</option>
                                    );
                                })}
                            </select>
                        </Field>
                    </div>

                    <Field label="Description *" error={errors.description}>
                        <textarea
                            className={`field-input placeholder:text-[var(--field-placeholder-color)] field-textarea${errors.description ? " border-[var(--error-color)]" : ""}`}
                            name="description"
                            rows={3}
                            value={form.description}
                            onChange={handleFieldChange}
                        />
                    </Field>

                    <div className="max-sm:grid-cols-1 grid grid-cols-2 gap-3">
                        <Field label="Due Date *" error={errors.dueDate}>
                            <input
                                type="date"
                                className={`field-input placeholder:text-[var(--field-placeholder-color)]${errors.dueDate ? " border-[var(--error-color)]" : ""}`}
                                name="dueDate"
                                value={form.dueDate}
                                onChange={handleFieldChange}
                            />
                        </Field>
                        <Field label="Max Marks">
                            <input
                                type="number"
                                className="field-input placeholder:text-[var(--field-placeholder-color)]"
                                name="maxMarks"
                                value={form.maxMarks}
                                onChange={handleFieldChange}
                                min={1}
                                max={1000}
                            />
                        </Field>
                    </div>

                    <Field
                        label="Google Drive Link (optional)"
                        error={errors.driveLink}
                    >
                        <input
                            type="text"
                            inputMode="url"
                            className={`field-input placeholder:text-[var(--field-placeholder-color)]${errors.driveLink ? " border-[var(--error-color)]" : ""}`}
                            name="driveLink"
                            value={form.driveLink}
                            onChange={handleFieldChange}
                            placeholder="https://drive.google.com/…"
                        />
                    </Field>

                    <div className="flex flex-wrap justify-end gap-[9px] mt-[5px]">
                        <button
                            type="button"
                            className="btn-ghost hover:bg-[var(--button-ghost-hover-background)] inline-flex items-center justify-center gap-2"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary inline-flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner animate-spin" />
                            ) : (
                                <>
                                    <Save size={15} aria-hidden="true" /> Save
                                    Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div className="field flex flex-col gap-[7px]">
            <label className="field-label">{label}</label>
            {children}
            {error && <p className="field-error">{error}</p>}
        </div>
    );
}
