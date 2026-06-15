# FlowTask - Full-Stack Task Management Application

FlowTask is a high-performance, responsive, and visually stunning Task Management application. It enables users to create, view, update, and delete tasks dynamically, utilizing a dual-theme (light/dark mode) interface.

---

## 🚀 Tech Stack

### Frontend Client
- **Core**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (bootstrapped with [Vite](https://vite.dev/))
- **Routing**: [React Router v6](https://reactrouter.com/) for view-based navigation
- **State & Theme**: Custom React Context Hooks (`ToastProvider`, `useTheme`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for utility-first styling and custom base configurations
- **Design System**: Atomic UI components (`Button`, `Label`, `Input`, `Textarea`, `Select`, `Badge`, `Toast`, `LoadingSpinner`)

### Backend API
- **Core**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) in TypeScript
- **Runtime Runner**: [Nodemon](https://nodemon.io/) + [ts-node](https://typestrong.org/ts-node/)
- **Validation**: [Zod](https://zod.dev/) body, query, and path parameter validations
- **Database Access**: [Prisma ORM](https://www.prisma.io/) with a connection client singleton
- **Observability**: Structured JSON Logger utility

### Database
- **Core**: [PostgreSQL](https://www.postgresql.org/) (v16/v18)

---

## 📂 Project Directory Structure

FlowTask adopts a clean, modular 5+ YOE software engineering architecture:

```
Task_Assignment/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema and index definitions
│   │   └── seed.ts             # Database seeding script
│   └── src/
│       ├── config/
│       │   └── db.ts           # PrismaClient database singleton
│       ├── controllers/
│       │   └── taskController.ts # Thin request controllers
│       ├── middleware/
│       │   ├── errorHandler.ts # Global HTTP error interceptor
│       │   └── validate.ts     # Zod validator (body, query, params)
│       ├── routes/
│       │   └── taskRoutes.ts   # Route definitions chained with middleware
│       ├── services/
│       │   └── taskService.ts  # Database CRUD logic
│       ├── utils/
│       │   ├── errors.ts       # Custom operational AppError subclasses
│       │   ├── logger.ts       # Structured JSON logging utility
│       │   └── schemas.ts      # Zod validation models (e.g., UUID check)
│       └── index.ts            # App entrypoint
│
└── frontend/
    └── src/
        ├── components/
        │   ├── layout/         # Structural components (Navbar.tsx)
        │   ├── tasks/          # Task feature modules (TaskCard, TaskForm)
        │   └── ui/             # Reusable design system primitives (Button, Input)
        ├── hooks/              # Reusable state hook context (useToast, useTheme)
        ├── pages/              # View controllers (TaskListPage, TaskDetailPage)
        ├── services/           # Encapsulated API requests (taskService.ts)
        ├── utils/              # Shared helper functions (date.ts)
        ├── App.tsx             # Global routes config and ToastProvider wrapper
        └── main.tsx            # App entrypoint
```

---

## ⚙️ Local Setup & Deployment

### Prerequisites
- **Node.js** v20+ and **npm** v10+
- **PostgreSQL** instance running on `localhost:5432`

---

### 1. Database & Backend API Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure the Environment Variables**:
   Create a `.env` file inside the `backend/` root (a configured sample is included):
   ```env
   DATABASE_URL="postgresql://postgres:root@localhost:5432/task_db?schema=public"
   PORT=5000
   ALLOWED_ORIGINS="http://localhost:5173,http://localhost:5174"
   ```
   _Note: Modify the password (`root` in the default string) and port in `DATABASE_URL` to match your local PostgreSQL configuration._

4. **Run Migrations**:
   Sync your local PostgreSQL database with the Prisma schema and set up indexes:
   ```bash
   npx prisma migrate dev --name init
   ```
5. **Seed the Database**:
   Populate the database with 6 mock tasks:
   ```bash
   npm run prisma:seed
   ```
6. **Start the API Server**:
   Start the development server with live reload:
   ```bash
   npm run dev
   ```
   The backend API will listen on `http://localhost:5000`.

---

### 2. Frontend Client Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the Vite Dev Server**:
   ```bash
   npm run dev
   ```
   The frontend application will be served locally on `http://localhost:5173/` (or `5174` if port 5173 is occupied).

---

## 🧠 Design Decisions & Assumptions

### 1. Database Indexing & Performance
To prevent database query performance bottlenecks as the row count grows, we added database indexes to the `status`, `priority`, and `createdAt` columns in `schema.prisma`. This prevents full-table scans during dashboard sorting and filtering actions.

### 2. Locked-Down CORS Security
Instead of opening public access via `origin: '*'`, the backend CORS middleware parses the `ALLOWED_ORIGINS` environment variable, defaulting to restricted localhost addresses. Unspecified origin requests (such as local testing commands or Postman) remain supported.

### 3. Layered Date Input (Strict `DD-MM-YYYY` Format)
Browser implementations of `<input type="date">` lock display formatting to the user's OS system locale (often showing `MM/DD/YYYY`). To force a unified `DD-MM-YYYY` representation, we overlaid a styled read-only text input (which parses date strings to `DD-MM-YYYY` format) on top of an invisible `opacity-0` native date input. Clicks pass through to the calendar popup, and the display formats uniformly.

### 4. `showPicker()` Usability Override
Clicking on the text field of standard browser date inputs only selects text fields instead of launching the calendar. We bound the native `showPicker()` API to the `onClick` and `onFocus` events to trigger the browser's calendar pop-up whenever any part of the date picker field is focused.

### 5. Structured Observability (JSON Logging)
Replaced the default unstructured `console.log` statements in the backend with a custom structured JSON Logger helper. This outputs unified JSON envelopes with timestamps, severity levels, and stack traces, matching cloud logging configurations (e.g. Google Cloud Logging, AWS CloudWatch).

### 6. Router Basename Compatibility
React Router v6 is initialized with `basename={import.meta.env.BASE_URL}` inside `App.tsx`. This reads Vite's compile parameters to ensure routing works correctly if hosted inside a sub-directory or path context.

### 7. Reusable Component-Driven Design (Atomic Pattern)
Consolidated frontend interactive elements into reusable visual control wrappers inside `src/components/ui/` (`Button`, `Label`, `Input`, `Textarea`, `Select`, `Badge`, `Toast`, `LoadingSpinner`). This ensures style uniformity across all form overlays and listings, reducing CSS class repetition.

### 8. Global State Hooks (`useToast`, `useTheme`)
Extracted flat state managers out of individual view controllers and page files.
- `useTheme` manages document styling root class shifts and persists active preferences in `localStorage`.
- `useToast` exposes a context provider context that lets any view trigger toast notifications dynamically without maintaining duplicate local notification state arrays.

### 9. DB Connection Client Singleton
Created a database client singleton in `backend/src/config/db.ts` to instantiate and share a single PrismaClient across all services. This avoids connection pool exhaustion when code changes hot-reload nodemon processes.

### 10. Centralized Express Error Handler & Parameter Validation Middleware
Removed redundant try-catch and inline UUID validation from backend controllers. 
- Zod `validateParams(ParamsIdSchema)` runs as a middleware to reject invalid path parameters before request dispatch.
- Database, Zod, and custom operational exceptions (`AppError`, `NotFoundError`, `BadRequestError`) are caught by the global error handler middleware, keeping controller controllers completely thin and boilerplate-free.
