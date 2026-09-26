import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { CircleCheck, CircleHelp, TriangleAlert } from "lucide-react";

/**
 * Double-verification flow:
 *   Step 1 → "Yes, I have submitted"
 *   Step 2 → Final confirmation
 */
export default function SubmitModal({ assignment, onClose }) {
    const { submitAssignment } = useApp();
    const [step, setStep] = useState(1); // 1 | 2 | 'done'
    const [loading, setLoading] = useState(false);

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleFirstConfirm = () => {
        setStep(2);
    };

    const handleGoBack = () => {
        setStep(1);
    };

    const handleDialogClick = (event) => {
        event.stopPropagation();
    };

    const handleFinalConfirm = async () => {
        setLoading(true);
        await new Promise((resolve) => {
            setTimeout(resolve, 800);
        }); // simulate async
        submitAssignment(assignment.id);
        setStep("done");
        setLoading(false);
        setTimeout(onClose, 1400);
    };

    if (assignment.mySubmission?.submitted) {
        return (
            <div
                className="modal-overlay fixed inset-0 z-30 grid place-items-center overflow-y-auto p-4"
                onClick={onClose}
                role="dialog"
                aria-modal="true"
                aria-label="Assignment details"
            >
                <div
                    className="modal-box relative w-full max-w-[440px] p-[27px] text-center max-sm:p-[1.5rem_1.25rem]"
                    onClick={handleDialogClick}
                >
                    <button
                        className="modal-close absolute right-3 top-3 h-[30px] w-[30px]"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                    <div className="modal-icon text-[#438a60]">
                        <CircleCheck size={34} strokeWidth={1.7} />
                    </div>
                    <h2 className="modal-title">Assignment Details</h2>
                    <p className="modal-body">
                        <strong className="text-[var(--modal-strong-color)]">
                            {assignment.title}
                        </strong>{" "}
                        is marked as submitted.
                    </p>
                    <button
                        className="btn-primary inline-flex items-center justify-center"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="modal-overlay fixed inset-0 z-30 grid place-items-center overflow-y-auto p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Submit assignment"
        >
            <div
                className="modal-box relative w-full max-w-[440px] max-h-screen overflow-auto p-[27px] text-center max-sm:p-[1.5rem_1.25rem]"
                onClick={handleDialogClick}
            >
                <button
                    className="modal-close absolute right-3 top-3 h-[30px] w-[30px]"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    ✕
                </button>

                {step === 1 && (
                    <>
                        <div className="modal-icon text-[#7eaff4]">
                            <CircleHelp size={34} strokeWidth={1.7} />
                        </div>
                        <h2 className="modal-title">Submit Assignment?</h2>
                        <p className="modal-body">
                            You're about to mark{" "}
                            <strong className="text-[var(--modal-strong-color)]">
                                "{assignment.title}"
                            </strong>{" "}
                            as submitted. Have you completed and uploaded your
                            work to the Drive link?
                        </p>
                        <div className="flex flex-wrap justify-center gap-[9px]">
                            <button
                                className="btn-ghost hover:bg-[var(--button-ghost-hover-background)] inline-flex items-center justify-center gap-2"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary inline-flex items-center justify-center gap-2"
                                onClick={handleFirstConfirm}
                            >
                                Yes, I have submitted
                            </button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="modal-icon text-[#e6ad57]">
                            <TriangleAlert size={34} strokeWidth={1.7} />
                        </div>
                        <h2 className="modal-title">Final Confirmation</h2>
                        <p className="modal-body">
                            This action{" "}
                            <strong className="text-[var(--modal-strong-color)]">
                                cannot be undone
                            </strong>
                            . Once confirmed, your assignment will be recorded
                            as submitted. Are you absolutely sure?
                        </p>
                        <div className="flex flex-wrap justify-center gap-[9px]">
                            <button
                                className="btn-ghost hover:bg-[var(--button-ghost-hover-background)] inline-flex items-center justify-center gap-2"
                                onClick={handleGoBack}
                            >
                                Go Back
                            </button>
                            <button
                                className="btn-danger inline-flex items-center justify-center gap-2"
                                onClick={handleFinalConfirm}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner animate-spin" />
                                ) : (
                                    "Confirm Submission"
                                )}
                            </button>
                        </div>
                    </>
                )}

                {step === "done" && (
                    <>
                        <div className="modal-icon text-[#45bd8c]">
                            <CircleCheck size={34} strokeWidth={1.7} />
                        </div>
                        <h2 className="modal-title">Submission Recorded!</h2>
                        <p className="modal-body">
                            Your submission for{" "}
                            <strong className="text-[var(--modal-strong-color)]">
                                "{assignment.title}"
                            </strong>{" "}
                            has been marked. Great work!
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
