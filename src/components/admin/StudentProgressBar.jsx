import React from "react";
import { CircleCheck, Clock3 } from "lucide-react";
import { useApp } from "../../context/AppContext";

/**
 * Per-student progress bar inside an admin assignment card.
 */
export default function StudentProgressBar({ student, submission }) {
    const { theme } = useApp();
    const submitted = submission?.submitted;
    const statusColor =
        theme === "light"
            ? submitted
                ? "text-[#188451]"
                : "text-[#a76a10]"
            : submitted
              ? "text-[#80d4a2]"
              : "text-[#e7b86c]";
    const submittedAt = submission?.submittedAt
        ? new Date(submission.submittedAt).toLocaleDateString("en-IN", {
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
          })
        : null;

    return (
        <div className="spb-row flex items-center gap-[10px]">
            <div className="spb-avatar grid place-items-center flex-none">
                {student.avatar}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <span className="spb-name">{student.name}</span>
                    <span
                        className={`inline-flex items-center text-[9px] ${statusColor}`}
                    >
                        {submitted ? (
                            <>
                                <CircleCheck size={13} aria-hidden="true" />{" "}
                                Submitted
                            </>
                        ) : (
                            <>
                                <Clock3 size={13} aria-hidden="true" /> Pending
                            </>
                        )}
                    </span>
                </div>
                {/* Progress bar: 100% if submitted, 0% if not */}
                <div className="progress-track h-1">
                    <div
                        className={`progress-fill ${submitted ? "bg-[linear-gradient(90deg,#347b57,#70bd94)]" : "bg-[#526454]"}`}
                        style={{ width: submitted ? "100%" : "0%" }}
                    />
                </div>
                {submittedAt && (
                    <p className="spb-time">Submitted on {submittedAt}</p>
                )}
            </div>
        </div>
    );
}
