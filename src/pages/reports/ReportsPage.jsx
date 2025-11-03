import { useQuery } from '@tanstack/react-query';
import { reportsAPI } from '../../api/reports';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';
import Button from '../../components/common/Button';

const ReportsPage = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => reportsAPI.getDashboard(),
  });

  if (isLoading) return <Loading />;

  const stats = dashboardData?.data || {};

  const attendanceData = [
    { name: 'Present', value: 85 },
    { name: 'Absent', value: 5 },
    { name: 'Half Day', value: 7 },
    { name: 'Late', value: 3 },
  ];

  const departmentData = [
    { department: 'Engineering', employees: 25 },
    { department: 'Sales', employees: 15 },
    { department: 'Marketing', employees: 12 },
    { department: 'HR', employees: 8 },
    { department: 'Finance', employees: 10 },
  ];

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">View detailed reports and insights</p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Distribution */}
        <Card title="Attendance Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Department-wise Employees */}
        <Card title="Department-wise Employees">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="employees" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Summary Tables */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Leave Summary">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold">{stats.pendingLeaves || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Approved</span>
              <span className="font-semibold text-green-600">45</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rejected</span>
              <span className="font-semibold text-red-600">3</span>
            </div>
          </div>
        </Card>

        <Card title="Payroll Summary">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Employees</span>
              <span className="font-semibold">{stats.totalEmployees || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gross Salary</span>
              <span className="font-semibold">₹11.5L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Net Salary</span>
              <span className="font-semibold text-green-600">₹10L</span>
            </div>
          </div>
        </Card>

        <Card title="Performance Summary">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Goals Completed</span>
              <span className="font-semibold text-green-600">28</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">In Progress</span>
              <span className="font-semibold text-yellow-600">15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold">7</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
