import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { employeesAPI } from '../../api/employees';
import { adminAPI } from '../../api/admin';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import { Search, Plus, Download, Upload } from 'lucide-react';
import { downloadCSV } from '../../utils/helpers';

const EmployeeList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');

  const { data: employeesData, isLoading } = useQuery({
    queryKey: ['employees', { search, department, status }],
    queryFn: () => employeesAPI.getAll({ search, department, status }),
  });

  const { data: departmentsData } = useQuery({
    queryKey: ['departments'],
    queryFn: () => adminAPI.getDepartments(),
  });

  const employees = employeesData?.data || [];
  const departments = departmentsData?.data || [];

  const columns = [
    {
      key: 'id',
      label: 'Employee ID',
    },
    {
      key: 'name',
      label: 'Name',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.profileImage}
            alt={row.firstName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">{`${row.firstName} ${row.lastName}`}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
    },
    {
      key: 'designation',
      label: 'Designation',
    },
    {
      key: 'phone',
      label: 'Phone',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <Badge status={value}>{value}</Badge>,
    },
  ];

  const handleExport = () => {
    const exportData = employees.map((emp) => ({
      ID: emp.id,
      Name: `${emp.firstName} ${emp.lastName}`,
      Email: emp.email,
      Phone: emp.phone,
      Department: emp.department,
      Designation: emp.designation,
      Status: emp.status,
    }));
    downloadCSV(exportData, 'employees');
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your organization's employees</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button
            onClick={() => navigate('/employees/new')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <Select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            options={[
              { value: 'all', label: 'All Departments' },
              ...departments.map((dept) => ({ value: dept, label: dept })),
            ]}
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          data={employees}
          onRowClick={(row) => navigate(`/employees/${row.id}`)}
        />
      </Card>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>
          Showing <span className="font-medium">{employees.length}</span> employees
        </p>
      </div>
    </div>
  );
};

export default EmployeeList;
