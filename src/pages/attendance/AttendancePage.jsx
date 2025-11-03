import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceAPI } from '../../api/attendance';
import useAuthStore from '../../store/authStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const AttendancePage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['attendance', user?.id, selectedDate],
    queryFn: () => attendanceAPI.getAll({ employeeId: user?.id, date: selectedDate }),
  });

  const { data: summaryData } = useQuery({
    queryKey: ['attendance-summary', user?.id],
    queryFn: () => attendanceAPI.getSummary(user?.id),
  });

  const markAttendanceMutation = useMutation({
    mutationFn: (data) => attendanceAPI.mark(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['attendance']);
      queryClient.invalidateQueries(['attendance-summary']);
    },
  });

  const handleMarkAttendance = () => {
    const now = new Date();
    markAttendanceMutation.mutate({
      id: `ATT-${user?.id}-${selectedDate}`,
      employeeId: user?.id,
      date: selectedDate,
      status: 'Present',
      checkIn: format(now, 'HH:mm'),
      checkOut: null,
      workHours: 0,
      location: 'Office',
    });
  };

  const attendance = attendanceData?.data || [];
  const summary = summaryData?.data || {};

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (value) => format(new Date(value), 'dd MMM yyyy'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <Badge status={value}>{value}</Badge>,
    },
    {
      key: 'checkIn',
      label: 'Check In',
    },
    {
      key: 'checkOut',
      label: 'Check Out',
    },
    {
      key: 'workHours',
      label: 'Work Hours',
      render: (value) => `${value || 0}h`,
    },
    {
      key: 'location',
      label: 'Location',
    },
  ];

  if (isLoading) return <Loading />;

  const todayAttendance = attendance.find(a => a.date === selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600 mt-1">Track and manage your attendance</p>
      </div>

      {/* Mark Attendance Card */}
      <Card>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Clock className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today's Attendance</p>
              <p className="text-2xl font-bold text-gray-900">
                {format(new Date(), 'dd MMM yyyy')}
              </p>
              {todayAttendance && (
                <p className="text-sm text-gray-600 mt-1">
                  Check In: {todayAttendance.checkIn || 'Not marked'}
                </p>
              )}
            </div>
          </div>
          {!todayAttendance && (
            <Button
              onClick={handleMarkAttendance}
              loading={markAttendanceMutation.isPending}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark Present
            </Button>
          )}
          {todayAttendance && (
            <Badge status={todayAttendance.status} className="text-lg px-4 py-2">
              {todayAttendance.status}
            </Badge>
          )}
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Days</p>
          <p className="text-2xl font-bold text-gray-900">{summary.totalWorkingDays || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Present</p>
          <p className="text-2xl font-bold text-green-600">{summary.presentDays || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Absent</p>
          <p className="text-2xl font-bold text-red-600">{summary.absentDays || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Attendance %</p>
          <p className="text-2xl font-bold text-primary-600">{summary.attendancePercentage || 0}%</p>
        </Card>
      </div>

      {/* Date Filter */}
      <Card>
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
          />
        </div>
      </Card>

      {/* Attendance Table */}
      <Card title="Attendance History">
        <Table columns={columns} data={attendance} />
      </Card>
    </div>
  );
};

export default AttendancePage;
