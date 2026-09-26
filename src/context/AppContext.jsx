import React, { createContext, useContext, useState, useEffect } from "react";
import { USERS, INITIAL_ASSIGNMENTS } from "../data/mockData";

// ──────────────────────────────────────────────
//  Context
// ──────────────────────────────────────────────
const AppContext = createContext(null);

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
                }
            },
        );

        return { ...assignment, submissions };
    });
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
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    // ── Assignments ───────────────────────────
    const [assignments, setAssignments] = useState(() => {
        try {
            const saved = localStorage.getItem("eduboard_assignments");
            const assignmentsToNormalize = saved
                ? JSON.parse(saved)
                : INITIAL_ASSIGNMENTS;
            return normalizeAssignmentSubmissions(assignmentsToNormalize);
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
    const visibleAssignments =
        currentUser?.role === "admin"
            ? assignments.filter((assignment) => {
                  return assignment.createdBy === currentUser.id;
              })
            : assignments;

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
