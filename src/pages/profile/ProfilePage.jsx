import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../../store/authStore';
import { employeesAPI } from '../../api/employees';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/helpers';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const { data: employeeData, isLoading } = useQuery({
    queryKey: ['employee', user?.id],
    queryFn: () => employeesAPI.getById(user?.id),
    enabled: !!user?.id,
  });

  if (isLoading) return <Loading />;

  const employee = employeeData?.data;

  if (!employee) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="w-4 h-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative">
            <img
              src={employee.profileImage}
              alt={employee.firstName}
              className="w-32 h-32 rounded-full"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700">
                <Edit className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {employee.firstName} {employee.lastName}
                </h2>
                <p className="text-gray-600">{employee.designation}</p>
                <p className="text-sm text-gray-500">{employee.department}</p>
              </div>
              <Badge status={employee.status}>{employee.status}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{employee.address}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Joined: {formatDate(employee.joiningDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card title="Personal Information">
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" defaultValue={employee.firstName} />
            <Input label="Last Name" defaultValue={employee.lastName} />
            <Input label="Email" type="email" defaultValue={employee.email} />
            <Input label="Phone" defaultValue={employee.phone} />
            <Input label="Date of Birth" type="date" defaultValue={employee.dateOfBirth} />
            <Input label="Gender" defaultValue={employee.gender} />
            <div className="md:col-span-2">
              <Input label="Address" defaultValue={employee.address} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="font-medium">{employee.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium">{formatDate(employee.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium">{employee.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{employee.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{employee.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{employee.address}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Job Information */}
      <Card title="Job Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-medium">{employee.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Designation</p>
            <p className="font-medium">{employee.designation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Employment Type</p>
            <p className="font-medium">{employee.employeeType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Joining Date</p>
            <p className="font-medium">{formatDate(employee.joiningDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium">{employee.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Salary</p>
            <p className="font-medium">{formatCurrency(employee.salary)}</p>
          </div>
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card title="Emergency Contact">
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Contact Name" defaultValue={employee.emergencyContact?.name} />
            <Input label="Relationship" defaultValue={employee.emergencyContact?.relationship} />
            <Input label="Phone Number" defaultValue={employee.emergencyContact?.phone} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{employee.emergencyContact?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Relationship</p>
              <p className="font-medium">{employee.emergencyContact?.relationship}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{employee.emergencyContact?.phone}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Documents */}
      <Card title="Documents">
        <div className="space-y-3">
          {employee.documents?.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{doc.type}</p>
                <p className="text-sm text-gray-500">{doc.number}</p>
              </div>
              <Badge status={doc.verified ? 'Approved' : 'Pending'}>
                {doc.verified ? 'Verified' : 'Pending'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
