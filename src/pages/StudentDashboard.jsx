import React, { useState } from "react";
import AssignmentDetailsModal from "../components/student/AssignmentDetailsModal";
import AssignmentsTab from "../components/student/AssignmentsTab";
import ProgressTab from "../components/student/ProgressTab";
import SubmissionFormModal from "../components/student/SubmissionFormModal";
import SubmissionsTab from "../components/student/SubmissionsTab";
import AppLayout from "../components/layout/AppLayout";
import Button from "../components/ui/Button";
import { useApp } from "../context/AppContext";
import { ChartNoAxesColumnIncreasing, ClipboardCheck, FileText, Info, Megaphone } from "lucide-react";

const announcements = [
    {
        title: "Mid Term Submission Guidelines",
        date: "28 Sep 2026",
        description:
            "Review the submission checklist before uploading your work.",
        Icon: Megaphone,
    },
    {
        title: "Lab Files Updated",
        date: "25 Sep 2026",
        description:
            "Updated reference files are available in your assignment Drive links.",
        Icon: FileText,
    },
    {
        title: "System Maintenance",
        date: "20 Sep 2026",
        description: "The portal will be under maintenance on 2 Oct 2026.",
        Icon: Info,
    },
];

const formatDueDate = (date) => {
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(`${date}T12:00:00`));
};

function getAssignmentStatus(assignment) {
    if (assignment.mySubmission.submitted) {
        return { label: "Submitted", className: "badge-green" };
    }

    return { label: "Pending", className: "badge-amber" };
}

export default function StudentDashboard() {
    const {
        currentUser,
        visibleAssignments,
    } = useApp();
    const [search, setSearch] = useState("");
    const [activeSection, setActiveSection] = useState("assignments");
    const [assignmentStatusFilter, setAssignmentStatusFilter] =
        useState("All");
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [activeSubmissionAssignment, setActiveSubmissionAssignment] =
        useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const myAssignments = visibleAssignments.map((assignment) => {
        return {
            ...assignment,
            mySubmission: assignment.submissions[currentUser.id] || {
                submitted: false,
                submittedAt: null,
            },
        };
    });
    const searchMatchedAssignments = myAssignments.filter((assignment) => {
        const matchesSearch = `${assignment.title} ${assignment.subject} ${assignment.description}`
            .toLowerCase()
            .includes(search.toLowerCase());
        return matchesSearch;
    });
    const assignmentFilterCounts = myAssignments.reduce(
        (counts, assignment) => {
            const status = getAssignmentStatus(assignment).label;
            counts.All += 1;
            if (status === "Submitted") {
                counts.Submitted += 1;
            } else {
                counts.Pending += 1;
            }
            return counts;
        },
        { All: 0, Pending: 0, Submitted: 0 },
    );
    const navigationItems = [
        { label: "Assignments", target: "assignments", Icon: FileText },
        {
            label: "Submissions",
            target: "submissions",
            Icon: ClipboardCheck,
        },
        {
            label: "Progress",
            target: "progress",
            Icon: ChartNoAxesColumnIncreasing,
        },
    ];

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleAssignmentStatusFilterChange = (filter) => {
        setAssignmentStatusFilter(filter);
    };
    const handleSectionNavigation = (event) => {
        const target = event.currentTarget.dataset.target;
        setActiveSection(target);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const handleOpenAssignment = (eventOrAssignmentId) => {
        const assignmentId =
            typeof eventOrAssignmentId === "string"
                ? eventOrAssignmentId
                : eventOrAssignmentId.currentTarget.dataset.assignmentId;
        const assignment = myAssignments.find((item) => {
            return item.id === assignmentId;
        });
        if (assignment) setSelectedAssignment(assignment);
    };

    const handleOpenSubmittedWork = (assignmentId) => {
        const assignment = myAssignments.find((item) => {
            return item.id === assignmentId;
        });
        if (assignment?.mySubmission?.submitted) {
            setSelectedAssignment({ ...assignment, showSubmittedWork: true });
        }
    };

    const handleOpenSubmission = (assignmentId) => {
        const assignment = myAssignments.find((item) => {
            return item.id === assignmentId;
        });
        if (assignment) setActiveSubmissionAssignment(assignment);
    };

    const handleCloseSubmission = () => {
        setActiveSubmissionAssignment(null);
    };

    const handleCloseAssignmentDetails = () => {
        setSelectedAssignment(null);
    };

    const handleSidebarToggle = () => {
        setSidebarOpen((isOpen) => {
            return !isOpen;
        });
    };

    return (
        <AppLayout
            navigationItems={navigationItems}
            activeSection={activeSection}
            onNavigate={handleSectionNavigation}
            sidebarOpen={sidebarOpen}
            mobileNavOpen={mobileNavOpen}
            onToggleSidebar={handleSidebarToggle}
            onOpenMobile={() => setMobileNavOpen(true)}
            onCloseMobile={() => setMobileNavOpen(false)}
            search={search}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search assignments..."
            onNotificationClick={handleSectionNavigation}
            notificationLabel="View announcements"
            roleLabel="Student"
        >
            {activeSection === "assignments" && (
                <AssignmentsTab
                    assignments={searchMatchedAssignments}
                    selectedFilter={assignmentStatusFilter}
                    filterCounts={assignmentFilterCounts}
                    onFilterChange={handleAssignmentStatusFilterChange}
                    onViewDetails={handleOpenAssignment}
                    getAssignmentStatus={getAssignmentStatus}
                    formatDueDate={formatDueDate}
                    sidebarOpen={sidebarOpen}
                />
            )}

            {activeSection === "submissions" && (
                <SubmissionsTab
                    assignments={searchMatchedAssignments}
                    onViewDetails={handleOpenSubmittedWork}
                    onSubmitAssignment={handleOpenSubmission}
                    formatDueDate={formatDueDate}
                    sidebarOpen={sidebarOpen}
                />
            )}

            {activeSection === "progress" && (
                <ProgressTab
                    assignments={searchMatchedAssignments}
                    getAssignmentStatus={getAssignmentStatus}
                    onViewDetails={handleOpenAssignment}
                    sidebarOpen={sidebarOpen}
                />
            )}

{selectedAssignment && (
                <AssignmentDetailsModal
                    assignment={selectedAssignment}
                    status={getAssignmentStatus(selectedAssignment)}
                    showSubmittedWork={selectedAssignment.showSubmittedWork}
                    onClose={handleCloseAssignmentDetails}
                />
            )}

            {activeSubmissionAssignment && (
                <SubmissionFormModal
                    assignment={activeSubmissionAssignment}
                    onClose={handleCloseSubmission}
                />
            )}
        </AppLayout>
    );
}
