import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, ArrowLeft, User, Phone, DollarSign, Calendar } from 'lucide-react';

interface CustomerFormData {
  first_name: string;
  last_name: string;
  age: string;
  phone_number: string;
  monthly_salary: string;
}

export default function Register() {
  const [formData, setFormData] = useState<CustomerFormData>({
    first_name: '',
    last_name: '',
    age: '',
    phone_number: '',
    monthly_salary: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const calculateApprovedLimit = (salary: number) => {
    return salary * 36;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.first_name || !formData.last_name || !formData.age || !formData.phone_number || !formData.monthly_salary) {
        throw new Error('Please fill in all fields');
      }

      const age = parseInt(formData.age);
      const salary = parseInt(formData.monthly_salary);

      if (age < 18 || age > 100) {
        throw new Error('Age must be between 18 and 100');
      }

      if (salary <= 0) {
        throw new Error('Monthly salary must be greater than 0');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const approvedLimit = calculateApprovedLimit(salary);
      
      // Here you would make the actual API call to POST /register
      console.log('Registering customer:', {
        ...formData,
        age,
        monthly_salary: salary,
        approved_limit: approvedLimit
      });

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const approvedLimit = calculateApprovedLimit(parseInt(formData.monthly_salary));
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <header className="border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">CreditFlow</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-green-800 dark:text-green-200">
                  Customer Registered Successfully!
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-300">
                  Welcome to CreditFlow. Your account has been created.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Customer Name</p>
                    <p className="font-semibold">{formData.first_name} {formData.last_name}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Age</p>
                    <p className="font-semibold">{formData.age} years</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="font-semibold">{formData.phone_number}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Salary</p>
                    <p className="font-semibold">${parseInt(formData.monthly_salary).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="p-6 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Approved Credit Limit</p>
                      <p className="text-3xl font-bold text-primary">
                        ${approvedLimit.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Calculated as 36x monthly salary
                      </p>
                    </div>
                    <DollarSign className="h-12 w-12 text-primary" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button asChild className="flex-1">
                    <Link to="/check-eligibility">Check Loan Eligibility</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/register">Register Another Customer</Link>
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
              <span className="text-2xl font-bold text-gray-900 dark:text-white">CreditFlow</span>
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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Register New Customer
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Add a new customer to the system with automatic credit limit calculation
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Customer Information</span>
              </CardTitle>
              <CardDescription>
                Enter the customer's details below. The approved credit limit will be automatically calculated.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder="Enter first name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      placeholder="Enter last name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Age</span>
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Enter age"
                      min="18"
                      max="100"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number" className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>Phone Number</span>
                    </Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly_salary" className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>Monthly Salary</span>
                  </Label>
                  <Input
                    id="monthly_salary"
                    name="monthly_salary"
                    type="number"
                    placeholder="Enter monthly salary"
                    min="1"
                    value={formData.monthly_salary}
                    onChange={handleInputChange}
                    required
                  />
                  {formData.monthly_salary && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Approved Credit Limit: ${calculateApprovedLimit(parseInt(formData.monthly_salary) || 0).toLocaleString()}
                    </p>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Registering Customer...' : 'Register Customer'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
