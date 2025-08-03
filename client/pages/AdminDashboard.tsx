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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  Shield,
  ArrowLeft,
  TrendingUp,
  Users,
  CreditCard,
  IndianRupee,
  AlertCircle,
  Target,
} from "lucide-react";
import {
  formatIndianCurrency,
  formatIndianNumber,
  convertToINR,
} from "@/lib/currency";

interface DashboardStats {
  totalCustomers: number;
  totalLoans: number;
  totalDisbursed: number;
  averageCreditScore: number;
  approvalRate: number;
  overdueLoans: number;
}

interface ApprovalData {
  month: string;
  approved: number;
  rejected: number;
  total: number;
}

interface CreditScoreData {
  range: string;
  count: number;
  percentage: number;
}

interface SalaryBandData {
  range: string;
  customers: number;
  avgLoanAmount: number;
  approvalRate: number;
}

interface CustomerSegmentData {
  segment: string;
  count: number;
  value: number;
  color: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [approvalData, setApprovalData] = useState<ApprovalData[]>([]);
  const [creditScoreData, setCreditScoreData] = useState<CreditScoreData[]>([]);
  const [salaryBandData, setSalaryBandData] = useState<SalaryBandData[]>([]);
  const [customerSegments, setCustomerSegments] = useState<
    CustomerSegmentData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("6m");

  const generateMockData = () => {
    // Dashboard Stats
    const mockStats: DashboardStats = {
      totalCustomers: 28470,
      totalLoans: 12340,
      totalDisbursed: convertToINR(45600000),
      averageCreditScore: 7.2,
      approvalRate: 78.5,
      overdueLoans: 450,
    };

    // Approval/Rejection Data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const mockApprovalData: ApprovalData[] = months.map((month) => {
      const total = Math.floor(Math.random() * 200) + 100;
      const approved = Math.floor(total * (0.7 + Math.random() * 0.2));
      return {
        month,
        approved,
        rejected: total - approved,
        total,
      };
    });

    // Credit Score Distribution
    const mockCreditScoreData: CreditScoreData[] = [
      { range: "9-10", count: 285, percentage: 32 },
      { range: "7-8", count: 412, percentage: 45 },
      { range: "5-6", count: 156, percentage: 17 },
      { range: "3-4", count: 43, percentage: 5 },
      { range: "0-2", count: 12, percentage: 1 },
    ];

    // Salary Band Analysis
    const mockSalaryBandData: SalaryBandData[] = [
      {
        range: "₹15L-30L",
        customers: 432,
        avgLoanAmount: convertToINR(180000),
        approvalRate: 65,
      },
      {
        range: "₹30L-50L",
        customers: 678,
        avgLoanAmount: convertToINR(320000),
        approvalRate: 75,
      },
      {
        range: "₹50L-70L",
        customers: 543,
        avgLoanAmount: convertToINR(450000),
        approvalRate: 82,
      },
      {
        range: "₹70L-100L",
        customers: 387,
        avgLoanAmount: convertToINR(620000),
        approvalRate: 88,
      },
      {
        range: "₹100L+",
        customers: 234,
        avgLoanAmount: convertToINR(850000),
        approvalRate: 92,
      },
    ];

    // Customer Segments
    const mockCustomerSegments: CustomerSegmentData[] = [
      { segment: "Prime", count: 1024, value: 36, color: "#22c55e" },
      { segment: "Near Prime", count: 854, value: 30, color: "#3b82f6" },
      { segment: "Subprime", count: 612, value: 21, color: "#f59e0b" },
      { segment: "Deep Subprime", count: 357, value: 13, color: "#ef4444" },
    ];

    return {
      stats: mockStats,
      approvalData: mockApprovalData,
      creditScoreData: mockCreditScoreData,
      salaryBandData: mockSalaryBandData,
      customerSegments: mockCustomerSegments,
    };
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockData = generateMockData();
      setStats(mockData.stats);
      setApprovalData(mockData.approvalData);
      setCreditScoreData(mockData.creditScoreData);
      setSalaryBandData(mockData.salaryBandData);
      setCustomerSegments(mockData.customerSegments);
      setLoading(false);
    };

    fetchDashboardData();
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return formatIndianCurrency(amount);
  };

  const chartConfig = {
    approved: {
      label: "Approved",
      color: "#22c55e",
    },
    rejected: {
      label: "Rejected",
      color: "#ef4444",
    },
    customers: {
      label: "Customers",
      color: "#3b82f6",
    },
    avgLoanAmount: {
      label: "Avg Loan Amount",
      color: "#8b5cf6",
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

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
              <Badge variant="secondary" className="ml-2">
                Admin
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
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
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Comprehensive analytics and insights for loan portfolio management
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Customers
                  </p>
                  <p className="text-3xl font-bold">
                    {stats?.totalCustomers.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    ↑ 12% from last month
                  </p>
                </div>
                <Users className="h-8 w-8 text-primary" />
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
                  <p className="text-3xl font-bold">
                    {stats?.totalLoans.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    ↑ 8% from last month
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-accent" />
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
                  <p className="text-3xl font-bold">
                    {formatIndianNumber(stats?.totalDisbursed || 0)}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    ↑ 15% from last month
                  </p>
                </div>
                <IndianRupee className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Approval Rate
                  </p>
                  <p className="text-3xl font-bold">{stats?.approvalRate}%</p>
                  <p className="text-sm text-red-600 mt-1">
                    ↓ 2% from last month
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Approval vs Rejection Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Approval vs Rejection Trends</CardTitle>
              <CardDescription>
                Monthly loan approval and rejection statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <BarChart data={approvalData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="approved"
                    fill="var(--color-approved)"
                    radius={4}
                  />
                  <Bar
                    dataKey="rejected"
                    fill="var(--color-rejected)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Credit Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Credit Score Distribution</CardTitle>
              <CardDescription>
                Customer distribution across credit score ranges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <BarChart data={creditScoreData} layout="horizontal">
                  <XAxis type="number" />
                  <YAxis dataKey="range" type="category" width={50} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [`${value} customers`, "Count"]}
                      />
                    }
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Customer Segments */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
              <CardDescription>
                Distribution by credit worthiness segments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ segment, value }) => `${segment} (${value}%)`}
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                              <p className="font-semibold">{data.segment}</p>
                              <p className="text-sm">
                                Count: {data.count.toLocaleString()}
                              </p>
                              <p className="text-sm">
                                Percentage: {data.value}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Salary Band Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Salary Band Analysis</CardTitle>
              <CardDescription>
                Customer distribution and loan amounts by salary range
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <LineChart data={salaryBandData}>
                  <XAxis
                    dataKey="range"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                            <p className="font-semibold">{label}</p>
                            <p className="text-sm">
                              Customers: {payload[0]?.value?.toLocaleString()}
                            </p>
                            <p className="text-sm">
                              Avg Loan:{" "}
                              {formatCurrency(Number(payload[1]?.value) || 0)}
                            </p>
                            <p className="text-sm">
                              Approval Rate: {payload[2]?.value}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="customers"
                    stroke="#3b82f6"
                    strokeWidth={3}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgLoanAmount"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="approvalRate"
                    stroke="#22c55e"
                    strokeWidth={3}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Risk Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
                <AlertCircle className="h-5 w-5" />
                <span>Risk Indicators</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Overdue Loans</span>
                  <Badge variant="destructive">{stats?.overdueLoans}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Avg Credit Score</span>
                  <Badge variant="default">
                    {stats?.averageCreditScore}/10
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>High Risk Customers</span>
                  <Badge variant="secondary">127</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Portfolio Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Performing Loans</span>
                  <span className="font-semibold text-green-600">96.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>NPL Ratio</span>
                  <span className="font-semibold">3.8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Collection Efficiency</span>
                  <span className="font-semibold text-green-600">94.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/loans">View All Loans</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/register">Add Customer</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/import">Import Data</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
