# EduBoard — Assignment & Review Dashboard

EduBoard is a React demo for managing class assignments and reviewing student submissions. It has separate Student and Teacher experiences that share the same application shell and reusable UI components.

## Features

### Student

- Browse assignments and filter by submission status.
- Open assignment details and instructor materials.
- Submit work using a Google Drive link.
- Review submitted work and track progress.

### Teacher

- Create and edit assignments with a subject, description, due date, and Google Drive material link.
- Review student submissions and open submitted Drive links.
- Filter submission and progress views by assignment, subject, student, and status.
- Explore interactive progress charts.

### Shared

- Role-aware sidebar navigation and a shared top bar.
- Light and dark themes.
- Responsive layouts for desktop and smaller screens.

## Technology

- React 19
- Vite 8
- Tailwind CSS 4
- Recharts
- Lucide React

## Run locally

Install Node.js and npm, then run:

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Demo sign-in

Use either demo account on the login page:

| Role | Email | Password |
| --- | --- | --- |
| Student | `vikas@student.edu` | `student123` |
| Teacher | `ramesh@prof.edu` | `admin123` |

These are demo-only credentials. The demo uses mock accounts and browser `localStorage` for the signed-in user, theme, assignments, and submissions. It does not connect to a server or synchronize data between browsers.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create the production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |

## Deploy to Vercel

Import this GitHub repository into Vercel and use these project settings:

- Framework preset: **Vite**
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

The project does not require environment variables for the demo. A production deployment should connect authentication, assignment data, and submission records to a backend before it is used with real users; the current browser-local demo data is not shared across accounts or devices.
