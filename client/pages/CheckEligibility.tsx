import { useState } from "react";
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
  Shield,
  ArrowLeft,
  Search,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface EligibilityFormData {
  customer_id: string;
  loan_amount: string;
  interest_rate: string;
  tenure: string;
}

interface EligibilityResult {
  credit_score: number;
  approved_amount: number;
  approval_status: "approved" | "partial" | "rejected";
  suggested_interest_rate: number;
  monthly_emi: number;
}

export default function CheckEligibility() {
  const [formData, setFormData] = useState<EligibilityFormData>({
    customer_id: "",
    loan_amount: "",
    interest_rate: "",
    tenure: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [error, setError] = useState("");

  const calculateEMI = (principal: number, rate: number, tenure: number) => {
    const monthlyRate = rate / (12 * 100);
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  };

  const getCreditScoreDescription = (score: number) => {
    if (score >= 9) return "Excellent";
    if (score >= 7) return "Good";
    if (score >= 5) return "Fair";
    if (score >= 3) return "Poor";
    return "Very Poor";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Validate form
      if (
        !formData.customer_id ||
        !formData.loan_amount ||
        !formData.interest_rate ||
        !formData.tenure
      ) {
        throw new Error("Please fill in all fields");
      }

      const loanAmount = parseInt(formData.loan_amount);
      const interestRate = parseFloat(formData.interest_rate);
      const tenure = parseInt(formData.tenure);

      if (loanAmount <= 0)
        throw new Error("Loan amount must be greater than 0");
      if (interestRate <= 0 || interestRate > 50)
        throw new Error("Interest rate must be between 0.1% and 50%");
      if (tenure <= 0 || tenure > 360)
        throw new Error("Tenure must be between 1 and 360 months");

      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock eligibility calculation
      const creditScore = Math.floor(Math.random() * 10) + 1; // Random score 1-10
      const maxApprovedAmount = loanAmount * (creditScore / 10);
      const approvedAmount = Math.min(loanAmount, maxApprovedAmount);

      let approvalStatus: "approved" | "partial" | "rejected";
      if (creditScore >= 7 && approvedAmount >= loanAmount) {
        approvalStatus = "approved";
      } else if (creditScore >= 5 && approvedAmount > 0) {
        approvalStatus = "partial";
      } else {
        approvalStatus = "rejected";
      }

      const suggestedRate =
        creditScore >= 8
          ? interestRate
          : interestRate + (10 - creditScore) * 0.5;
      const monthlyEMI = calculateEMI(approvedAmount, suggestedRate, tenure);

      const mockResult: EligibilityResult = {
        credit_score: creditScore,
        approved_amount: Math.round(approvedAmount),
        approval_status: approvalStatus,
        suggested_interest_rate: Math.round(suggestedRate * 100) / 100,
        monthly_emi: monthlyEMI,
      };

      setResult(mockResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eligibility check failed");
    } finally {
      setLoading(false);
    }
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Check Loan Eligibility
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Verify customer loan eligibility with intelligent credit scoring
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Eligibility Check</span>
                </CardTitle>
                <CardDescription>
                  Enter loan details to check customer eligibility and get
                  instant approval status.
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
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="loan_amount"
                      className="flex items-center space-x-1"
                    >
                      <DollarSign className="h-4 w-4" />
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
                      <Label htmlFor="interest_rate">Interest Rate (%)</Label>
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
                      <Label htmlFor="tenure">Tenure (Months)</Label>
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
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Checking Eligibility..." : "Check Eligibility"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {result && (
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Eligibility Result</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Credit Score */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Credit Score
                        </p>
                        <p className="text-2xl font-bold">
                          {result.credit_score}/10
                        </p>
                        <p className="text-sm text-gray-500">
                          {getCreditScoreDescription(result.credit_score)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                            result.credit_score >= 8
                              ? "bg-green-500"
                              : result.credit_score >= 6
                                ? "bg-yellow-500"
                                : result.credit_score >= 4
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                          }`}
                        >
                          {result.credit_score}
                        </div>
                      </div>
                    </div>

                    {/* Approval Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Approval Status
                      </span>
                      <Badge
                        variant={
                          result.approval_status === "approved"
                            ? "default"
                            : result.approval_status === "partial"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-sm px-3 py-1"
                      >
                        {result.approval_status === "approved" && (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        {result.approval_status === "partial" && (
                          <AlertCircle className="h-4 w-4 mr-1" />
                        )}
                        {result.approval_status.charAt(0).toUpperCase() +
                          result.approval_status.slice(1)}
                      </Badge>
                    </div>

                    {/* Approved Amount */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Approved Amount
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        ${result.approved_amount.toLocaleString()}
                      </span>
                    </div>

                    {/* Suggested Interest Rate */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Suggested Interest Rate
                      </span>
                      <span className="font-semibold">
                        {result.suggested_interest_rate}%
                      </span>
                    </div>

                    {/* Monthly EMI */}
                    <div className="flex items-center justify-between p-4 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Monthly EMI
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          ${result.monthly_emi.toLocaleString()}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-primary" />
                    </div>

                    {/* Action Buttons */}
                    {result.approval_status !== "rejected" && (
                      <div className="flex flex-col gap-3 pt-4">
                        <Button asChild className="w-full">
                          <Link to="/create-loan">Proceed to Create Loan</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/check-eligibility">
                            Check Another Customer
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Credit Scoring System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>90-100% EMIs paid on time</span>
                    <Badge variant="default">Score: 10</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>80-89% EMIs paid on time</span>
                    <Badge variant="secondary">Score: 8-9</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>70-79% EMIs paid on time</span>
                    <Badge variant="secondary">Score: 6-7</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>50-69% EMIs paid on time</span>
                    <Badge variant="destructive">Score: 3-5</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>&lt;50% EMIs paid on time</span>
                    <Badge variant="destructive">Score: 0-2</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
