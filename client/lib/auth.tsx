import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string; role: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    // Check for stored authentication on app load
    const storedAuth = localStorage.getItem('creditflow_auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setIsAuthenticated(true);
        setUser(authData.user);
      } catch (error) {
        localStorage.removeItem('creditflow_auth');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple demo authentication - in production, this would call your API
    const validCredentials = [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'manager', password: 'manager123', role: 'manager' },
    ];

    const user = validCredentials.find(
      cred => cred.username === username && cred.password === password
    );

    if (user) {
      const authData = {
        user: { username: user.username, role: user.role },
        timestamp: Date.now(),
      };
      
      localStorage.setItem('creditflow_auth', JSON.stringify(authData));
      setIsAuthenticated(true);
      setUser({ username: user.username, role: user.role });
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('creditflow_auth');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
