import { format, subDays, addDays } from 'date-fns';

const generateAttendanceRecords = () => {
  const records = [];
  const employeeIds = ['EMP001', 'EMP002', 'EMP003', 'EMP004', 'EMP005', 'EMP006', 'EMP007', 'EMP008', 'EMP009', 'EMP010'];
  
  // Generate last 30 days attendance
  for (let i = 0; i < 30; i++) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    
    employeeIds.forEach((empId) => {
      const random = Math.random();
      let status = 'Present';
      let checkIn = '09:00';
      let checkOut = '18:00';
      let workHours = 9;
      
      if (random < 0.05) {
        status = 'Absent';
        checkIn = null;
        checkOut = null;
        workHours = 0;
      } else if (random < 0.10) {
        status = 'Half Day';
        checkIn = '09:00';
        checkOut = '13:00';
        workHours = 4;
      } else if (random < 0.15) {
        status = 'Late';
        checkIn = '10:30';
        checkOut = '18:00';
        workHours = 7.5;
      }
      
      records.push({
        id: `ATT-${empId}-${date}`,
        employeeId: empId,
        date,
        status,
        checkIn,
        checkOut,
        workHours,
        location: 'Office',
        notes: status === 'Late' ? 'Traffic delay' : '',
      });
    });
  }
  
  return records;
};

export const attendanceRecords = generateAttendanceRecords();

export const attendanceSummary = {
  totalWorkingDays: 22,
  presentDays: 20,
  absentDays: 1,
  halfDays: 1,
  lateDays: 2,
  leaves: 1,
  attendancePercentage: 90.9,
};
