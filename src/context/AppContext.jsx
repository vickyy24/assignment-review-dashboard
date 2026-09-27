import React, { createContext, useContext, useState, useEffect } from "react";
import { DEMO_DRIVE_LINK, USERS, INITIAL_ASSIGNMENTS } from "../data/mockData";

// ──────────────────────────────────────────────
//  Context
// ──────────────────────────────────────────────
const AppContext = createContext(null);
const SUBMISSION_EXAMPLES_MIGRATION_KEY = "eduboard_submission_examples_v5";
const MATERIAL_EXAMPLES_MIGRATION_KEY = "eduboard_material_examples_v4";
const ASSIGNMENT_ORDER_MIGRATION_KEY = "eduboard_assignment_order_v2";

function moveDataStructuresFirst(assignments) {
    const dataStructuresAssignment = assignments.find(
        (assignment) => assignment.id === "asgn-1",
    );
    if (!dataStructuresAssignment) {
        return assignments;
    }

    return [
        dataStructuresAssignment,
        ...assignments.filter((assignment) => assignment.id !== "asgn-1"),
    ];
}

function hasSubmissionContent(submission) {
    if (!submission || typeof submission !== "object") {
        return false;
    }

    if (
        submission.submissionType === "file" &&
        submission.fileName?.trim()
    ) {
        return true;
    }

    if (
        submission.submissionType === "text" &&
        submission.text?.trim()
    ) {
        return true;
    }

    if (submission.submissionType === "link" && submission.link) {
        try {
            const submissionUrl = new URL(submission.link);
            return ["http:", "https:"].includes(submissionUrl.protocol);
        } catch {
            return false;
        }
    }

    return false;
}

function normalizeAssignmentSubmissions(assignments) {
    return assignments.map((assignment) => {
        const submissions = { ...(assignment.submissions || {}) };
        const initialAssignment = INITIAL_ASSIGNMENTS.find((initialRecord) => {
            return initialRecord.id === assignment.id;
        });

        Object.entries(initialAssignment?.submissions || {}).forEach(
            ([studentId, initialSubmission]) => {
                const savedSubmission = submissions[studentId];
                if (
                    initialSubmission.submitted &&
                    !hasSubmissionContent(savedSubmission)
                ) {
                    submissions[studentId] = initialSubmission;
                } else if (
                    assignment.id === "asgn-3" &&
                    studentId === "student-2" &&
                    savedSubmission?.submissionType === "link" &&
                    savedSubmission.link === DEMO_DRIVE_LINK &&
                    savedSubmission.submittedAt === "2026-09-23T11:00:00Z"
                ) {
                    submissions[studentId] = initialSubmission;
                }
            },
        );

        return { ...assignment, submissions };
    });
}

function mergeInitialAssignments(
    savedAssignments,
    resetDemoSubmissions,
    seedDemoMaterials,
) {
    const savedAssignmentsById = new Map(
        savedAssignments.map((assignment) => {
            return [assignment.id, assignment];
        }),
    );
    const mergedAssignments = savedAssignments.map((savedAssignment) => {
        const initialAssignment = INITIAL_ASSIGNMENTS.find((assignment) => {
            return assignment.id === savedAssignment.id;
        });

        if (!initialAssignment) {
            return savedAssignment;
        }

        return {
            ...initialAssignment,
            ...savedAssignment,
            driveLink:
                savedAssignment.driveLink?.includes("/drive/folders/sample")
                    ? ""
                    : savedAssignment.driveLink ?? initialAssignment.driveLink,
            submissions: resetDemoSubmissions
                ? initialAssignment.submissions
                : savedAssignment.submissions ?? initialAssignment.submissions,
            materials:
                (seedDemoMaterials ||
                    (initialAssignment.id === "asgn-5" &&
                    savedAssignment.title === "Web Development Mini Project") ||
                savedAssignment.materials === undefined ||
                savedAssignment.id === "asgn-3" ||
                ((savedAssignment.id === "asgn-1" ||
                    savedAssignment.id === "asgn-2" ||
                    savedAssignment.id === "asgn-3" ||
                    savedAssignment.id === "asgn-4") &&
                    savedAssignment.materials?.some((material) =>
                        material.title === "Written instructions" ||
                        material.title === "ER diagram source.sql" ||
                        material.url?.includes("/drive/folders/sample") ||
                        material.url?.includes("dummy.pdf") ||
                        material.url === DEMO_DRIVE_LINK,
                    )))
                    ? initialAssignment.materials
                    : savedAssignment.materials,
            ...(initialAssignment.id === "asgn-5" &&
            savedAssignment.title === "Web Development Mini Project"
                ? {
                      title: initialAssignment.title,
                      description: initialAssignment.description,
                  }
                : {}),
        };
    });

    INITIAL_ASSIGNMENTS.forEach((initialAssignment) => {
        if (!savedAssignmentsById.has(initialAssignment.id)) {
            mergedAssignments.push(initialAssignment);
        }
    });

    return mergedAssignments;
}

function getInitialTheme() {
    try {
        return localStorage.getItem("eduboard_theme") || "dark";
    } catch {
        return "dark";
    }
}

export function AppProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.body.classList.toggle("theme-light", theme === "light");
        localStorage.setItem("eduboard_theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((value) => {
            return value === "dark" ? "light" : "dark";
        });
    };
    // ── Auth ──────────────────────────────────
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem("eduboard_user");
            if (!saved) return null;

            const savedUser = JSON.parse(saved);
            return USERS.find((userRecord) => userRecord.id === savedUser.id) || savedUser;
        } catch {
            return null;
        }
    });

    // ── Assignments ───────────────────────────
    const [assignments, setAssignments] = useState(() => {
        try {
            const saved = localStorage.getItem("eduboard_assignments");
            const shouldResetSubmissionExamples = !localStorage.getItem(
                SUBMISSION_EXAMPLES_MIGRATION_KEY,
            );
            const shouldSeedDemoMaterials = !localStorage.getItem(
                MATERIAL_EXAMPLES_MIGRATION_KEY,
            );
            const shouldMoveThirdAssignmentFirst = !localStorage.getItem(
                ASSIGNMENT_ORDER_MIGRATION_KEY,
            );
            const assignmentsToNormalize = saved
                ? mergeInitialAssignments(
                      JSON.parse(saved),
                      shouldResetSubmissionExamples,
                      shouldSeedDemoMaterials,
                  )
                : INITIAL_ASSIGNMENTS;
            if (shouldSeedDemoMaterials) {
                localStorage.setItem(
                    MATERIAL_EXAMPLES_MIGRATION_KEY,
                    "true",
                );
            }
            if (shouldResetSubmissionExamples) {
                localStorage.setItem(
                    SUBMISSION_EXAMPLES_MIGRATION_KEY,
                    "true",
                );
            }
            if (shouldMoveThirdAssignmentFirst) {
                localStorage.setItem(
                    ASSIGNMENT_ORDER_MIGRATION_KEY,
                    "true",
                );
            }
            const orderedAssignments = shouldMoveThirdAssignmentFirst
                ? moveDataStructuresFirst(assignmentsToNormalize)
                : assignmentsToNormalize;
            return normalizeAssignmentSubmissions(orderedAssignments);
        } catch {
            return normalizeAssignmentSubmissions(INITIAL_ASSIGNMENTS);
        }
    });

    // ── Persist to localStorage ───────────────
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("eduboard_user", JSON.stringify(currentUser));
        } else {
            localStorage.removeItem("eduboard_user");
        }
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem(
            "eduboard_assignments",
            JSON.stringify(assignments),
        );
    }, [assignments]);

    // ── Auth actions ──────────────────────────
    const login = (email, password) => {
        const user = USERS.find((userRecord) => {
            return (
                userRecord.email === email && userRecord.password === password
            );
        });
        if (!user) throw new Error("Invalid email or password");
        setCurrentUser(user);
        return user;
    };

    const logout = () => {
        setCurrentUser(null);
    };

    // ── Assignment actions ────────────────────
    const createAssignment = (data) => {
        const newAssignment = {
            id: `asgn-${Date.now()}`,
            ...data,
            createdBy: currentUser.id,
            createdAt: new Date().toISOString().split("T")[0],
            submissions: USERS.filter((userRecord) => {
                return userRecord.role === "student";
            }).reduce((submissionsByStudent, student) => {
                submissionsByStudent[student.id] = {
                    submitted: false,
                    submittedAt: null,
                };
                return submissionsByStudent;
            }, {}),
        };
        setAssignments((previousAssignments) => {
            return [newAssignment, ...previousAssignments];
        });
        return newAssignment;
    };

    const deleteAssignment = (assignmentId) => {
        setAssignments((previousAssignments) => {
            return previousAssignments.filter((assignment) => {
                return assignment.id !== assignmentId;
            });
        });
    };

    const updateAssignment = (assignmentId, data) => {
        setAssignments((previousAssignments) => {
            return previousAssignments.map((assignment) => {
                if (assignment.id === assignmentId) {
                    return { ...assignment, ...data };
                }

                return assignment;
            });
        });
    };

    // ── Student submission ────────────────────
    const submitAssignment = (assignmentId, submissionDetails = {}) => {
        if (!hasSubmissionContent(submissionDetails)) {
            return;
        }

        setAssignments((previousAssignments) => {
            return previousAssignments.map((assignment) => {
                if (assignment.id !== assignmentId) {
                    return assignment;
                }

                return {
                    ...assignment,
                    submissions: {
                        ...assignment.submissions,
                        [currentUser.id]: {
                            submitted: true,
                            submittedAt: new Date().toISOString(),
                            ...submissionDetails,
                        },
                    },
                };
            });
        });
    };

    const removeSubmission = (assignmentId) => {
        setAssignments((previousAssignments) => {
            return previousAssignments.map((assignment) => {
                if (assignment.id !== assignmentId) {
                    return assignment;
                }

                return {
                    ...assignment,
                    submissions: {
                        ...assignment.submissions,
                        [currentUser.id]: {
                            submitted: false,
                            submittedAt: null,
                            status: "pending",
                        },
                    },
                };
            });
        });
    };

    // ── Helpers ───────────────────────────────
    const getStudentsByIds = (ids) => {
        return USERS.filter((userRecord) => {
            return userRecord.role === "student" && ids.includes(userRecord.id);
        });
    };

    const getAllStudents = () => {
        return USERS.filter((userRecord) => {
            return userRecord.role === "student";
        });
    };

    const getUserById = (id) => {
        return USERS.find((userRecord) => {
            return userRecord.id === id;
        });
    };

    // ── Admin sees only their own assignments ──
    // The teacher dashboard monitors student submissions across the full demo.
    const visibleAssignments = assignments;

    return (
        <AppContext.Provider
            value={{
                theme,
                toggleTheme,
                currentUser,
                login,
                logout,
                assignments,
                visibleAssignments,
                createAssignment,
                deleteAssignment,
                updateAssignment,
                submitAssignment,
                removeSubmission,
                getStudentsByIds,
                getAllStudents,
                getUserById,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used within AppProvider");
    return ctx;
}
