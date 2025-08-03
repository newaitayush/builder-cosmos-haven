import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Calendar,
  IndianRupee,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { formatIndianCurrency, convertToINR } from "@/lib/currency";

interface Loan {
  loan_id: number;
  customer_id: number;
  customer_name: string;
  loan_amount: number;
  tenure: number;
  interest_rate: number;
  monthly_payment: number;
  emis_paid_on_time: number;
  start_date: string;
  end_date: string;
  status: "active" | "closed" | "overdue";
  remaining_months: number;
}

export default function ViewLoans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tenureFilter, setTenureFilter] = useState<string>("all");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  // Mock data generation
  const generateMockLoans = (): Loan[] => {
    const mockLoans: Loan[] = [];
    const customerNames = [
      "John Doe",
      "Jane Smith",
      "Michael Johnson",
      "Sarah Wilson",
      "David Brown",
      "Emma Davis",
      "James Miller",
      "Lisa Anderson",
      "Robert Taylor",
      "Maria Garcia",
    ];

    for (let i = 1; i <= 50; i++) {
      const startDate = new Date(
        2023,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
      );
      const tenure = [12, 24, 36, 48, 60][Math.floor(Math.random() * 5)];
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + tenure);

      const loanAmount = Math.floor(Math.random() * 1000000) + 100000;
      const interestRate = Math.floor(Math.random() * 10) + 8;
      const monthlyRate = interestRate / (12 * 100);
      const monthlyPayment = Math.round(
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
          (Math.pow(1 + monthlyRate, tenure) - 1),
      );

      const monthsElapsed = Math.floor(
        (new Date().getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24 * 30),
      );
      const remainingMonths = Math.max(0, tenure - monthsElapsed);
      const emisPaid = Math.min(monthsElapsed, tenure);

      let status: "active" | "closed" | "overdue" = "active";
      if (remainingMonths === 0) status = "closed";
      else if (Math.random() < 0.1) status = "overdue";

      mockLoans.push({
        loan_id: i,
        customer_id: Math.floor(Math.random() * 100) + 1,
        customer_name:
          customerNames[Math.floor(Math.random() * customerNames.length)],
        loan_amount: loanAmount,
        tenure,
        interest_rate: interestRate,
        monthly_payment: monthlyPayment,
        emis_paid_on_time: Math.floor(emisPaid * (0.7 + Math.random() * 0.3)),
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        status,
        remaining_months: remainingMonths,
      });
    }

    return mockLoans.sort(
      (a, b) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
    );
  };

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData = generateMockLoans();
      setLoans(mockData);
      setFilteredLoans(mockData);
      setLoading(false);
    };

    fetchLoans();
  }, []);

  useEffect(() => {
    let filtered = loans;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (loan) =>
          loan.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loan.loan_id.toString().includes(searchTerm) ||
          loan.customer_id.toString().includes(searchTerm),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((loan) => loan.status === statusFilter);
    }

    // Tenure filter
    if (tenureFilter !== "all") {
      const tenureValue = parseInt(tenureFilter);
      filtered = filtered.filter((loan) => loan.tenure === tenureValue);
    }

    setFilteredLoans(filtered);
  }, [loans, searchTerm, statusFilter, tenureFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "closed":
        return "secondary";
      case "overdue":
        return "destructive";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount: number) => {
    return formatIndianCurrency(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateProgress = (loan: Loan) => {
    const totalMonths = loan.tenure;
    const completedMonths = totalMonths - loan.remaining_months;
    return Math.round((completedMonths / totalMonths) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <header className="border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                CreditFlow
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild>
                <Link to="/create-loan">Create New Loan</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Loan Management
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            View and manage all customer loans with detailed information
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Loans
                  </p>
                  <p className="text-2xl font-bold">{loans.length}</p>
                </div>
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Active Loans
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {loans.filter((loan) => loan.status === "active").length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Overdue
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {loans.filter((loan) => loan.status === "overdue").length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Disbursed
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      loans.reduce((sum, loan) => sum + loan.loan_amount, 0),
                    )}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name, loan ID, customer ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tenure</Label>
                <Select value={tenureFilter} onValueChange={setTenureFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All tenures" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tenures</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="48">48 months</SelectItem>
                    <SelectItem value="60">60 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setTenureFilter("all");
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loans Table */}
        <Card>
          <CardHeader>
            <CardTitle>Loans ({filteredLoans.length})</CardTitle>
            <CardDescription>
              Complete list of customer loans with payment details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <p>Loading loans...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loan ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Monthly EMI</TableHead>
                      <TableHead>Tenure</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLoans.map((loan) => (
                      <TableRow key={loan.loan_id}>
                        <TableCell className="font-medium">
                          #{loan.loan_id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{loan.customer_name}</p>
                            <p className="text-sm text-gray-500">
                              ID: {loan.customer_id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(loan.loan_amount)}
                        </TableCell>
                        <TableCell className="font-semibold text-primary">
                          {formatCurrency(loan.monthly_payment)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{loan.tenure} months</p>
                            <p className="text-sm text-gray-500">
                              {loan.interest_rate}% APR
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{calculateProgress(loan)}%</span>
                              <span>{loan.remaining_months}m left</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${calculateProgress(loan)}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(loan.status)}>
                            {loan.status.charAt(0).toUpperCase() +
                              loan.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedLoan(loan)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Loan Details - #{loan.loan_id}
                                </DialogTitle>
                                <DialogDescription>
                                  Complete loan information and payment history
                                </DialogDescription>
                              </DialogHeader>
                              {selectedLoan && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                      <div>
                                        <p className="text-sm text-gray-600">
                                          Customer
                                        </p>
                                        <p className="font-semibold">
                                          {selectedLoan.customer_name}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">
                                          Loan Amount
                                        </p>
                                        <p className="font-semibold">
                                          {formatCurrency(
                                            selectedLoan.loan_amount,
                                          )}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">
                                          Monthly EMI
                                        </p>
                                        <p className="font-semibold text-primary">
                                          {formatCurrency(
                                            selectedLoan.monthly_payment,
                                          )}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">
                                          Interest Rate
                                        </p>
                                        <p className="font-semibold">
                                          {selectedLoan.interest_rate}%
                                        </p>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <p className="text-sm text-gray-600">
                                          Start Date
                                        </p>
                                        <p className="font-semibold">
                                          {formatDate(selectedLoan.start_date)}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">
                                          End Date
                                        </p>
                                        <p className="font-semibold">
                                          {formatDate(selectedLoan.end_date)}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">
                                          EMIs Paid On Time
                                        </p>
                                        <p className="font-semibold">
                                          {selectedLoan.emis_paid_on_time} /{" "}
                                          {selectedLoan.tenure -
                                            selectedLoan.remaining_months}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">
                                          Status
                                        </p>
                                        <Badge
                                          variant={getStatusColor(
                                            selectedLoan.status,
                                          )}
                                        >
                                          {selectedLoan.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            selectedLoan.status.slice(1)}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-2">
                                      Payment Progress
                                    </h4>
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                                      <div className="flex justify-between mb-2">
                                        <span>
                                          Progress:{" "}
                                          {calculateProgress(selectedLoan)}%
                                        </span>
                                        <span>
                                          {selectedLoan.remaining_months} months
                                          remaining
                                        </span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                          className="bg-primary h-3 rounded-full"
                                          style={{
                                            width: `${calculateProgress(selectedLoan)}%`,
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredLoans.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No loans found matching your criteria.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
