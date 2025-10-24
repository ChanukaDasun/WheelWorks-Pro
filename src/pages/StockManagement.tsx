import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { 
  ArrowLeft, 
  Plus, 
  Package, 
  TrendingDown, 
  TrendingUp,
  AlertTriangle,
  Search,
  Download
} from 'lucide-react';

interface StockItem {
  id: string;
  itemCode: string;
  name: string;
  brand: string;
  size: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  lastUpdated: string;
}

interface StockTransaction {
  id: string;
  itemCode: string;
  itemName: string;
  type: 'incoming' | 'outgoing';
  quantity: number;
  unitPrice: number;
  totalValue: number;
  supplier?: string;
  customer?: string;
  reason: string;
  date: string;
  processedBy: string;
}

const mockStockItems: StockItem[] = [
  {
    id: '1',
    itemCode: 'TYR001',
    name: 'Michelin Primacy 4',
    brand: 'Michelin',
    size: '205/55R16',
    currentStock: 15,
    minStock: 10,
    maxStock: 50,
    unitPrice: 120,
    supplier: 'Michelin Distributor',
    lastUpdated: '2024-10-24'
  },
  {
    id: '2',
    itemCode: 'TYR002',
    name: 'Bridgestone Turanza T005',
    brand: 'Bridgestone',
    size: '225/45R17',
    currentStock: 8,
    minStock: 15,
    maxStock: 40,
    unitPrice: 135,
    supplier: 'Bridgestone Direct',
    lastUpdated: '2024-10-23'
  },
  {
    id: '3',
    itemCode: 'TYR003',
    name: 'Continental PremiumContact 6',
    brand: 'Continental',
    size: '195/65R15',
    currentStock: 25,
    minStock: 12,
    maxStock: 45,
    unitPrice: 110,
    supplier: 'Continental Supply Co',
    lastUpdated: '2024-10-24'
  }
];

const mockTransactions: StockTransaction[] = [
  {
    id: '1',
    itemCode: 'TYR001',
    itemName: 'Michelin Primacy 4',
    type: 'incoming',
    quantity: 20,
    unitPrice: 120,
    totalValue: 2400,
    supplier: 'Michelin Distributor',
    reason: 'Regular stock replenishment',
    date: '2024-10-24',
    processedBy: 'Admin User'
  },
  {
    id: '2',
    itemCode: 'TYR002',
    itemName: 'Bridgestone Turanza T005',
    type: 'outgoing',
    quantity: 4,
    unitPrice: 135,
    totalValue: 540,
    customer: 'John Smith',
    reason: 'Customer purchase',
    date: '2024-10-24',
    processedBy: 'Sarah Johnson'
  }
];

export default function StockManagement() {
  const navigate = useNavigate();
  const [stockItems, setStockItems] = useState<StockItem[]>(mockStockItems);
  const [transactions, setTransactions] = useState<StockTransaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [isIncomingDialogOpen, setIsIncomingDialogOpen] = useState(false);
  const [isOutgoingDialogOpen, setIsOutgoingDialogOpen] = useState(false);
  
  const [incomingStock, setIncomingStock] = useState({
    itemCode: '',
    quantity: 0,
    unitPrice: 0,
    supplier: '',
    reason: ''
  });

  const [outgoingStock, setOutgoingStock] = useState({
    itemCode: '',
    quantity: 0,
    customer: '',
    reason: ''
  });

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = stockItems.filter(item => item.currentStock <= item.minStock);
  const totalStockValue = stockItems.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);

  const handleIncomingStock = () => {
    const selectedItem = stockItems.find(item => item.itemCode === incomingStock.itemCode);
    if (selectedItem) {
      // Update stock
      setStockItems(stockItems.map(item =>
        item.itemCode === incomingStock.itemCode
          ? { ...item, currentStock: item.currentStock + incomingStock.quantity, lastUpdated: new Date().toISOString().split('T')[0] }
          : item
      ));

      // Add transaction
      const transaction: StockTransaction = {
        id: Date.now().toString(),
        itemCode: incomingStock.itemCode,
        itemName: selectedItem.name,
        type: 'incoming',
        quantity: incomingStock.quantity,
        unitPrice: incomingStock.unitPrice,
        totalValue: incomingStock.quantity * incomingStock.unitPrice,
        supplier: incomingStock.supplier,
        reason: incomingStock.reason,
        date: new Date().toISOString().split('T')[0],
        processedBy: 'Admin User'
      };
      setTransactions([transaction, ...transactions]);

      // Reset form
      setIncomingStock({
        itemCode: '',
        quantity: 0,
        unitPrice: 0,
        supplier: '',
        reason: ''
      });
      setIsIncomingDialogOpen(false);
    }
  };

  const handleOutgoingStock = () => {
    const selectedItem = stockItems.find(item => item.itemCode === outgoingStock.itemCode);
    if (selectedItem && selectedItem.currentStock >= outgoingStock.quantity) {
      // Update stock
      setStockItems(stockItems.map(item =>
        item.itemCode === outgoingStock.itemCode
          ? { ...item, currentStock: item.currentStock - outgoingStock.quantity, lastUpdated: new Date().toISOString().split('T')[0] }
          : item
      ));

      // Add transaction
      const transaction: StockTransaction = {
        id: Date.now().toString(),
        itemCode: outgoingStock.itemCode,
        itemName: selectedItem.name,
        type: 'outgoing',
        quantity: outgoingStock.quantity,
        unitPrice: selectedItem.unitPrice,
        totalValue: outgoingStock.quantity * selectedItem.unitPrice,
        customer: outgoingStock.customer,
        reason: outgoingStock.reason,
        date: new Date().toISOString().split('T')[0],
        processedBy: 'Admin User'
      };
      setTransactions([transaction, ...transactions]);

      // Reset form
      setOutgoingStock({
        itemCode: '',
        quantity: 0,
        customer: '',
        reason: ''
      });
      setIsOutgoingDialogOpen(false);
    } else {
      alert('Insufficient stock quantity!');
    }
  };

  const getStockStatus = (item: StockItem) => {
    if (item.currentStock <= item.minStock) return 'low';
    if (item.currentStock >= item.maxStock * 0.8) return 'high';
    return 'normal';
  };

  const getStockBadgeVariant = (status: string) => {
    switch (status) {
      case 'low': return 'destructive';
      case 'high': return 'default';
      default: return 'secondary';
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
                <p className="text-sm text-gray-600">Manage inventory and stock transactions</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={isIncomingDialogOpen} onOpenChange={setIsIncomingDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Incoming Stock
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Incoming Stock</DialogTitle>
                    <DialogDescription>
                      Record new stock arrival from suppliers
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemCode">Item</Label>
                      <Select value={incomingStock.itemCode} onValueChange={(value) => setIncomingStock({...incomingStock, itemCode: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {stockItems.map(item => (
                            <SelectItem key={item.itemCode} value={item.itemCode}>
                              {item.itemCode} - {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={incomingStock.quantity}
                          onChange={(e) => setIncomingStock({...incomingStock, quantity: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unitPrice">Unit Price</Label>
                        <Input
                          id="unitPrice"
                          type="number"
                          value={incomingStock.unitPrice}
                          onChange={(e) => setIncomingStock({...incomingStock, unitPrice: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier</Label>
                      <Input
                        id="supplier"
                        value={incomingStock.supplier}
                        onChange={(e) => setIncomingStock({...incomingStock, supplier: e.target.value})}
                        placeholder="Enter supplier name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason</Label>
                      <Input
                        id="reason"
                        value={incomingStock.reason}
                        onChange={(e) => setIncomingStock({...incomingStock, reason: e.target.value})}
                        placeholder="Enter reason for stock addition"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsIncomingDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleIncomingStock}>
                      Add Stock
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isOutgoingDialogOpen} onOpenChange={setIsOutgoingDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Record Outgoing Stock
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Record Outgoing Stock</DialogTitle>
                    <DialogDescription>
                      Record stock sold or used
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemCode">Item</Label>
                      <Select value={outgoingStock.itemCode} onValueChange={(value) => setOutgoingStock({...outgoingStock, itemCode: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {stockItems.map(item => (
                            <SelectItem key={item.itemCode} value={item.itemCode}>
                              {item.itemCode} - {item.name} (Stock: {item.currentStock})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={outgoingStock.quantity}
                        onChange={(e) => setOutgoingStock({...outgoingStock, quantity: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer">Customer/Reason</Label>
                      <Input
                        id="customer"
                        value={outgoingStock.customer}
                        onChange={(e) => setOutgoingStock({...outgoingStock, customer: e.target.value})}
                        placeholder="Customer name or internal use"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Notes</Label>
                      <Input
                        id="reason"
                        value={outgoingStock.reason}
                        onChange={(e) => setOutgoingStock({...outgoingStock, reason: e.target.value})}
                        placeholder="Additional notes"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsOutgoingDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleOutgoingStock}>
                      Record Outgoing
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stockItems.length}</p>
                  <p className="text-sm text-gray-600">Total Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{lowStockItems.length}</p>
                  <p className="text-sm text-gray-600">Low Stock Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">${totalStockValue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Stock Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{transactions.length}</p>
                  <p className="text-sm text-gray-600">Today's Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList>
            <TabsTrigger value="inventory">Current Inventory</TabsTrigger>
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Current Inventory</CardTitle>
                    <CardDescription>
                      {filteredItems.length} item(s) in stock
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Min/Max</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => {
                      const status = getStockStatus(item);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.itemCode}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.brand}</TableCell>
                          <TableCell>{item.size}</TableCell>
                          <TableCell className="font-semibold">{item.currentStock}</TableCell>
                          <TableCell>{item.minStock}/{item.maxStock}</TableCell>
                          <TableCell>${item.unitPrice}</TableCell>
                          <TableCell>
                            <Badge variant={getStockBadgeVariant(status)}>
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.lastUpdated}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      Recent stock movements
                    </CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Item Code</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Supplier/Customer</TableHead>
                      <TableHead>Processed By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell className="font-medium">{transaction.itemCode}</TableCell>
                        <TableCell>{transaction.itemName}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.type === 'incoming' ? 'default' : 'secondary'}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.quantity}</TableCell>
                        <TableCell>${transaction.totalValue}</TableCell>
                        <TableCell>{transaction.supplier || transaction.customer}</TableCell>
                        <TableCell>{transaction.processedBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Stock Alerts
                </CardTitle>
                <CardDescription>
                  Items requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lowStockItems.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Minimum Required</TableHead>
                        <TableHead>Shortage</TableHead>
                        <TableHead>Supplier</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lowStockItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.itemCode}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-red-600 font-semibold">{item.currentStock}</TableCell>
                          <TableCell>{item.minStock}</TableCell>
                          <TableCell className="text-red-600">{item.minStock - item.currentStock}</TableCell>
                          <TableCell>{item.supplier}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No low stock alerts at the moment</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}