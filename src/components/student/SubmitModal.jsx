import React from "react";
import SubmissionFormModal from "./SubmissionFormModal";

export default function SubmitModal({ assignment, onClose }) {
    return (
        <SubmissionFormModal
            assignment={assignment}
            onClose={onClose}
        />
    );
}
