import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leavesAPI } from '../../api/leaves';
import useAuthStore from '../../store/authStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Loading from '../../components/common/Loading';
import { Plus, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { formatDate } from '../../utils/helpers';

const LeavesPage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const { data: leavesData, isLoading } = useQuery({
    queryKey: ['leaves', user?.id, filter],
    queryFn: () => leavesAPI.getAll({ employeeId: user?.id, status: filter }),
  });

  const { data: leaveTypesData } = useQuery({
    queryKey: ['leave-types'],
    queryFn: () => leavesAPI.getTypes(),
  });

  const { data: balanceData } = useQuery({
    queryKey: ['leave-balance', user?.id],
    queryFn: () => leavesAPI.getBalance(user?.id),
  });

  const { register, handleSubmit, reset } = useForm();

  const applyLeaveMutation = useMutation({
    mutationFn: (data) => leavesAPI.apply(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['leaves']);
      queryClient.invalidateQueries(['leave-balance']);
      setIsModalOpen(false);
      reset();
    },
  });

  const onSubmit = (data) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    applyLeaveMutation.mutate({
      employeeId: user?.id,
      employeeName: user?.name,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      days,
      reason: data.reason,
    });
  };

  const leaves = leavesData?.data || [];
  const leaveTypes = leaveTypesData?.data || [];
  const balance = balanceData?.data || {};

  const columns = [
    {
      key: 'id',
      label: 'Leave ID',
    },
    {
      key: 'leaveType',
      label: 'Type',
      render: (value) => {
        const type = leaveTypes.find(t => t.id === value);
        return <Badge variant={type?.color}>{type?.name || value}</Badge>;
      },
    },
    {
      key: 'startDate',
      label: 'Start Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'endDate',
      label: 'End Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'days',
      label: 'Days',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <Badge status={value}>{value}</Badge>,
    },
    {
      key: 'appliedOn',
      label: 'Applied On',
      render: (value) => formatDate(value),
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leaves</h1>
          <p className="text-gray-600 mt-1">Manage your leave requests</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Apply Leave
        </Button>
      </div>

      {/* Leave Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(balance).map(([key, value]) => {
          const type = leaveTypes.find(t => t.id === key);
          return (
            <Card key={key} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">{type?.name || key}</p>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{value.remaining}</p>
                  <p className="text-xs text-gray-500">Available</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{value.used} used</p>
                  <p className="text-xs text-gray-500">of {value.total}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filter */}
      <Card>
        <div className="flex gap-2">
          {['all', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </Card>

      {/* Leaves Table */}
      <Card title="Leave History">
        <Table columns={columns} data={leaves} />
      </Card>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Apply for Leave"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Leave Type"
            required
            {...register('leaveType')}
            options={[
              { value: '', label: 'Select Leave Type' },
              ...leaveTypes.map((type) => ({ value: type.id, label: type.name })),
            ]}
          />
          <Input
            label="Start Date"
            type="date"
            required
            {...register('startDate')}
          />
          <Input
            label="End Date"
            type="date"
            required
            {...register('endDate')}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('reason')}
              required
              rows={3}
              className="input-field"
              placeholder="Enter reason for leave"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={applyLeaveMutation.isPending}>
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LeavesPage;
