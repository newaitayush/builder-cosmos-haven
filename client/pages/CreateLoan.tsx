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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Shield,
  ArrowLeft,
  CreditCard,
  IndianRupee,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { formatIndianCurrency, convertToINR } from "@/lib/currency";

interface LoanFormData {
  customer_id: string;
  loan_amount: string;
  tenure: string;
  interest_rate: string;
}

interface CustomerInfo {
  customer_id: number;
  first_name: string;
  last_name: string;
  monthly_salary: number;
  approved_limit: number;
  existing_loans: number;
}

interface LoanCalculation {
  monthly_emi: number;
  total_interest: number;
  total_amount: number;
  debt_to_income_ratio: number;
}

export default function CreateLoan() {
  const [formData, setFormData] = useState<LoanFormData>({
    customer_id: "",
    loan_amount: "",
    tenure: "",
    interest_rate: "",
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [loanCalculation, setLoanCalculation] =
    useState<LoanCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loanCreated, setLoanCreated] = useState(false);

  const calculateEMI = (
    principal: number,
    rate: number,
    tenure: number,
  ): LoanCalculation => {
    const monthlyRate = rate / (12 * 100);
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);

    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - principal;
    const debtToIncomeRatio = customerInfo
      ? (emi / customerInfo.monthly_salary) * 100
      : 0;

    return {
      monthly_emi: Math.round(emi),
      total_interest: Math.round(totalInterest),
      total_amount: Math.round(totalAmount),
      debt_to_income_ratio: Math.round(debtToIncomeRatio * 100) / 100,
    };
  };

  const fetchCustomerInfo = async (customerId: string) => {
    if (!customerId) {
      setCustomerInfo(null);
      return;
    }

    setCustomerLoading(true);
    try {
      // Simulate API call to fetch customer info
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock customer data
      const mockCustomer: CustomerInfo = {
        customer_id: parseInt(customerId),
        first_name: "Rajesh",
        last_name: "Kumar",
        monthly_salary: 75000, // Already in INR
        approved_limit: 2700000, // 75000 * 36
        existing_loans: Math.floor(Math.random() * 3),
      };

      setCustomerInfo(mockCustomer);
    } catch (err) {
      setError("Failed to fetch customer information");
      setCustomerInfo(null);
    } finally {
      setCustomerLoading(false);
    }
  };

  useEffect(() => {
    if (formData.customer_id && formData.customer_id.length >= 3) {
      fetchCustomerInfo(formData.customer_id);
    } else {
      setCustomerInfo(null);
    }
  }, [formData.customer_id]);

  useEffect(() => {
    if (formData.loan_amount && formData.interest_rate && formData.tenure) {
      const principal = parseInt(formData.loan_amount);
      const rate = parseFloat(formData.interest_rate);
      const months = parseInt(formData.tenure);

      if (principal > 0 && rate > 0 && months > 0) {
        const calculation = calculateEMI(principal, rate, months);
        setLoanCalculation(calculation);
      } else {
        setLoanCalculation(null);
      }
    } else {
      setLoanCalculation(null);
    }
  }, [
    formData.loan_amount,
    formData.interest_rate,
    formData.tenure,
    customerInfo,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateLoan = (): string | null => {
    if (!customerInfo) return "Customer information not loaded";

    const loanAmount = parseInt(formData.loan_amount);
    const availableLimit =
      customerInfo.approved_limit - customerInfo.existing_loans * 500000; // Assuming avg existing loan of 500k

    if (loanAmount > availableLimit) {
      return `Loan amount exceeds available limit of ${formatIndianCurrency(availableLimit)}`;
    }

    if (loanCalculation && loanCalculation.debt_to_income_ratio > 50) {
      return "Debt-to-income ratio exceeds 50% - loan may be risky";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (
      !formData.customer_id ||
      !formData.loan_amount ||
      !formData.interest_rate ||
      !formData.tenure
    ) {
      setError("Please fill in all fields");
      return;
    }

    const validationError = validateLoan();
    if (validationError) {
      setError(validationError);
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmLoanCreation = async () => {
    setLoading(true);
    setShowConfirmModal(false);

    try {
      // Simulate API call to create loan
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would make the actual API call to POST /create-loan
      console.log("Creating loan:", {
        customer_id: parseInt(formData.customer_id),
        loan_amount: parseInt(formData.loan_amount),
        tenure: parseInt(formData.tenure),
        interest_rate: parseFloat(formData.interest_rate),
        monthly_payment: loanCalculation?.monthly_emi,
      });

      setLoanCreated(true);
    } catch (err) {
      setError("Failed to create loan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loanCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <header className="border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                CreditFlow
              </span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-green-800 dark:text-green-200">
                  Loan Created Successfully!
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-300">
                  The loan has been processed and added to the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Customer
                    </p>
                    <p className="font-semibold">
                      {customerInfo?.first_name} {customerInfo?.last_name}
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Loan Amount
                    </p>
                    <p className="font-semibold">
                      {formatIndianCurrency(parseInt(formData.loan_amount))}
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tenure
                    </p>
                    <p className="font-semibold">{formData.tenure} months</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Interest Rate
                    </p>
                    <p className="font-semibold">{formData.interest_rate}%</p>
                  </div>
                </div>

                <div className="p-6 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Monthly EMI
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {formatIndianCurrency(
                          loanCalculation?.monthly_emi || 0,
                        )}
                      </p>
                    </div>
                    <CreditCard className="h-12 w-12 text-primary" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button asChild className="flex-1">
                    <Link to="/loans">View All Loans</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/create-loan">Create Another Loan</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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
            </div>
            <Button asChild variant="ghost">
              <Link to="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Create New Loan
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Process loan applications with automatic EMI calculation and
              validation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Loan Application</span>
                  </CardTitle>
                  <CardDescription>
                    Enter loan details to process the application and calculate
                    EMI automatically.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="customer_id">Customer ID</Label>
                      <Input
                        id="customer_id"
                        name="customer_id"
                        type="text"
                        placeholder="Enter customer ID"
                        value={formData.customer_id}
                        onChange={handleInputChange}
                        required
                      />
                      {customerLoading && (
                        <p className="text-sm text-gray-500">
                          Loading customer information...
                        </p>
                      )}
                    </div>

                    {customerInfo && (
                      <Card className="bg-gray-50 dark:bg-gray-800">
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">
                                Customer Name
                              </p>
                              <p className="font-semibold">
                                {customerInfo.first_name}{" "}
                                {customerInfo.last_name}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">
                                Monthly Salary
                              </p>
                              <p className="font-semibold">
                                {formatIndianCurrency(
                                  customerInfo.monthly_salary,
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">
                                Credit Limit
                              </p>
                              <p className="font-semibold">
                                {formatIndianCurrency(
                                  customerInfo.approved_limit,
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">
                                Existing Loans
                              </p>
                              <p className="font-semibold">
                                {customerInfo.existing_loans}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="space-y-2">
                      <Label
                        htmlFor="loan_amount"
                        className="flex items-center space-x-1"
                      >
                        <IndianRupee className="h-4 w-4" />
                        <span>Loan Amount</span>
                      </Label>
                      <Input
                        id="loan_amount"
                        name="loan_amount"
                        type="number"
                        placeholder="Enter loan amount"
                        min="1"
                        value={formData.loan_amount}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="interest_rate"
                          className="flex items-center space-x-1"
                        >
                          <TrendingUp className="h-4 w-4" />
                          <span>Interest Rate (%)</span>
                        </Label>
                        <Input
                          id="interest_rate"
                          name="interest_rate"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 12.5"
                          min="0.1"
                          max="50"
                          value={formData.interest_rate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="tenure"
                          className="flex items-center space-x-1"
                        >
                          <Calendar className="h-4 w-4" />
                          <span>Tenure (Months)</span>
                        </Label>
                        <Input
                          id="tenure"
                          name="tenure"
                          type="number"
                          placeholder="e.g., 24"
                          min="1"
                          max="360"
                          value={formData.tenure}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <Alert
                        variant={
                          error.includes("exceeds") || error.includes("risky")
                            ? "default"
                            : "destructive"
                        }
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || !customerInfo}
                    >
                      {loading ? "Creating Loan..." : "Create Loan"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Calculations */}
            <div className="space-y-6">
              {loanCalculation && (
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Loan Calculation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Monthly EMI
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        ${loanCalculation.monthly_emi.toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Total Interest
                        </span>
                        <span className="font-semibold">
                          {formatIndianCurrency(loanCalculation.total_interest)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Total Amount
                        </span>
                        <span className="font-semibold">
                          {formatIndianCurrency(loanCalculation.total_amount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Debt-to-Income
                        </span>
                        <Badge
                          variant={
                            loanCalculation.debt_to_income_ratio > 50
                              ? "destructive"
                              : loanCalculation.debt_to_income_ratio > 30
                                ? "secondary"
                                : "default"
                          }
                        >
                          {loanCalculation.debt_to_income_ratio}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">EMI Formula</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="text-gray-600 dark:text-gray-400">
                    EMI = (P × R × (1 + R)^N) / ((1 + R)^N - 1)
                  </p>
                  <div className="space-y-1 text-xs">
                    <p>P = Principal loan amount</p>
                    <p>R = Monthly interest rate</p>
                    <p>N = Number of months</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Loan Creation</DialogTitle>
            <DialogDescription>
              Please review the loan details before confirming.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Customer</p>
                <p className="font-semibold">
                  {customerInfo?.first_name} {customerInfo?.last_name}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Loan Amount</p>
                <p className="font-semibold">
                  ${parseInt(formData.loan_amount || "0").toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Monthly EMI</p>
                <p className="font-semibold text-primary">
                  {formatIndianCurrency(loanCalculation?.monthly_emi || 0)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Tenure</p>
                <p className="font-semibold">{formData.tenure} months</p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={confirmLoanCreation} className="flex-1">
                Confirm & Create Loan
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
