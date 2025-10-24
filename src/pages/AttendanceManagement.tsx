import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { 
  ArrowLeft, 
  Search, 
  Filter,
  Download,
  Edit,
  Calendar,
  Clock,
  Users
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string;
  totalHours: number;
  breakTime: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
  overtime: number;
}

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    date: '2024-10-24',
    clockIn: '09:00',
    clockOut: '17:30',
    totalHours: 8.5,
    breakTime: 1,
    status: 'present',
    overtime: 0.5
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Sarah Johnson',
    date: '2024-10-24',
    clockIn: '09:15',
    clockOut: '17:45',
    totalHours: 8.5,
    breakTime: 1,
    status: 'late',
    overtime: 0.5
  },
  {
    id: '3',
    employeeId: 'EMP003',
    employeeName: 'Mike Wilson',
    date: '2024-10-24',
    clockIn: '-',
    clockOut: '-',
    totalHours: 0,
    breakTime: 0,
    status: 'absent',
    overtime: 0
  },
  {
    id: '4',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    date: '2024-10-23',
    clockIn: '09:00',
    clockOut: '17:00',
    totalHours: 8,
    breakTime: 1,
    status: 'present',
    overtime: 0
  }
];

export default function AttendanceManagement() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || record.date === filterDate;
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const handleEditRecord = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsEditDialogOpen(true);
  };

  const handleUpdateRecord = () => {
    if (selectedRecord) {
      setRecords(records.map(record => 
        record.id === selectedRecord.id ? selectedRecord : record
      ));
      setIsEditDialogOpen(false);
      setSelectedRecord(null);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Employee ID', 'Employee Name', 'Date', 'Clock In', 'Clock Out', 'Total Hours', 'Status', 'Overtime'],
      ...filteredRecords.map(record => [
        record.employeeId,
        record.employeeName,
        record.date,
        record.clockIn,
        record.clockOut,
        record.totalHours.toString(),
        record.status,
        record.overtime.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_records.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'default';
      case 'late': return 'secondary';
      case 'absent': return 'destructive';
      case 'half-day': return 'outline';
      default: return 'default';
    }
  };

  const todayStats = {
    totalEmployees: 12,
    present: records.filter(r => r.date === '2024-10-24' && r.status === 'present').length,
    late: records.filter(r => r.date === '2024-10-24' && r.status === 'late').length,
    absent: records.filter(r => r.date === '2024-10-24' && r.status === 'absent').length,
    attendanceRate: Math.round((records.filter(r => r.date === '2024-10-24' && r.status !== 'absent').length / 12) * 100)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
                <p className="text-sm text-gray-600">Monitor and manage employee attendance records</p>
              </div>
            </div>
            <Button onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{todayStats.totalEmployees}</p>
                  <p className="text-sm text-gray-600">Total Employees</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{todayStats.present}</p>
                  <p className="text-sm text-gray-600">Present</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{todayStats.late}</p>
                  <p className="text-sm text-gray-600">Late</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{todayStats.absent}</p>
                  <p className="text-sm text-gray-600">Absent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{todayStats.attendanceRate}%</p>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Filter by date"
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="half-day">Half Day</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setFilterDate('');
                setFilterStatus('all');
              }}>
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>
              {filteredRecords.length} record(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Overtime</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.employeeId}</TableCell>
                    <TableCell>{record.employeeName}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.clockIn}</TableCell>
                    <TableCell>{record.clockOut}</TableCell>
                    <TableCell>{record.totalHours}h</TableCell>
                    <TableCell>{record.overtime}h</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRecord(record)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Record Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Attendance Record</DialogTitle>
              <DialogDescription>
                Modify attendance details for {selectedRecord?.employeeName}
              </DialogDescription>
            </DialogHeader>
            {selectedRecord && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clockIn">Clock In</Label>
                    <Input
                      id="clockIn"
                      type="time"
                      value={selectedRecord.clockIn}
                      onChange={(e) => setSelectedRecord({...selectedRecord, clockIn: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clockOut">Clock Out</Label>
                    <Input
                      id="clockOut"
                      type="time"
                      value={selectedRecord.clockOut}
                      onChange={(e) => setSelectedRecord({...selectedRecord, clockOut: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={selectedRecord.status} 
                    onValueChange={(value: AttendanceRecord['status']) => setSelectedRecord({...selectedRecord, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="half-day">Half Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalHours">Total Hours</Label>
                    <Input
                      id="totalHours"
                      type="number"
                      step="0.5"
                      value={selectedRecord.totalHours}
                      onChange={(e) => setSelectedRecord({...selectedRecord, totalHours: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overtime">Overtime</Label>
                    <Input
                      id="overtime"
                      type="number"
                      step="0.5"
                      value={selectedRecord.overtime}
                      onChange={(e) => setSelectedRecord({...selectedRecord, overtime: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRecord}>
                Update Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}