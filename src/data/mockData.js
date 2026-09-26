// ──────────────────────────────────────────────
//  Mock Users
// ──────────────────────────────────────────────
export const USERS = [
    {
        id: "student-1",
        name: "Arjun Mehta",
        email: "arjun@student.edu",
        role: "student",
        avatar: "AM",
        password: "student123",
    },
    {
        id: "student-2",
        name: "Priya Sharma",
        email: "priya@student.edu",
        role: "student",
        avatar: "PS",
        password: "student123",
    },
    {
        id: "student-3",
        name: "Rohit Verma",
        email: "rohit@student.edu",
        role: "student",
        avatar: "RV",
        password: "student123",
    },
    {
        id: "student-4",
        name: "Sneha Kapoor",
        email: "sneha@student.edu",
        role: "student",
        avatar: "SK",
        password: "student123",
    },
    {
        id: "student-5",
        name: "Kavya Iyer",
        email: "kavya@student.edu",
        role: "student",
        avatar: "KI",
        password: "student123",
    },
    {
        id: "admin-1",
        name: "Dr. Ramesh Kumar",
        email: "ramesh@prof.edu",
        role: "admin",
        avatar: "RK",
        password: "admin123",
    },
    {
        id: "admin-2",
        name: "Prof. Anjali Nair",
        email: "anjali@prof.edu",
        role: "admin",
        avatar: "AN",
        password: "admin123",
    },
    {
        id: "admin-3",
        name: "Prof. Dev Patel",
        email: "dev@prof.edu",
        role: "admin",
        avatar: "DP",
        password: "admin123",
    },
];

// ──────────────────────────────────────────────
//  Mock Assignments
// ──────────────────────────────────────────────
export const INITIAL_ASSIGNMENTS = [
    {
        id: "asgn-1",
        title: "Data Structures: Binary Trees",
        description:
            "Implement a balanced binary search tree with insert, delete, and search operations. Include time-complexity analysis in your report.",
        dueDate: "2026-10-05",
        driveLink: "https://drive.google.com/drive/folders/sample1",
        createdBy: "admin-1",
        createdAt: "2026-09-20",
        subject: "Data Structures",
        maxMarks: 100,
        materials: [
            {
                type: "text",
                title: "Written instructions",
                content:
                    "Implement insert, search, and delete operations. Include your complexity analysis and test cases.",
            },
        ],
        submissions: {
            "student-1": {
                submitted: true,
                submittedAt: "2026-09-24T10:30:00Z",
            },
            "student-2": { submitted: false, submittedAt: null },
            "student-3": {
                submitted: true,
                submittedAt: "2026-09-23T15:00:00Z",
            },
            "student-4": { submitted: false, submittedAt: null },
        },
    },
    {
        id: "asgn-2",
        title: "OS: Process Scheduling Simulation",
        description:
            "Write a Python/C simulation of FCFS, SJF, and Round-Robin scheduling algorithms. Compare average waiting times.",
        dueDate: "2026-10-10",
        driveLink: "https://drive.google.com/drive/folders/sample2",
        createdBy: "admin-1",
        createdAt: "2026-09-21",
        subject: "Operating Systems",
        maxMarks: 50,
        materials: [
            {
                type: "pdf",
                title: "Scheduling reference.pdf",
                url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            },
            {
                type: "file",
                title: "Process results.csv",
                url: "https://drive.google.com/drive/folders/sample2",
            },
        ],
        submissions: {
            "student-1": { submitted: false, submittedAt: null },
            "student-2": {
                submitted: true,
                submittedAt: "2026-09-25T08:00:00Z",
            },
            "student-3": { submitted: false, submittedAt: null },
            "student-4": {
                submitted: true,
                submittedAt: "2026-09-25T09:45:00Z",
            },
        },
    },
    {
        id: "asgn-3",
        title: "DBMS: ER Diagram & Normalization",
        description:
            "Design an ER diagram for a hospital management system and normalize it to 3NF. Submit as PDF + SQL scripts.",
        dueDate: "2026-09-30",
        driveLink: "https://drive.google.com/drive/folders/sample3",
        createdBy: "admin-2",
        createdAt: "2026-09-18",
        subject: "Database Management",
        maxMarks: 75,
        materials: [
            {
                type: "file",
                title: "ER diagram source.sql",
                url: "https://drive.google.com/drive/folders/sample3",
            },
        ],
        submissions: {
            "student-1": {
                submitted: true,
                submittedAt: "2026-09-22T12:00:00Z",
            },
            "student-2": {
                submitted: true,
                submittedAt: "2026-09-23T11:00:00Z",
            },
            "student-3": {
                submitted: true,
                submittedAt: "2026-09-24T16:30:00Z",
            },
            "student-4": { submitted: false, submittedAt: null },
        },
    },
    {
        id: "asgn-4",
        title: "CN: TCP vs UDP Analysis",
        description:
            "Perform a Wireshark capture of HTTP and streaming traffic. Analyze the differences in TCP and UDP behavior with screenshots.",
        dueDate: "2026-10-15",
        driveLink: "https://drive.google.com/drive/folders/sample4",
        createdBy: "admin-2",
        createdAt: "2026-09-22",
        subject: "Computer Networks",
        maxMarks: 60,
        materials: [
            {
                type: "file",
                title: "Network capture.pcapng",
                url: "https://drive.google.com/drive/folders/sample4",
            },
        ],
        submissions: {
            "student-1": { submitted: false, submittedAt: null },
            "student-2": { submitted: false, submittedAt: null },
            "student-3": { submitted: false, submittedAt: null },
            "student-4": { submitted: false, submittedAt: null },
        },
    },
    {
        id: "asgn-5",
        title: "Web Development Mini Project",
        description:
            "Build a responsive web page and submit a short project summary before the deadline.",
        dueDate: "2026-09-28",
        createdBy: "admin-1",
        createdAt: "2026-09-24",
        subject: "Web Development",
        maxMarks: 50,
        materials: [
            {
                type: "text",
                title: "Project requirements",
                content:
                    "Submit your source code and a brief README describing how to run the project.",
            },
        ],
        submissions: {
            "student-1": { submitted: false, submittedAt: null },
            "student-2": {
                submitted: true,
                submittedAt: "2026-09-25T12:00:00Z",
            },
            "student-3": { submitted: false, submittedAt: null },
            "student-4": { submitted: false, submittedAt: null },
        },
    },
];
