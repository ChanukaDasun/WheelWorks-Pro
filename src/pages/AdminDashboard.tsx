import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Users, 
  Clock, 
  Package, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  LogOut,
  Settings,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const kpiCards = [
    {
      title: 'Total Employees',
      value: '12',
      description: '2 new this month',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Attendance Rate',
      value: '94%',
      description: 'This month average',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Stock Items',
      value: '1,247',
      description: '23 low stock alerts',
      icon: Package,
      color: 'text-orange-600'
    },
    {
      title: 'Monthly Revenue',
      value: '$24,500',
      description: '+12% from last month',
      icon: DollarSign,
      color: 'text-purple-600'
    }
  ];

  const quickActions = [
    {
      title: 'Employee Management',
      description: 'Add, edit, and manage employee records',
      icon: Users,
      onClick: () => navigate('/employees')
    },
    {
      title: 'Attendance Records',
      description: 'View and manage attendance logs',
      icon: Clock,
      onClick: () => navigate('/attendance')
    },
    {
      title: 'Stock Management',
      description: 'Track inventory and stock levels',
      icon: Package,
      onClick: () => navigate('/stock')
    },
    {
      title: 'Salary Management',
      description: 'Calculate salaries and generate payslips',
      icon: DollarSign,
      onClick: () => navigate('/salary')
    }
  ];

  const recentActivities = [
    { text: 'John Doe clocked in at 9:00 AM', time: '2 minutes ago', type: 'attendance' },
    { text: 'Low stock alert: Michelin 205/55R16', time: '15 minutes ago', type: 'alert' },
    { text: 'Sarah Johnson completed salary processing', time: '1 hour ago', type: 'salary' },
    { text: 'New stock received: 50 Bridgestone tyres', time: '2 hours ago', type: 'stock' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Access key management functions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={action.onClick}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Icon className="h-5 w-5 text-blue-600 mt-1" />
                            <div>
                              <h3 className="font-semibold text-sm">{action.title}</h3>
                              <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Latest system updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {activity.type === 'alert' && (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        )}
                        {activity.type === 'attendance' && (
                          <Clock className="h-4 w-4 text-green-500" />
                        )}
                        {activity.type === 'salary' && (
                          <DollarSign className="h-4 w-4 text-purple-500" />
                        )}
                        {activity.type === 'stock' && (
                          <Package className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.text}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stock Alerts */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Michelin 205/55R16</span>
                    <Badge variant="destructive">Low</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pirelli 225/45R17</span>
                    <Badge variant="destructive">Low</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Continental 195/65R15</span>
                    <Badge variant="secondary">Medium</Badge>
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