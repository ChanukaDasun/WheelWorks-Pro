import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { 
  ArrowLeft, 
  Calculator, 
  Download, 
  Eye,
  DollarSign,
  Users,
  FileText
} from 'lucide-react';

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  position: string;
  hourlyRate: number;
  hoursWorked: number;
  overtime: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'calculated' | 'pending' | 'paid';
}

interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  baseSalary: number;
  overtimePay: number;
  allowances: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  generatedDate: string;
  paidDate?: string;
  status: 'generated' | 'sent' | 'paid';
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'John Doe',
    position: 'Tyre Technician',
    hourlyRate: 25,
    hoursWorked: 160,
    overtime: 8,
    baseSalary: 4000,
    allowances: 200,
    deductions: 400,
    netSalary: 4000,
    status: 'calculated'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Sarah Johnson',
    position: 'Service Advisor',
    hourlyRate: 22,
    hoursWorked: 160,
    overtime: 4,
    baseSalary: 3520,
    allowances: 150,
    deductions: 350,
    netSalary: 3408,
    status: 'pending'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Mike Wilson',
    position: 'Inventory Manager',
    hourlyRate: 28,
    hoursWorked: 160,
    overtime: 12,
    baseSalary: 4480,
    allowances: 300,
    deductions: 450,
    netSalary: 4834,
    status: 'paid'
  }
];

const mockPayslips: Payslip[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    month: 'October',
    year: 2024,
    baseSalary: 4000,
    overtimePay: 300,
    allowances: 200,
    grossSalary: 4500,
    deductions: 500,
    netSalary: 4000,
    generatedDate: '2024-10-24',
    paidDate: '2024-10-25',
    status: 'paid'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Sarah Johnson',
    month: 'October',
    year: 2024,
    baseSalary: 3520,
    overtimePay: 132,
    allowances: 150,
    grossSalary: 3802,
    deductions: 380,
    netSalary: 3422,
    generatedDate: '2024-10-24',
    status: 'generated'
  }
];

export default function SalaryManagement() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [payslips, setPayslips] = useState<Payslip[]>(mockPayslips);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [selectedYear, setSelectedYear] = useState(2024);

  const calculateSalary = (employee: Employee) => {
    const regularPay = employee.hoursWorked * employee.hourlyRate;
    const overtimePay = employee.overtime * employee.hourlyRate * 1.5;
    const grossSalary = regularPay + overtimePay + employee.allowances;
    const netSalary = grossSalary - employee.deductions;
    
    return {
      regularPay,
      overtimePay,
      grossSalary,
      netSalary
    };
  };

  const handleCalculateAllSalaries = () => {
    const updatedEmployees = employees.map(emp => {
      const calculated = calculateSalary(emp);
      return {
        ...emp,
        baseSalary: calculated.regularPay,
        netSalary: calculated.netSalary,
        status: 'calculated' as const
      };
    });
    setEmployees(updatedEmployees);
  };

  const generatePayslip = (employee: Employee) => {
    const calculated = calculateSalary(employee);
    const payslip: Payslip = {
      id: Date.now().toString(),
      employeeId: employee.employeeId,
      employeeName: employee.name,
      month: selectedMonth,
      year: selectedYear,
      baseSalary: calculated.regularPay,
      overtimePay: calculated.overtimePay,
      allowances: employee.allowances,
      grossSalary: calculated.grossSalary,
      deductions: employee.deductions,
      netSalary: calculated.netSalary,
      generatedDate: new Date().toISOString().split('T')[0],
      status: 'generated'
    };
    
    setPayslips([payslip, ...payslips]);
    
    // Update employee status
    setEmployees(employees.map(emp => 
      emp.id === employee.id ? { ...emp, status: 'calculated' } : emp
    ));
  };

  const printPayslip = (payslip: Payslip) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Payslip - ${payslip.employeeName}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .company { font-size: 24px; font-weight: bold; }
              .payslip-title { font-size: 18px; margin-top: 10px; }
              .employee-info { margin-bottom: 20px; }
              .salary-table { width: 100%; border-collapse: collapse; }
              .salary-table th, .salary-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .salary-table th { background-color: #f2f2f2; }
              .total-row { font-weight: bold; background-color: #f9f9f9; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="company">Tyre Centre Management</div>
              <div class="payslip-title">Salary Slip</div>
            </div>
            
            <div class="employee-info">
              <p><strong>Employee ID:</strong> ${payslip.employeeId}</p>
              <p><strong>Employee Name:</strong> ${payslip.employeeName}</p>
              <p><strong>Month/Year:</strong> ${payslip.month} ${payslip.year}</p>
              <p><strong>Generated Date:</strong> ${payslip.generatedDate}</p>
            </div>

            <table class="salary-table">
              <tr><th>Description</th><th>Amount</th></tr>
              <tr><td>Base Salary</td><td>$${payslip.baseSalary.toFixed(2)}</td></tr>
              <tr><td>Overtime Pay</td><td>$${payslip.overtimePay.toFixed(2)}</td></tr>
              <tr><td>Allowances</td><td>$${payslip.allowances.toFixed(2)}</td></tr>
              <tr class="total-row"><td>Gross Salary</td><td>$${payslip.grossSalary.toFixed(2)}</td></tr>
              <tr><td>Deductions</td><td>$${payslip.deductions.toFixed(2)}</td></tr>
              <tr class="total-row"><td>Net Salary</td><td>$${payslip.netSalary.toFixed(2)}</td></tr>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const totalPayroll = employees.reduce((sum, emp) => sum + emp.netSalary, 0);
  const calculatedCount = employees.filter(emp => emp.status === 'calculated').length;
  const paidCount = employees.filter(emp => emp.status === 'paid').length;

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
                <h1 className="text-2xl font-bold text-gray-900">Salary Management</h1>
                <p className="text-sm text-gray-600">Calculate salaries and manage payslips</p>
              </div>
            </div>
            <Button onClick={handleCalculateAllSalaries}>
              <Calculator className="h-4 w-4 mr-2" />
              Calculate All Salaries
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">${totalPayroll.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Payroll</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                <Calculator className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{calculatedCount}</p>
                  <p className="text-sm text-gray-600">Calculated</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{paidCount}</p>
                  <p className="text-sm text-gray-600">Paid</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="calculation" className="space-y-6">
          <TabsList>
            <TabsTrigger value="calculation">Salary Calculation</TabsTrigger>
            <TabsTrigger value="payslips">Payslips</TabsTrigger>
          </TabsList>

          <TabsContent value="calculation">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Salary Calculation</CardTitle>
                    <CardDescription>
                      Calculate monthly salaries for all employees
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Hourly Rate</TableHead>
                      <TableHead>Hours Worked</TableHead>
                      <TableHead>Overtime</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.employeeId}</TableCell>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>${employee.hourlyRate}/hr</TableCell>
                        <TableCell>{employee.hoursWorked}h</TableCell>
                        <TableCell>{employee.overtime}h</TableCell>
                        <TableCell className="font-semibold">${employee.netSalary.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            employee.status === 'paid' ? 'default' :
                            employee.status === 'calculated' ? 'secondary' : 'destructive'
                          }>
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(employee)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Salary Details - {employee.name}</DialogTitle>
                                  <DialogDescription>
                                    Detailed salary breakdown for {selectedMonth} {selectedYear}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedEmployee && (
                                  <div className="space-y-6 py-4">
                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="space-y-4">
                                        <div>
                                          <Label className="text-sm font-medium text-gray-500">Employee Information</Label>
                                          <div className="mt-2 space-y-1">
                                            <p><strong>ID:</strong> {selectedEmployee.employeeId}</p>
                                            <p><strong>Name:</strong> {selectedEmployee.name}</p>
                                            <p><strong>Position:</strong> {selectedEmployee.position}</p>
                                            <p><strong>Hourly Rate:</strong> ${selectedEmployee.hourlyRate}</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="space-y-4">
                                        <div>
                                          <Label className="text-sm font-medium text-gray-500">Work Hours</Label>
                                          <div className="mt-2 space-y-1">
                                            <p><strong>Regular Hours:</strong> {selectedEmployee.hoursWorked}h</p>
                                            <p><strong>Overtime Hours:</strong> {selectedEmployee.overtime}h</p>
                                            <p><strong>Total Hours:</strong> {selectedEmployee.hoursWorked + selectedEmployee.overtime}h</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="border-t pt-4">
                                      <Label className="text-sm font-medium text-gray-500">Salary Calculation</Label>
                                      <div className="mt-2 space-y-2">
                                        <div className="flex justify-between">
                                          <span>Regular Pay ({selectedEmployee.hoursWorked}h × ${selectedEmployee.hourlyRate})</span>
                                          <span>${(selectedEmployee.hoursWorked * selectedEmployee.hourlyRate).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Overtime Pay ({selectedEmployee.overtime}h × ${selectedEmployee.hourlyRate} × 1.5)</span>
                                          <span>${(selectedEmployee.overtime * selectedEmployee.hourlyRate * 1.5).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Allowances</span>
                                          <span>${selectedEmployee.allowances.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold border-t pt-2">
                                          <span>Gross Salary</span>
                                          <span>${calculateSalary(selectedEmployee).grossSalary.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Deductions</span>
                                          <span>-${selectedEmployee.deductions.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                                          <span>Net Salary</span>
                                          <span>${calculateSalary(selectedEmployee).netSalary.toFixed(2)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="flex justify-end gap-2">
                                  <Button onClick={() => generatePayslip(selectedEmployee!)}>
                                    Generate Payslip
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => generatePayslip(employee)}
                            >
                              Generate Payslip
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payslips">
            <Card>
              <CardHeader>
                <CardTitle>Generated Payslips</CardTitle>
                <CardDescription>
                  View and manage employee payslips
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Month/Year</TableHead>
                      <TableHead>Gross Salary</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Generated Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payslips.map((payslip) => (
                      <TableRow key={payslip.id}>
                        <TableCell className="font-medium">{payslip.employeeId}</TableCell>
                        <TableCell>{payslip.employeeName}</TableCell>
                        <TableCell>{payslip.month} {payslip.year}</TableCell>
                        <TableCell>${payslip.grossSalary.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold">${payslip.netSalary.toLocaleString()}</TableCell>
                        <TableCell>{payslip.generatedDate}</TableCell>
                        <TableCell>
                          <Badge variant={
                            payslip.status === 'paid' ? 'default' :
                            payslip.status === 'sent' ? 'secondary' : 'outline'
                          }>
                            {payslip.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedPayslip(payslip)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Payslip - {payslip.employeeName}</DialogTitle>
                                  <DialogDescription>
                                    {payslip.month} {payslip.year}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedPayslip && (
                                  <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <p><strong>Employee ID:</strong> {selectedPayslip.employeeId}</p>
                                        <p><strong>Employee Name:</strong> {selectedPayslip.employeeName}</p>
                                        <p><strong>Period:</strong> {selectedPayslip.month} {selectedPayslip.year}</p>
                                        <p><strong>Generated:</strong> {selectedPayslip.generatedDate}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="border rounded-lg p-4">
                                      <h4 className="font-semibold mb-3">Salary Breakdown</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span>Base Salary</span>
                                          <span>${selectedPayslip.baseSalary.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Overtime Pay</span>
                                          <span>${selectedPayslip.overtimePay.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Allowances</span>
                                          <span>${selectedPayslip.allowances.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold border-t pt-2">
                                          <span>Gross Salary</span>
                                          <span>${selectedPayslip.grossSalary.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Deductions</span>
                                          <span>-${selectedPayslip.deductions.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                                          <span>Net Salary</span>
                                          <span>${selectedPayslip.netSalary.toFixed(2)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => printPayslip(selectedPayslip!)}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Print
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => printPayslip(payslip)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}