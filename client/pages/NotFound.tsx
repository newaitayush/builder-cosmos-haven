import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft, Construction } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  const isPlaceholderRoute = ['/create-loan', '/loans'].includes(location.pathname);

  if (isPlaceholderRoute) {
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
            <Card className="text-center">
              <CardHeader>
                <Construction className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Page Coming Soon</CardTitle>
                <CardDescription className="text-lg">
                  This feature is being developed and will be available soon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    {location.pathname === '/create-loan'
                      ? 'The loan creation interface is currently under development. This will allow you to process new loan applications with automatic EMI calculations.'
                      : 'The loan management interface is being built. This will provide comprehensive loan tracking and customer portfolio management.'
                    }
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button asChild>
                      <Link to="/">Return to Dashboard</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/register">Register Customer</Link>
                    </Button>
                  </div>
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
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">CreditFlow</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl font-bold mb-4">404</CardTitle>
              <CardDescription className="text-xl">
                Oops! Page not found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <Button asChild>
                <Link to="/">Return to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
