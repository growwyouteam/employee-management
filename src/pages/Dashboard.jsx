import { useQuery } from '@tanstack/react-query';
import { reportsAPI } from '../api/reports';
import useAuthStore from '../store/authStore';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  FileText,
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useAuthStore();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => reportsAPI.getDashboard(),
  });

  if (isLoading) return <Loading />;

  const stats = dashboardData?.data || {};

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Active Employees',
      value: stats.activeEmployees || 0,
      icon: Users,
      color: 'bg-green-500',
      change: '+5%',
    },
    {
      title: 'Avg Attendance',
      value: `${stats.avgAttendance || 0}%`,
      icon: Calendar,
      color: 'bg-purple-500',
      change: '+2.5%',
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-3',
    },
    {
      title: 'Monthly Payroll',
      value: formatCurrency(stats.monthlyPayroll || 0),
      icon: DollarSign,
      color: 'bg-emerald-500',
      change: '+8%',
    },
    {
      title: 'Departments',
      value: stats.departments || 0,
      icon: FileText,
      color: 'bg-indigo-500',
      change: '0',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your organization today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Mark Attendance</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <FileText className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Apply Leave</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <DollarSign className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">View Payslip</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Team Directory</p>
          </button>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Announcements">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Diwali Celebration</p>
                <p className="text-sm text-gray-600">Office closed on 12th & 13th Nov</p>
                <p className="text-xs text-gray-500 mt-1">2 days ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">New Health Policy</p>
                <p className="text-sm text-gray-600">Enhanced coverage for all employees</p>
                <p className="text-xs text-gray-500 mt-1">5 days ago</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Upcoming Events">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border-l-4 border-purple-500 bg-purple-50 rounded">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Team Building Activity</p>
                <p className="text-sm text-gray-600">Saturday, 10:00 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border-l-4 border-orange-500 bg-orange-50 rounded">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-gray-900">Q3 Performance Reviews</p>
                <p className="text-sm text-gray-600">Next Week</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
