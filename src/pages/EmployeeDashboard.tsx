import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Clock, 
  LogOut, 
  Play, 
  Pause, 
  Square,
  Calendar,
  Coffee
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockedIn, setClockedIn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [totalWorkedHours, setTotalWorkedHours] = useState(0);
  const [totalBreakTime, setTotalBreakTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load saved state from localStorage
    const savedState = localStorage.getItem(`attendance_${user?.id}`);
    if (savedState) {
      const state = JSON.parse(savedState);
      setClockedIn(state.clockedIn);
      setOnBreak(state.onBreak);
      if (state.clockInTime) setClockInTime(new Date(state.clockInTime));
      if (state.breakStartTime) setBreakStartTime(new Date(state.breakStartTime));
      setTotalWorkedHours(state.totalWorkedHours || 0);
      setTotalBreakTime(state.totalBreakTime || 0);
    }

    return () => clearInterval(timer);
  }, [user?.id]);

  useEffect(() => {
    // Save state to localStorage
    const state = {
      clockedIn,
      onBreak,
      clockInTime: clockInTime?.toISOString(),
      breakStartTime: breakStartTime?.toISOString(),
      totalWorkedHours,
      totalBreakTime
    };
    localStorage.setItem(`attendance_${user?.id}`, JSON.stringify(state));
  }, [clockedIn, onBreak, clockInTime, breakStartTime, totalWorkedHours, totalBreakTime, user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClockIn = () => {
    setClockedIn(true);
    setClockInTime(new Date());
  };

  const handleClockOut = () => {
    if (clockInTime) {
      const workedTime = (new Date().getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
      setTotalWorkedHours(prev => prev + workedTime);
    }
    setClockedIn(false);
    setOnBreak(false);
    setClockInTime(null);
    setBreakStartTime(null);
  };

  const handleStartBreak = () => {
    setOnBreak(true);
    setBreakStartTime(new Date());
  };

  const handleEndBreak = () => {
    if (breakStartTime) {
      const breakTime = (new Date().getTime() - breakStartTime.getTime()) / (1000 * 60 * 60);
      setTotalBreakTime(prev => prev + breakTime);
    }
    setOnBreak(false);
    setBreakStartTime(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getCurrentSessionTime = () => {
    if (!clockInTime) return '0h 0m';
    const elapsed = (currentTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
    return formatDuration(elapsed);
  };

  const getCurrentBreakTime = () => {
    if (!breakStartTime) return '0h 0m';
    const elapsed = (currentTime.getTime() - breakStartTime.getTime()) / (1000 * 60 * 60);
    return formatDuration(elapsed);
  };

  const recentAttendance = [
    { date: '2024-10-23', clockIn: '09:00 AM', clockOut: '05:30 PM', hours: '8h 30m', status: 'Present' },
    { date: '2024-10-22', clockIn: '09:15 AM', clockOut: '05:45 PM', hours: '8h 30m', status: 'Present' },
    { date: '2024-10-21', clockIn: '09:00 AM', clockOut: '05:00 PM', hours: '8h 0m', status: 'Present' },
    { date: '2024-10-20', clockIn: '-', clockOut: '-', hours: '0h 0m', status: 'Absent' },
    { date: '2024-10-19', clockIn: '09:30 AM', clockOut: '05:30 PM', hours: '8h 0m', status: 'Late' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name} ({user?.employeeId})</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Current Time</p>
                <p className="text-lg font-semibold">{formatTime(currentTime)}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Clock In/Out Section */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time Tracking
                </CardTitle>
                <CardDescription>
                  Manage your work hours and breaks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Clock In/Out */}
                  <div className="text-center">
                    <div className="mb-4">
                      <Badge variant={clockedIn ? 'default' : 'secondary'} className="mb-2">
                        {clockedIn ? 'Clocked In' : 'Clocked Out'}
                      </Badge>
                      {clockInTime && (
                        <p className="text-sm text-gray-600">
                          Started at: {formatTime(clockInTime)}
                        </p>
                      )}
                    </div>
                    
                    {!clockedIn ? (
                      <Button onClick={handleClockIn} size="lg" className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Clock In
                      </Button>
                    ) : (
                      <Button onClick={handleClockOut} variant="destructive" size="lg" className="w-full">
                        <Square className="h-4 w-4 mr-2" />
                        Clock Out
                      </Button>
                    )}
                  </div>

                  {/* Break Management */}
                  <div className="text-center">
                    <div className="mb-4">
                      <Badge variant={onBreak ? 'secondary' : 'outline'} className="mb-2">
                        {onBreak ? 'On Break' : 'Working'}
                      </Badge>
                      {breakStartTime && (
                        <p className="text-sm text-gray-600">
                          Break started: {formatTime(breakStartTime)}
                        </p>
                      )}
                    </div>
                    
                    {clockedIn && (
                      !onBreak ? (
                        <Button onClick={handleStartBreak} variant="outline" size="lg" className="w-full">
                          <Coffee className="h-4 w-4 mr-2" />
                          Start Break
                        </Button>
                      ) : (
                        <Button onClick={handleEndBreak} size="lg" className="w-full">
                          <Pause className="h-4 w-4 mr-2" />
                          End Break
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{getCurrentSessionTime()}</p>
                    <p className="text-sm text-gray-600">Current Session</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{formatDuration(totalWorkedHours)}</p>
                    <p className="text-sm text-gray-600">Total Worked</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{getCurrentBreakTime()}</p>
                    <p className="text-sm text-gray-600">Current Break</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{formatDuration(totalBreakTime)}</p>
                    <p className="text-sm text-gray-600">Total Breaks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Recent Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAttendance.map((record, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{record.date}</p>
                          <p className="text-xs text-gray-600">
                            {record.clockIn} - {record.clockOut}
                          </p>
                          <p className="text-xs text-gray-600">{record.hours}</p>
                        </div>
                        <Badge 
                          variant={
                            record.status === 'Present' ? 'default' :
                            record.status === 'Late' ? 'secondary' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {record.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Present Days</span>
                    <span className="font-semibold">18/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Hours</span>
                    <span className="font-semibold">144h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Overtime</span>
                    <span className="font-semibold">8h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Attendance Rate</span>
                    <span className="font-semibold text-green-600">90%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}