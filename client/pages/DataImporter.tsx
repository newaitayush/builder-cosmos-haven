import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, ArrowLeft, Upload, FileText, CheckCircle, AlertTriangle, Download } from 'lucide-react';

interface CustomerDataRow {
  first_name: string;
  last_name: string;
  age: number;
  phone_number: string;
  monthly_salary: number;
}

interface LoanDataRow {
  customer_id: number;
  loan_amount: number;
  tenure: number;
  interest_rate: number;
  emis_paid_on_time: number;
  start_date: string;
}

interface ImportResult {
  success: boolean;
  processed: number;
  errors: string[];
}

export default function DataImporter() {
  const [customerData, setCustomerData] = useState<CustomerDataRow[]>([]);
  const [loanData, setLoanData] = useState<LoanDataRow[]>([]);
  const [customerFile, setCustomerFile] = useState<File | null>(null);
  const [loanFile, setLoanFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('customers');
  
  const customerFileRef = useRef<HTMLInputElement>(null);
  const loanFileRef = useRef<HTMLInputElement>(null);

  // Mock CSV parsing function (in real app, use a proper CSV parser like PapaParse)
  const parseCSV = (text: string): any[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      return row;
    });
  };

  const handleFileUpload = async (file: File, type: 'customer' | 'loan') => {
    if (!file) return;

    const text = await file.text();
    
    try {
      const data = parseCSV(text);
      
      if (type === 'customer') {
        // Validate customer data structure
        const customerRows: CustomerDataRow[] = data.map(row => ({
          first_name: row.first_name || row.firstName || '',
          last_name: row.last_name || row.lastName || '',
          age: parseInt(row.age) || 0,
          phone_number: row.phone_number || row.phoneNumber || row.phone || '',
          monthly_salary: parseInt(row.monthly_salary) || parseInt(row.monthlySalary) || parseInt(row.salary) || 0
        }));
        
        setCustomerData(customerRows);
        setCustomerFile(file);
      } else {
        // Validate loan data structure
        const loanRows: LoanDataRow[] = data.map(row => ({
          customer_id: parseInt(row.customer_id) || parseInt(row.customerId) || 0,
          loan_amount: parseInt(row.loan_amount) || parseInt(row.loanAmount) || parseInt(row.amount) || 0,
          tenure: parseInt(row.tenure) || parseInt(row.term) || 0,
          interest_rate: parseFloat(row.interest_rate) || parseFloat(row.interestRate) || parseFloat(row.rate) || 0,
          emis_paid_on_time: parseInt(row.emis_paid_on_time) || parseInt(row.emisPaidOnTime) || parseInt(row.paid_emis) || 0,
          start_date: row.start_date || row.startDate || row.date || ''
        }));
        
        setLoanData(loanRows);
        setLoanFile(file);
      }
      
      setShowPreview(true);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing file. Please check the format and try again.');
    }
  };

  const validateData = (type: 'customer' | 'loan'): string[] => {
    const errors: string[] = [];
    
    if (type === 'customer') {
      customerData.forEach((row, index) => {
        if (!row.first_name) errors.push(`Row ${index + 1}: Missing first name`);
        if (!row.last_name) errors.push(`Row ${index + 1}: Missing last name`);
        if (row.age < 18 || row.age > 100) errors.push(`Row ${index + 1}: Invalid age (${row.age})`);
        if (!row.phone_number) errors.push(`Row ${index + 1}: Missing phone number`);
        if (row.monthly_salary <= 0) errors.push(`Row ${index + 1}: Invalid salary (${row.monthly_salary})`);
      });
    } else {
      loanData.forEach((row, index) => {
        if (row.customer_id <= 0) errors.push(`Row ${index + 1}: Invalid customer ID`);
        if (row.loan_amount <= 0) errors.push(`Row ${index + 1}: Invalid loan amount`);
        if (row.tenure <= 0 || row.tenure > 360) errors.push(`Row ${index + 1}: Invalid tenure`);
        if (row.interest_rate <= 0 || row.interest_rate > 50) errors.push(`Row ${index + 1}: Invalid interest rate`);
        if (!row.start_date) errors.push(`Row ${index + 1}: Missing start date`);
      });
    }
    
    return errors;
  };

  const handleImport = async (type: 'customer' | 'loan') => {
    setLoading(true);
    
    try {
      const errors = validateData(type);
      
      if (errors.length > 0) {
        setImportResult({
          success: false,
          processed: 0,
          errors: errors.slice(0, 10) // Show first 10 errors
        });
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const dataToImport = type === 'customer' ? customerData : loanData;
      
      // Here you would make actual API calls to import the data
      console.log(`Importing ${type} data:`, dataToImport);
      
      setImportResult({
        success: true,
        processed: dataToImport.length,
        errors: []
      });
      
    } catch (error) {
      setImportResult({
        success: false,
        processed: 0,
        errors: ['Failed to import data. Please try again.']
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleFile = (type: 'customer' | 'loan') => {
    let csvContent = '';
    
    if (type === 'customer') {
      csvContent = `first_name,last_name,age,phone_number,monthly_salary
John,Doe,30,+1234567890,75000
Jane,Smith,28,+1234567891,80000
Michael,Johnson,35,+1234567892,65000`;
    } else {
      csvContent = `customer_id,loan_amount,tenure,interest_rate,emis_paid_on_time,start_date
1,500000,24,12.5,18,2023-01-15
2,750000,36,11.8,24,2023-02-20
3,300000,12,13.2,8,2023-03-10`;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample_${type}_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <header className="border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">CreditFlow</span>
              <Badge variant="secondary" className="ml-2">Data Importer</Badge>
            </div>
            <Button asChild variant="ghost">
              <Link to="/admin" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Admin</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Excel Data Importer
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Bulk import customer and loan data from Excel/CSV files
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customers">Customer Data</TabsTrigger>
              <TabsTrigger value="loans">Loan Data</TabsTrigger>
            </TabsList>

            <TabsContent value="customers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Import Customer Data</span>
                  </CardTitle>
                  <CardDescription>
                    Upload a CSV file containing customer information (first_name, last_name, age, phone_number, monthly_salary)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => customerFileRef.current?.click()}
                      variant="outline"
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                    <Button
                      onClick={() => downloadSampleFile('customer')}
                      variant="ghost"
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Sample
                    </Button>
                  </div>
                  
                  <input
                    ref={customerFileRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'customer')}
                    className="hidden"
                  />
                  
                  {customerFile && (
                    <Alert>
                      <FileText className="h-4 w-4" />
                      <AlertDescription>
                        File loaded: {customerFile.name} ({customerData.length} records)
                      </AlertDescription>
                    </Alert>
                  )}

                  {customerData.length > 0 && (
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                        <h4 className="font-semibold mb-2">Preview (First 5 records)</h4>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>First Name</TableHead>
                                <TableHead>Last Name</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Salary</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {customerData.slice(0, 5).map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell>{row.first_name}</TableCell>
                                  <TableCell>{row.last_name}</TableCell>
                                  <TableCell>{row.age}</TableCell>
                                  <TableCell>{row.phone_number}</TableCell>
                                  <TableCell>${row.monthly_salary.toLocaleString()}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleImport('customer')} 
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? 'Importing...' : `Import ${customerData.length} Customer Records`}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="loans" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Import Loan Data</span>
                  </CardTitle>
                  <CardDescription>
                    Upload a CSV file containing loan information (customer_id, loan_amount, tenure, interest_rate, emis_paid_on_time, start_date)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => loanFileRef.current?.click()}
                      variant="outline"
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                    <Button
                      onClick={() => downloadSampleFile('loan')}
                      variant="ghost"
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Sample
                    </Button>
                  </div>
                  
                  <input
                    ref={loanFileRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'loan')}
                    className="hidden"
                  />
                  
                  {loanFile && (
                    <Alert>
                      <FileText className="h-4 w-4" />
                      <AlertDescription>
                        File loaded: {loanFile.name} ({loanData.length} records)
                      </AlertDescription>
                    </Alert>
                  )}

                  {loanData.length > 0 && (
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                        <h4 className="font-semibold mb-2">Preview (First 5 records)</h4>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Customer ID</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Tenure</TableHead>
                                <TableHead>Rate</TableHead>
                                <TableHead>EMIs Paid</TableHead>
                                <TableHead>Start Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {loanData.slice(0, 5).map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell>{row.customer_id}</TableCell>
                                  <TableCell>${row.loan_amount.toLocaleString()}</TableCell>
                                  <TableCell>{row.tenure} months</TableCell>
                                  <TableCell>{row.interest_rate}%</TableCell>
                                  <TableCell>{row.emis_paid_on_time}</TableCell>
                                  <TableCell>{row.start_date}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleImport('loan')} 
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? 'Importing...' : `Import ${loanData.length} Loan Records`}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Import Guidelines */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Import Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Customer Data Format</h4>
                  <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• first_name: Text (required)</li>
                    <li>• last_name: Text (required)</li>
                    <li>• age: Number 18-100 (required)</li>
                    <li>• phone_number: Text (required)</li>
                    <li>• monthly_salary: Number &gt; 0 (required)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Loan Data Format</h4>
                  <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• customer_id: Number &gt; 0 (required)</li>
                    <li>• loan_amount: Number &gt; 0 (required)</li>
                    <li>• tenure: Number 1-360 months (required)</li>
                    <li>• interest_rate: Number 0.1-50% (required)</li>
                    <li>• emis_paid_on_time: Number ≥ 0</li>
                    <li>• start_date: YYYY-MM-DD format (required)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Import Result Dialog */}
      <Dialog open={!!importResult} onOpenChange={() => setImportResult(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {importResult?.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <span>Import {importResult?.success ? 'Successful' : 'Failed'}</span>
            </DialogTitle>
            <DialogDescription>
              {importResult?.success 
                ? `Successfully imported ${importResult.processed} records.`
                : 'Import failed due to validation errors.'
              }
            </DialogDescription>
          </DialogHeader>
          
          {importResult?.errors && importResult.errors.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <p className="text-sm font-semibold">Errors:</p>
              {importResult.errors.map((error, index) => (
                <p key={index} className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              ))}
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <Button onClick={() => setImportResult(null)} className="flex-1">
              Close
            </Button>
            {importResult?.success && (
              <Button asChild variant="outline" className="flex-1">
                <Link to="/loans">View Imported Data</Link>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
