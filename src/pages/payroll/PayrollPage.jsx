import { useQuery } from '@tanstack/react-query';
import { payrollAPI } from '../../api/payroll';
import useAuthStore from '../../store/authStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import { Download, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';

const PayrollPage = () => {
  const { user } = useAuthStore();

  const { data: payslipsData, isLoading } = useQuery({
    queryKey: ['payslips', user?.id],
    queryFn: () => payrollAPI.getPayslips({ employeeId: user?.id }),
  });

  const { data: structureData } = useQuery({
    queryKey: ['salary-structure', user?.id],
    queryFn: () => payrollAPI.getStructure(user?.id),
  });

  const payslips = payslipsData?.data || [];
  const structure = structureData?.data || {};

  const columns = [
    {
      key: 'month',
      label: 'Month',
      render: (value, row) => `${value} ${row.year}`,
    },
    {
      key: 'payPeriod',
      label: 'Pay Period',
    },
    {
      key: 'gross',
      label: 'Gross Salary',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'totalDeductions',
      label: 'Deductions',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'netSalary',
      label: 'Net Salary',
      render: (value) => <span className="font-semibold">{formatCurrency(value)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <Badge status={value}>{value}</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <Button size="sm" variant="outline" className="flex items-center gap-1">
          <Download className="w-3 h-3" />
          Download
        </Button>
      ),
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
        <p className="text-gray-600 mt-1">View your salary details and payslips</p>
      </div>

      {/* Salary Structure */}
      {structure.gross && (
        <Card title="Current Salary Structure">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Earnings</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Basic Salary</span>
                  <span className="font-medium">{formatCurrency(structure.basic)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">HRA</span>
                  <span className="font-medium">{formatCurrency(structure.hra)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">DA</span>
                  <span className="font-medium">{formatCurrency(structure.da)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conveyance</span>
                  <span className="font-medium">{formatCurrency(structure.conveyance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Medical</span>
                  <span className="font-medium">{formatCurrency(structure.medical)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Special Allowance</span>
                  <span className="font-medium">{formatCurrency(structure.specialAllowance)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Gross Salary</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(structure.gross)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Deductions</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">PF (Employee)</span>
                  <span className="font-medium">{formatCurrency(structure.pf)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ESI</span>
                  <span className="font-medium">{formatCurrency(structure.esi)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TDS</span>
                  <span className="font-medium">{formatCurrency(structure.tds)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total Deductions</span>
                  <span className="font-semibold text-red-600">{formatCurrency(structure.totalDeductions)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-gray-300">
                  <span className="font-bold text-gray-900">Net Salary</span>
                  <span className="font-bold text-green-600 text-lg">{formatCurrency(structure.netSalary)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Payslips Table */}
      <Card title="Payslip History">
        <Table columns={columns} data={payslips} />
      </Card>
    </div>
  );
};

export default PayrollPage;
