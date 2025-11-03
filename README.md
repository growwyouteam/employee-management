# Employee Management System (Frontend)

A comprehensive, modern Employee Management System built with React, Vite, TailwindCSS, and Mock Service Worker (MSW) for API simulation.

## 🚀 Features

### Core Modules
- **Dashboard** - Overview of key metrics and quick actions
- **Employee Management** - Complete CRUD operations for employees
- **Attendance Tracking** - Mark attendance, view history, and analytics
- **Leave Management** - Apply, approve/reject leaves with balance tracking
- **Payroll Management** - Salary structure, payslips, and reports
- **Performance Management** - Goals, reviews, and feedback system
- **Communication** - Messages and announcements
- **Reports & Analytics** - Visual charts and data insights
- **Admin Panel** - System configuration and settings

### Technical Features
- ✅ **Role-based Access Control** (Admin, HR, Manager, Employee)
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Mock API** - MSW for complete API simulation
- ✅ **State Management** - Zustand for global state
- ✅ **Data Fetching** - React Query for server state
- ✅ **Form Validation** - React Hook Form + Zod
- ✅ **Modern UI** - TailwindCSS with custom components
- ✅ **Charts & Graphs** - Recharts for data visualization

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** TailwindCSS
- **Routing:** React Router DOM v6
- **State Management:** Zustand
- **Data Fetching:** TanStack React Query
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **API Mocking:** MSW (Mock Service Worker)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **PDF Generation:** jsPDF

## 📦 Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Initialize MSW Service Worker**
```bash
npx msw init public/ --save
```

3. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔐 Demo Credentials

### Admin Access
- **Email:** sunita.kapoor@company.com
- **Password:** password123

### HR Access
- **Email:** priya.sharma@company.com
- **Password:** password123

### Manager Access
- **Email:** vikram.singh@company.com
- **Password:** password123

### Employee Access
- **Email:** rajesh.kumar@company.com
- **Password:** password123

## 📁 Project Structure

```
src/
├── api/                    # API client and endpoints
│   ├── client.js
│   ├── auth.js
│   ├── employees.js
│   ├── attendance.js
│   ├── leaves.js
│   ├── payroll.js
│   ├── performance.js
│   ├── announcements.js
│   ├── reports.js
│   └── admin.js
├── components/
│   ├── common/            # Reusable components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Badge.jsx
│   │   ├── Modal.jsx
│   │   ├── Table.jsx
│   │   └── Loading.jsx
│   └── layout/            # Layout components
│       ├── Header.jsx
│       ├── Sidebar.jsx
│       ├── MobileNav.jsx
│       └── MainLayout.jsx
├── mocks/                 # MSW mock data and handlers
│   ├── data/
│   │   ├── employees.js
│   │   ├── attendance.js
│   │   ├── leaves.js
│   │   ├── payroll.js
│   │   ├── performance.js
│   │   └── announcements.js
│   ├── handlers.js
│   └── browser.js
├── pages/                 # Page components
│   ├── auth/
│   ├── employees/
│   ├── attendance/
│   ├── leaves/
│   ├── payroll/
│   ├── performance/
│   ├── messages/
│   ├── reports/
│   ├── admin/
│   ├── profile/
│   └── Dashboard.jsx
├── routes/                # Route configuration
│   └── ProtectedRoute.jsx
├── store/                 # Zustand stores
│   ├── authStore.js
│   └── uiStore.js
├── utils/                 # Utility functions
│   └── helpers.js
├── lib/                   # Third-party configs
│   └── queryClient.js
├── App.jsx
└── main.jsx
```

## 🎯 Key Features by Role

### Admin
- Full system access
- Manage all employees
- Configure system settings
- View all reports
- Manage departments and roles

### HR
- Manage employees
- Process payroll
- Approve/reject leaves
- View HR reports
- Manage announcements

### Manager
- View team members
- Approve team leaves
- View team performance
- Access team reports

### Employee
- View personal dashboard
- Mark attendance
- Apply for leaves
- View payslips
- Track performance goals
- View messages

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Production build

# Preview
npm run preview      # Preview production build

# Lint
npm run lint         # Run ESLint
```

## 🌐 API Endpoints (Mocked)

All API endpoints are mocked using MSW:

- **Auth:** `/api/auth/login`, `/api/auth/logout`
- **Employees:** `/api/employees` (GET, POST, PUT, DELETE)
- **Attendance:** `/api/attendance` (GET, POST)
- **Leaves:** `/api/leaves` (GET, POST, PUT)
- **Payroll:** `/api/payroll/payslips`, `/api/payroll/structure`
- **Performance:** `/api/performance/goals`, `/api/performance/reviews`
- **Messages:** `/api/messages`, `/api/announcements`
- **Reports:** `/api/reports/dashboard`
- **Admin:** `/api/admin/departments`, `/api/admin/designations`

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Mobile bottom navigation
- Touch-friendly UI elements
- Optimized for 360px+ viewports

## 🚀 Future Enhancements

- Real backend integration
- Real-time notifications
- Advanced analytics
- Document management
- Multi-language support
- Dark mode
- Export to Excel/PDF
- Email notifications
- Calendar integration

## 📄 License

MIT License

## 👨‍💻 Developer Notes

This is a frontend-only application with complete API mocking. To connect to a real backend:

1. Remove MSW initialization from `main.jsx`
2. Update API base URL in `src/api/client.js`
3. Implement real authentication flow
4. Update API endpoints as per backend specification

---

**Built with ❤️ using React + Vite + TailwindCSS**
