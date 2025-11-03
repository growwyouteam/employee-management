import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesAPI } from '../../api/employees';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/helpers';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: employeeData, isLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeesAPI.getById(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => employeesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
      navigate('/employees');
    },
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) return <Loading />;

  const employee = employeeData?.data;

  if (!employee) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Employee not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/employees')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/employees/${id}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deleteMutation.isPending}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={employee.profileImage}
            alt={employee.firstName}
            className="w-32 h-32 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {employee.firstName} {employee.lastName}
                </h1>
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

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card title="Personal Information">
          <div className="space-y-3">
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
              <p className="text-sm text-gray-500">Emergency Contact</p>
              <p className="font-medium">{employee.emergencyContact?.name}</p>
              <p className="text-sm text-gray-500">{employee.emergencyContact?.phone}</p>
            </div>
          </div>
        </Card>

        {/* Job Information */}
        <Card title="Job Information">
          <div className="space-y-3">
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
              <p className="text-sm text-gray-500">Salary</p>
              <p className="font-medium">{formatCurrency(employee.salary)}</p>
            </div>
          </div>
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
    </div>
  );
};

export default EmployeeDetail;
