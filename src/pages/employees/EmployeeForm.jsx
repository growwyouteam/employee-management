import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employeesAPI } from '../../api/employees';
import { adminAPI } from '../../api/admin';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Loading from '../../components/common/Loading';
import { ArrowLeft } from 'lucide-react';

const employeeSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  dateOfBirth: z.string(),
  gender: z.string(),
  address: z.string(),
  joiningDate: z.string(),
  department: z.string(),
  designation: z.string(),
  employeeType: z.string(),
  salary: z.string(),
});

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: employeeData, isLoading: loadingEmployee } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeesAPI.getById(id),
    enabled: isEdit,
  });

  const { data: departmentsData } = useQuery({
    queryKey: ['departments'],
    queryFn: () => adminAPI.getDepartments(),
  });

  const { data: designationsData } = useQuery({
    queryKey: ['designations'],
    queryFn: () => adminAPI.getDesignations(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeSchema),
  });

  useEffect(() => {
    if (employeeData?.data) {
      reset({
        ...employeeData.data,
        salary: employeeData.data.salary.toString(),
      });
    }
  }, [employeeData, reset]);

  const saveMutation = useMutation({
    mutationFn: (data) =>
      isEdit ? employeesAPI.update(id, data) : employeesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
      navigate('/employees');
    },
  });

  const onSubmit = (data) => {
    saveMutation.mutate({
      ...data,
      salary: parseFloat(data.salary),
      role: 'Employee',
      status: 'Active',
    });
  };

  if (loadingEmployee) return <Loading />;

  const departments = departmentsData?.data || [];
  const designations = designationsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/employees')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Employee' : 'Add New Employee'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Update employee information' : 'Fill in the details below'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <Card title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              required
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <Input
              label="Last Name"
              required
              {...register('lastName')}
              error={errors.lastName?.message}
            />
            <Input
              label="Email"
              type="email"
              required
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Phone"
              required
              {...register('phone')}
              error={errors.phone?.message}
            />
            <Input
              label="Date of Birth"
              type="date"
              required
              {...register('dateOfBirth')}
              error={errors.dateOfBirth?.message}
            />
            <Select
              label="Gender"
              required
              {...register('gender')}
              options={[
                { value: '', label: 'Select Gender' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
              error={errors.gender?.message}
            />
            <div className="md:col-span-2">
              <Input
                label="Address"
                required
                {...register('address')}
                error={errors.address?.message}
              />
            </div>
          </div>
        </Card>

        {/* Job Information */}
        <Card title="Job Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Joining Date"
              type="date"
              required
              {...register('joiningDate')}
              error={errors.joiningDate?.message}
            />
            <Select
              label="Department"
              required
              {...register('department')}
              options={[
                { value: '', label: 'Select Department' },
                ...departments.map((dept) => ({ value: dept, label: dept })),
              ]}
              error={errors.department?.message}
            />
            <Select
              label="Designation"
              required
              {...register('designation')}
              options={[
                { value: '', label: 'Select Designation' },
                ...designations.map((des) => ({ value: des, label: des })),
              ]}
              error={errors.designation?.message}
            />
            <Select
              label="Employment Type"
              required
              {...register('employeeType')}
              options={[
                { value: '', label: 'Select Type' },
                { value: 'Full-time', label: 'Full-time' },
                { value: 'Part-time', label: 'Part-time' },
                { value: 'Contract', label: 'Contract' },
                { value: 'Intern', label: 'Intern' },
              ]}
              error={errors.employeeType?.message}
            />
            <Input
              label="Salary (Monthly)"
              type="number"
              required
              {...register('salary')}
              error={errors.salary?.message}
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/employees')}
          >
            Cancel
          </Button>
          <Button type="submit" loading={saveMutation.isPending}>
            {isEdit ? 'Update Employee' : 'Add Employee'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
