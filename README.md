# EduBoard — Assignment & Review Dashboard

Frontend Internship · Task 1

EduBoard is a responsive, role-based assignment and review dashboard built with React, Vite, and Tailwind CSS. Lucide React provides a consistent set of accessible vector icons. Students can track their assignments and confirm submissions through a two-step flow. Professors can create, edit, and remove their own assignments, add Google Drive links, and review each student's submission status.

## Demo and submission links

- GitHub repository: _Add repository URL_
- Working demo: _Add Netlify or Vercel URL_
- Demo video: _Add recording URL_

## Run locally

Requires Node.js 20.19+ or 22.12+ (required by Vite 8).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create and preview a production build:

```bash
npm run build
npm run preview
```

## Demo accounts

Enter one of these demo accounts on the sign-in page. Credentials are displayed below the sign-in form; students and professors use the same password for their role:

| Role | Email | Password |
| --- | --- | --- |
| Student: Vikas Sontakke | `vikas@student.edu` | `student123` |
| Student | `priya@student.edu` | `student123` |
| Student | `rohit@student.edu` | `student123` |
| Student | `sneha@student.edu` | `student123` |
| Student | `kavya@student.edu` | `student123` |
| Professor | `ramesh@prof.edu` | `admin123` |
| Professor | `anjali@prof.edu` | `admin123` |
| Professor | `dev@prof.edu` | `admin123` |

## Features

- Role-specific dashboards: students see assignment details and their own submission state; professors see only assignments they created and status for each student.
- Student completion ring, assignment filters, due-date indicators, and per-assignment submission status.
- Two-step submission confirmation before marking work submitted.
- Professor assignment management with title, subject, description, due date, marks, and optional Drive URL.
- Individual submitted/pending status indicators and aggregate submission progress for each assignment.
- Persistent demo state using `localStorage`.
- Responsive layouts for phones, tablets, and desktop, plus reduced-motion support.

## Folder structure

```text
public/
└── eduboard-mark.svg  # EduBoard graduation-cap mark
src/
├── components/
│   ├── admin/       # Assignment management, edit/create forms, student status bars
│   ├── student/     # Assignment cards, progress ring, confirmation flow
│   └── Navbar.jsx
├── context/
│   └── AppContext.jsx  # Authentication, assignment state and actions
├── data/
│   └── mockData.js     # Demo users and starter assignments
├── pages/
│   ├── LoginPage.jsx
│   ├── StudentDashboard.jsx
│   └── AdminDashboard.jsx
├── App.jsx             # Role-based view selection
├── index.css           # Tailwind entry point and responsive design system
└── main.jsx
```

## Component and design notes

`AppContext` is the shared source for the signed-in demo user, theme, and assignments. The page components select role-appropriate data and compose smaller cards and dialogs. Assignment and user data start in `src/data/mockData.js`; updates are written to browser `localStorage`, so a refresh keeps changes on the same browser. Clear the `eduboard_user` and `eduboard_assignments` local storage keys to reset the demo.

Tailwind CSS 4 is imported in `src/index.css`. Reusable component styles and dark and light theme tokens are written there as plain CSS, while responsive utility classes are kept in the React markup. The stylesheet uses no Tailwind configuration directives or custom keyframe definitions.

## Demo limitations

This is a frontend-only prototype. Demo credentials and assignment data live in the client bundle/browser storage; authentication and role checks are for demonstrating the interface, not production security. Submission confirmation records a status only and does not upload files to Drive.
