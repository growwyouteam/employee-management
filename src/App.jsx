import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import useAuthStore from './store/authStore';
import './index.css' 

// Layouts
import MainLayout from './components/layout/MainLayout';

// Auth
import Login from './pages/auth/Login';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeForm from './pages/employees/EmployeeForm';
import EmployeeDetail from './pages/employees/EmployeeDetail';
import AttendancePage from './pages/attendance/AttendancePage';
import LeavesPage from './pages/leaves/LeavesPage';
import PayrollPage from './pages/payroll/PayrollPage';
import PerformancePage from './pages/performance/PerformancePage';
import MessagesPage from './pages/messages/MessagesPage';
import ReportsPage from './pages/reports/ReportsPage';
import AdminPage from './pages/admin/AdminPage';
import ProfilePage from './pages/profile/ProfilePage';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Employees - Admin, HR, Manager only */}
            <Route
              path="employees"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'HR', 'Manager']}>
                  <EmployeeList />
                </ProtectedRoute>
              }
            />
            <Route
              path="employees/new"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'HR']}>
                  <EmployeeForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="employees/:id"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'HR', 'Manager']}>
                  <EmployeeDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="employees/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'HR']}>
                  <EmployeeForm />
                </ProtectedRoute>
              }
            />

            {/* Attendance */}
            <Route path="attendance" element={<AttendancePage />} />

            {/* Leaves */}
            <Route path="leaves" element={<LeavesPage />} />

            {/* Payroll - Admin, HR only */}
            <Route
              path="payroll"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'HR']}>
                  <PayrollPage />
                </ProtectedRoute>
              }
            />

            {/* Performance */}
            <Route path="performance" element={<PerformancePage />} />

            {/* Messages */}
            <Route path="messages" element={<MessagesPage />} />

            {/* Reports - Admin, HR, Manager only */}
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'HR', 'Manager']}>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />

            {/* Admin - Admin only */}
            <Route
              path="admin"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* Profile */}
            <Route path="profile" element={<ProfilePage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
