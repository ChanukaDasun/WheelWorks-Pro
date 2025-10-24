import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Trash2,
  Users,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  status: 'active' | 'inactive';
  joinDate: string;
  address: string;
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@tyrecentre.com',
    phone: '+1234567890',
    position: 'Tyre Technician',
    department: 'Operations',
    salary: 45000,
    status: 'active',
    joinDate: '2023-01-15',
    address: '123 Main St, City, State'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@tyrecentre.com',
    phone: '+1234567891',
    position: 'Service Advisor',
    department: 'Customer Service',
    salary: 42000,
    status: 'active',
    joinDate: '2023-03-20',
    address: '456 Oak Ave, City, State'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Mike Wilson',
    email: 'mike.wilson@tyrecentre.com',
    phone: '+1234567892',
    position: 'Inventory Manager',
    department: 'Warehouse',
    salary: 50000,
    status: 'inactive',
    joinDate: '2022-11-10',
    address: '789 Pine Rd, City, State'
  }
];

export default function EmployeeManagement() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: 0,
    address: '',
    status: 'active'
  });

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddEmployee = () => {
    const employeeId = `EMP${String(employees.length + 1).padStart(3, '0')}`;
    const employee: Employee = {
      ...newEmployee as Employee,
      id: Date.now().toString(),
      employeeId,
      joinDate: new Date().toISOString().split('T')[0]
    };
    setEmployees([...employees, employee]);
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      salary: 0,
      address: '',
      status: 'active'
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees(employees.map(emp => 
      emp.id === id 
        ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' }
        : emp
    ));
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
                <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
                <p className="text-sm text-gray-600">Manage employee records and information</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>
                    Enter the employee details below
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={newEmployee.position}
                      onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                      placeholder="Enter position"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={newEmployee.department} onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Customer Service">Customer Service</SelectItem>
                        <SelectItem value="Warehouse">Warehouse</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Annual Salary</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={newEmployee.salary}
                      onChange={(e) => setNewEmployee({...newEmployee, salary: Number(e.target.value)})}
                      placeholder="Enter annual salary"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newEmployee.address}
                      onChange={(e) => setNewEmployee({...newEmployee, address: e.target.value})}
                      placeholder="Enter full address"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmployee}>
                    Add Employee
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{employees.length}</p>
                  <p className="text-sm text-gray-600">Total Employees</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{employees.filter(e => e.status === 'active').length}</p>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{employees.filter(e => e.status === 'inactive').length}</p>
                  <p className="text-sm text-gray-600">Inactive</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-gray-600">Departments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card>
          <CardHeader>
            <CardTitle>Employee List</CardTitle>
            <CardDescription>
              {filteredEmployees.length} employee(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.employeeId}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{employee.joinDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleEmployeeStatus(employee.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Employee Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
              <DialogDescription>
                Complete information for {selectedEmployee?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <div className="grid grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Employee ID</Label>
                    <p className="text-lg font-semibold">{selectedEmployee.employeeId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                    <p className="text-lg">{selectedEmployee.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Position</Label>
                    <p className="text-lg">{selectedEmployee.position}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Department</Label>
                    <p className="text-lg">{selectedEmployee.department}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p>{selectedEmployee.email}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p>{selectedEmployee.phone}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Address</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p>{selectedEmployee.address}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Annual Salary</Label>
                    <p className="text-lg font-semibold">${selectedEmployee.salary.toLocaleString()}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      <div className="mt-1">
                        <Badge variant={selectedEmployee.status === 'active' ? 'default' : 'secondary'}>
                          {selectedEmployee.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Join Date</Label>
                      <p className="text-lg">{selectedEmployee.joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}