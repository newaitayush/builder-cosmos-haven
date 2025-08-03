import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CreditCard, Users, DollarSign, TrendingUp, Shield, Clock, User, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function Index() {
  const { isAuthenticated, user, logout } = useAuth();
  const [stats] = useState({
    totalCustomers: 2847,
    activeLoans: 1234,
    approvalRate: 78,
    totalDisbursed: 45600000,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">CreditFlow</span>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/register" className="text-gray-600 hover:text-primary dark:text-gray-300">Register Customer</Link>
                <Link to="/check-eligibility" className="text-gray-600 hover:text-primary dark:text-gray-300">Check Eligibility</Link>
                {isAuthenticated && (
                  <>
                    <Link to="/loans" className="text-gray-600 hover:text-primary dark:text-gray-300">Loans</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="text-gray-600 hover:text-primary dark:text-gray-300">Admin</Link>
                    )}
                  </>
                )}
              </nav>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{user?.username}</span>
                      <Badge variant="secondary" className="ml-1 text-xs">{user?.role}</Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={logout} className="flex items-center space-x-2">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild size="sm">
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Smart Credit Approval System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Streamline your lending process with intelligent credit scoring, automated approvals, 
            and comprehensive loan management. Make informed decisions faster than ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link to="/register">Register New Customer</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
              <Link to="/check-eligibility">Check Loan Eligibility</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader className="pb-2">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold">{stats.totalCustomers.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Total Customers</CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CreditCard className="h-8 w-8 text-accent mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold">{stats.activeLoans.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Active Loans</CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader className="pb-2">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold">{stats.approvalRate}%</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Approval Rate</CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader className="pb-2">
                <DollarSign className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold">${(stats.totalDisbursed / 1000000).toFixed(1)}M</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Total Disbursed</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Powerful Features for Modern Lending
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Smart Credit Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Advanced algorithms analyze payment history and calculate precise credit scores 
                  based on EMI payment patterns and financial behavior.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Instant Eligibility</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Real-time eligibility checks with automated approval recommendations 
                  and competitive interest rate suggestions.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-green-500 mb-4" />
                <CardTitle>Loan Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Comprehensive loan tracking with EMI calculations, payment schedules, 
                  and detailed customer loan portfolios.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4 bg-primary/5 dark:bg-primary/10">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <Link to="/register">
                <CardHeader className="text-center">
                  <Users className="h-16 w-16 text-primary mx-auto mb-4" />
                  <CardTitle>Register Customer</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Add new customers with automatic credit limit calculation
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>
            
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <Link to="/check-eligibility">
                <CardHeader className="text-center">
                  <Shield className="h-16 w-16 text-accent mx-auto mb-4" />
                  <CardTitle>Check Eligibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Verify loan eligibility with smart credit scoring
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>
            
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <Link to="/create-loan">
                <CardHeader className="text-center">
                  <CreditCard className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <CardTitle>Create Loan</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Process new loan applications with EMI calculation
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>
            
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <Link to="/loans">
                <CardHeader className="text-center">
                  <TrendingUp className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <CardTitle>View Loans</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Browse and manage existing loan portfolios
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">CreditFlow</span>
          </div>
          <p className="text-gray-400 mb-4">
            Intelligent Credit Approval System for Modern Financial Institutions
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Support</span>
            <span>API Documentation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
