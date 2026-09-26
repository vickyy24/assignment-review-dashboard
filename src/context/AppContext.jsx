import React, { createContext, useContext, useState, useEffect } from 'react';
import { USERS, INITIAL_ASSIGNMENTS } from '../data/mockData';

// ──────────────────────────────────────────────
//  Context
// ──────────────────────────────────────────────
const AppContext = createContext(null);

function getInitialTheme() {
  try {
    return localStorage.getItem('eduboard_theme') || 'dark';
  } catch {
    return 'dark';
  }
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('eduboard_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((value) => value === 'dark' ? 'light' : 'dark');
  // ── Auth ──────────────────────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('eduboard_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // ── Assignments ───────────────────────────
  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem('eduboard_assignments');
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });

  // ── Persist to localStorage ───────────────
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('eduboard_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('eduboard_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('eduboard_assignments', JSON.stringify(assignments));
  }, [assignments]);

  // ── Auth actions ──────────────────────────
  const login = (email, password) => {
    const user = USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw new Error('Invalid email or password');
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
      createdAt: new Date().toISOString().split('T')[0],
      submissions: USERS.filter((u) => u.role === 'student').reduce(
        (acc, s) => {
          acc[s.id] = { submitted: false, submittedAt: null };
          return acc;
        },
        {}
      ),
    };
    setAssignments((prev) => [newAssignment, ...prev]);
    return newAssignment;
  };

  const deleteAssignment = (assignmentId) => {
    setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
  };

  const updateAssignment = (assignmentId, data) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, ...data } : a))
    );
  };

  // ── Student submission ────────────────────
  const submitAssignment = (assignmentId) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== assignmentId) return a;
        return {
          ...a,
          submissions: {
            ...a.submissions,
            [currentUser.id]: {
              submitted: true,
              submittedAt: new Date().toISOString(),
            },
          },
        };
      })
    );
  };

  // ── Helpers ───────────────────────────────
  const getStudentsByIds = (ids) =>
    USERS.filter((u) => u.role === 'student' && ids.includes(u.id));

  const getAllStudents = () => USERS.filter((u) => u.role === 'student');

  const getUserById = (id) => USERS.find((u) => u.id === id);

  // ── Admin sees only their own assignments ──
  const visibleAssignments =
    currentUser?.role === 'admin'
      ? assignments.filter((a) => a.createdBy === currentUser.id)
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
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
