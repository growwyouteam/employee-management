import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../../api/admin';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import { Settings, Users, Building, Calendar, Shield } from 'lucide-react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('departments');

  const { data: departmentsData, isLoading: loadingDepts } = useQuery({
    queryKey: ['departments'],
    queryFn: () => adminAPI.getDepartments(),
  });

  const { data: designationsData, isLoading: loadingDesigs } = useQuery({
    queryKey: ['designations'],
    queryFn: () => adminAPI.getDesignations(),
  });

  if (loadingDepts || loadingDesigs) return <Loading />;

  const departments = departmentsData?.data || [];
  const designations = designationsData?.data || [];

  const tabs = [
    { id: 'departments', label: 'Departments', icon: Building },
    { id: 'designations', label: 'Designations', icon: Users },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'holidays', label: 'Holidays', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600 mt-1">Manage system settings and configurations</p>
      </div>

      {/* Tabs */}
      <Card>
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Departments */}
      {activeTab === 'departments' && (
        <Card title="Departments" action={<Button size="sm">Add Department</Button>}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Building className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{dept}</p>
                      <p className="text-sm text-gray-500">Active</p>
                    </div>
                  </div>
                  <Badge variant="green">Active</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Designations */}
      {activeTab === 'designations' && (
        <Card title="Designations" action={<Button size="sm">Add Designation</Button>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {designations.map((desig, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
                <span className="font-medium text-gray-900">{desig}</span>
                <Badge variant="blue">Active</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Roles & Permissions */}
      {activeTab === 'roles' && (
        <Card title="Roles & Permissions">
          <div className="space-y-4">
            {['Admin', 'HR', 'Manager', 'Employee'].map((role) => (
              <div key={role} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{role}</h3>
                  <Button size="sm" variant="outline">Edit Permissions</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {role === 'Admin' && (
                    <>
                      <Badge variant="green">Full Access</Badge>
                      <Badge variant="blue">Manage Users</Badge>
                      <Badge variant="blue">Manage Payroll</Badge>
                      <Badge variant="blue">View Reports</Badge>
                    </>
                  )}
                  {role === 'HR' && (
                    <>
                      <Badge variant="blue">Manage Employees</Badge>
                      <Badge variant="blue">Manage Leaves</Badge>
                      <Badge variant="blue">Manage Payroll</Badge>
                    </>
                  )}
                  {role === 'Manager' && (
                    <>
                      <Badge variant="blue">View Team</Badge>
                      <Badge variant="blue">Approve Leaves</Badge>
                      <Badge variant="blue">View Reports</Badge>
                    </>
                  )}
                  {role === 'Employee' && (
                    <>
                      <Badge variant="blue">View Profile</Badge>
                      <Badge variant="blue">Apply Leave</Badge>
                      <Badge variant="blue">Mark Attendance</Badge>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Holidays */}
      {activeTab === 'holidays' && (
        <Card title="Company Holidays" action={<Button size="sm">Add Holiday</Button>}>
          <div className="space-y-3">
            {[
              { name: 'Diwali', date: '2024-11-12', type: 'Festival' },
              { name: 'Christmas', date: '2024-12-25', type: 'Festival' },
              { name: 'New Year', date: '2025-01-01', type: 'Public Holiday' },
              { name: 'Republic Day', date: '2025-01-26', type: 'National Holiday' },
            ].map((holiday, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">{holiday.name}</p>
                    <p className="text-sm text-gray-500">{holiday.date}</p>
                  </div>
                </div>
                <Badge variant="purple">{holiday.type}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card title="General Settings">
            <div className="space-y-4">
              <Input label="Company Name" defaultValue="Employee Management System" />
              <Input label="Company Email" type="email" defaultValue="info@company.com" />
              <Input label="Company Phone" defaultValue="+91 1234567890" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Address
                </label>
                <textarea className="input-field" rows={3} defaultValue="123, Business Park, City - 123456" />
              </div>
            </div>
          </Card>

          <Card title="Attendance Settings">
            <div className="space-y-4">
              <Input label="Working Hours Per Day" type="number" defaultValue="9" />
              <Input label="Working Days Per Week" type="number" defaultValue="5" />
              <Input label="Late Mark After (minutes)" type="number" defaultValue="15" />
            </div>
          </Card>

          <Card title="Leave Settings">
            <div className="space-y-4">
              <Input label="Casual Leave Per Year" type="number" defaultValue="12" />
              <Input label="Sick Leave Per Year" type="number" defaultValue="10" />
              <Input label="Earned Leave Per Year" type="number" defaultValue="15" />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button>Save Settings</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
