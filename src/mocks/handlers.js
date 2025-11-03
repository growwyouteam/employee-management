import { http, HttpResponse, delay } from 'msw';
import { employees, departments, designations } from './data/employees';
import { attendanceRecords, attendanceSummary } from './data/attendance';
import { leaveRequests, leaveTypes, leaveBalance } from './data/leaves';
import { payslips, salaryStructures, payrollSummary } from './data/payroll';
import { goals, reviews, feedback } from './data/performance';
import { announcements, messages } from './data/announcements';

const API_BASE = '/api';

// Helper to simulate network delay
const simulateDelay = () => delay(300);

export const handlers = [
  // Auth endpoints
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    await simulateDelay();
    const { email, password } = await request.json();
    
    const user = employees.find(emp => emp.email === email);
    
    if (user && password === 'password123') {
      return HttpResponse.json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            department: user.department,
            designation: user.designation,
            profileImage: user.profileImage,
          },
          token: `fake-jwt-token-${user.id}`,
        },
      });
    }
    
    return HttpResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.post(`${API_BASE}/auth/logout`, async () => {
    await simulateDelay();
    return HttpResponse.json({ success: true });
  }),

  // Employee endpoints
  http.get(`${API_BASE}/employees`, async ({ request }) => {
    await simulateDelay();
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const department = url.searchParams.get('department');
    const status = url.searchParams.get('status');
    
    let filtered = [...employees];
    
    if (search) {
      filtered = filtered.filter(emp =>
        emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.id.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (department && department !== 'all') {
      filtered = filtered.filter(emp => emp.department === department);
    }
    
    if (status && status !== 'all') {
      filtered = filtered.filter(emp => emp.status === status);
    }
    
    return HttpResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  }),

  http.get(`${API_BASE}/employees/:id`, async ({ params }) => {
    await simulateDelay();
    const employee = employees.find(emp => emp.id === params.id);
    
    if (employee) {
      return HttpResponse.json({ success: true, data: employee });
    }
    
    return HttpResponse.json(
      { success: false, message: 'Employee not found' },
      { status: 404 }
    );
  }),

  http.post(`${API_BASE}/employees`, async ({ request }) => {
    await simulateDelay();
    const data = await request.json();
    const newEmployee = {
      id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'Active',
    };
    employees.push(newEmployee);
    
    return HttpResponse.json({
      success: true,
      data: newEmployee,
      message: 'Employee created successfully',
    }, { status: 201 });
  }),

  http.put(`${API_BASE}/employees/:id`, async ({ params, request }) => {
    await simulateDelay();
    const data = await request.json();
    const index = employees.findIndex(emp => emp.id === params.id);
    
    if (index !== -1) {
      employees[index] = { ...employees[index], ...data };
      return HttpResponse.json({
        success: true,
        data: employees[index],
        message: 'Employee updated successfully',
      });
    }
    
    return HttpResponse.json(
      { success: false, message: 'Employee not found' },
      { status: 404 }
    );
  }),

  http.delete(`${API_BASE}/employees/:id`, async ({ params }) => {
    await simulateDelay();
    const index = employees.findIndex(emp => emp.id === params.id);
    
    if (index !== -1) {
      employees.splice(index, 1);
      return HttpResponse.json({
        success: true,
        message: 'Employee deleted successfully',
      });
    }
    
    return HttpResponse.json(
      { success: false, message: 'Employee not found' },
      { status: 404 }
    );
  }),

  // Attendance endpoints
  http.get(`${API_BASE}/attendance`, async ({ request }) => {
    await simulateDelay();
    const url = new URL(request.url);
    const employeeId = url.searchParams.get('employeeId');
    const date = url.searchParams.get('date');
    
    let filtered = [...attendanceRecords];
    
    if (employeeId) {
      filtered = filtered.filter(record => record.employeeId === employeeId);
    }
    
    if (date) {
      filtered = filtered.filter(record => record.date === date);
    }
    
    return HttpResponse.json({
      success: true,
      data: filtered,
    });
  }),

  http.post(`${API_BASE}/attendance`, async ({ request }) => {
    await simulateDelay();
    const data = await request.json();
    attendanceRecords.push(data);
    
    return HttpResponse.json({
      success: true,
      data,
      message: 'Attendance marked successfully',
    }, { status: 201 });
  }),

  http.get(`${API_BASE}/attendance/summary`, async () => {
    await simulateDelay();
    return HttpResponse.json({
      success: true,
      data: attendanceSummary,
    });
  }),

  // Leave endpoints
  http.get(`${API_BASE}/leaves`, async ({ request }) => {
    await simulateDelay();
    const url = new URL(request.url);
    const employeeId = url.searchParams.get('employeeId');
    const status = url.searchParams.get('status');
    
    let filtered = [...leaveRequests];
    
    if (employeeId) {
      filtered = filtered.filter(leave => leave.employeeId === employeeId);
    }
    
    if (status && status !== 'all') {
      filtered = filtered.filter(leave => leave.status === status);
    }
    
    return HttpResponse.json({
      success: true,
      data: filtered,
    });
  }),

  http.post(`${API_BASE}/leaves`, async ({ request }) => {
    await simulateDelay();
    const data = await request.json();
    const newLeave = {
      id: `LV${String(leaveRequests.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    leaveRequests.push(newLeave);
    
    return HttpResponse.json({
      success: true,
      data: newLeave,
      message: 'Leave request submitted successfully',
    }, { status: 201 });
  }),

  http.put(`${API_BASE}/leaves/:id`, async ({ params, request }) => {
    await simulateDelay();
    const data = await request.json();
    const index = leaveRequests.findIndex(leave => leave.id === params.id);
    
    if (index !== -1) {
      leaveRequests[index] = { ...leaveRequests[index], ...data };
      return HttpResponse.json({
        success: true,
        data: leaveRequests[index],
        message: 'Leave request updated successfully',
      });
    }
    
    return HttpResponse.json(
      { success: false, message: 'Leave request not found' },
      { status: 404 }
    );
  }),

  http.get(`${API_BASE}/leaves/types`, async () => {
    await simulateDelay();
    return HttpResponse.json({
      success: true,
      data: leaveTypes,
    });
  }),

  http.get(`${API_BASE}/leaves/balance/:employeeId`, async ({ params }) => {
    await simulateDelay();
    const balance = leaveBalance[params.employeeId] || {
      casual: { total: 12, used: 0, remaining: 12 },
      sick: { total: 10, used: 0, remaining: 10 },
      earned: { total: 15, used: 0, remaining: 15 },
    };
    
    return HttpResponse.json({
      success: true,
      data: balance,
    });
  }),

  // Payroll endpoints
  http.get(`${API_BASE}/payroll/payslips`, async ({ request }) => {
    await simulateDelay();
    const url = new URL(request.url);
    const employeeId = url.searchParams.get('employeeId');
    
    let filtered = [...payslips];
    
    if (employeeId) {
      filtered = filtered.filter(slip => slip.employeeId === employeeId);
    }
    
    return HttpResponse.json({
      success: true,
      data: filtered,
    });
  }),

  http.get(`${API_BASE}/payroll/structure/:employeeId`, async ({ params }) => {
    await simulateDelay();
    const structure = salaryStructures[params.employeeId];
    
    if (structure) {
      return HttpResponse.json({ success: true, data: structure });
    }
    
    return HttpResponse.json(
      { success: false, message: 'Salary structure not found' },
      { status: 404 }
    );
  }),

  http.get(`${API_BASE}/payroll/summary`, async () => {
    await simulateDelay();
    return HttpResponse.json({
      success: true,
      data: payrollSummary,
    });
  }),

  // Performance endpoints
  http.get(`${API_BASE}/performance/goals`, async ({ request }) => {
    await simulateDelay();
    const url = new URL(request.url);
    const employeeId = url.searchParams.get('employeeId');
    
    let filtered = [...goals];
    
    if (employeeId) {
      filtered = filtered.filter(goal => goal.employeeId === employeeId);
    }
    
    return HttpResponse.json({
      success: true,
      data: filtered,
    });
  }),

  http.post(`${API_BASE}/performance/goals`, async ({ request }) => {
    await simulateDelay();
    const data = await request.json();
    const newGoal = {
      id: `GOAL${String(goals.length + 1).padStart(3, '0')}`,
      ...data,
      progress: 0,
      status: 'In Progress',
    };
    goals.push(newGoal);
    
    return HttpResponse.json({
      success: true,
      data: newGoal,
      message: 'Goal created successfully',
    }, { status: 201 });
  }),

  http.get(`${API_BASE}/performance/reviews`, async ({ request }) => {
    await simulateDelay();
    const url = new URL(request.url);
    const employeeId = url.searchParams.get('employeeId');
    
    let filtered = [...reviews];
    
    if (employeeId) {
      filtered = filtered.filter(review => review.employeeId === employeeId);
    }
    
    return HttpResponse.json({
      success: true,
      data: filtered,
    });
  }),

  http.get(`${API_BASE}/performance/feedback`, async ({ request }) => {
    await simulateDelay();
    const url = new URL(request.url);
    const employeeId = url.searchParams.get('employeeId');
    
    let filtered = [...feedback];
    
    if (employeeId) {
      filtered = filtered.filter(fb => fb.employeeId === employeeId);
    }
    
    return HttpResponse.json({
      success: true,
      data: filtered,
    });
  }),

  // Announcements endpoints
  http.get(`${API_BASE}/announcements`, async () => {
    await simulateDelay();
    return HttpResponse.json({
      success: true,
      data: announcements.filter(ann => ann.status === 'Active'),
    });
  }),

  http.post(`${API_BASE}/announcements`, async ({ request }) => {
    await simulateDelay();
    const data = await request.json();
    const newAnnouncement = {
      id: `ANN${String(announcements.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'Active',
      postedOn: new Date().toISOString().split('T')[0],
    };
    announcements.push(newAnnouncement);
    
    return HttpResponse.json({
      success: true,
      data: newAnnouncement,
      message: 'Announcement created successfully',
    }, { status: 201 });
  }),

  // Messages endpoints
  http.get(`${API_BASE}/messages`, async ({ request }) => {
    await simulateDelay();
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    let filtered = [...messages];
    
    if (userId) {
      filtered = filtered.filter(msg => msg.to === userId || msg.from === userId);
    }
    
    return HttpResponse.json({
      success: true,
      data: filtered,
    });
  }),

  // Reports endpoints
  http.get(`${API_BASE}/reports/dashboard`, async () => {
    await simulateDelay();
    return HttpResponse.json({
      success: true,
      data: {
        totalEmployees: employees.length,
        activeEmployees: employees.filter(e => e.status === 'Active').length,
        departments: departments.length,
        avgAttendance: 92.5,
        pendingLeaves: leaveRequests.filter(l => l.status === 'Pending').length,
        monthlyPayroll: payrollSummary.totalNetSalary,
      },
    });
  }),

  // Admin endpoints
  http.get(`${API_BASE}/admin/departments`, async () => {
    await simulateDelay();
    return HttpResponse.json({
      success: true,
      data: departments,
    });
  }),

  http.get(`${API_BASE}/admin/designations`, async () => {
    await simulateDelay();
    return HttpResponse.json({
      success: true,
      data: designations,
    });
  }),
];
