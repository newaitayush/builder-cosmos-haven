import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string; role: string; email?: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    username: string,
  ) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    role: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    // Check for stored authentication on app load
    const storedAuth = localStorage.getItem("creditflow_auth");
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setIsAuthenticated(true);
        setUser(authData.user);
      } catch (error) {
        localStorage.removeItem("creditflow_auth");
      }
    }
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    // Check registered users first
    const registeredUsers = JSON.parse(
      localStorage.getItem("creditflow_users") || "[]",
    );
    const registeredUser = registeredUsers.find(
      (user: any) => user.username === username && user.password === password,
    );

    if (registeredUser) {
      const authData = {
        user: {
          username: registeredUser.username,
          role: registeredUser.role,
          email: registeredUser.email,
        },
        timestamp: Date.now(),
      };

      localStorage.setItem("creditflow_auth", JSON.stringify(authData));
      setIsAuthenticated(true);
      setUser({
        username: registeredUser.username,
        role: registeredUser.role,
        email: registeredUser.email,
      });
      return true;
    }

    // Fallback to demo credentials
    const validCredentials = [
      {
        username: "admin",
        password: "admin123",
        role: "admin",
        email: "admin@creditflow.com",
      },
      {
        username: "manager",
        password: "manager123",
        role: "manager",
        email: "manager@creditflow.com",
      },
    ];

    const user = validCredentials.find(
      (cred) => cred.username === username && cred.password === password,
    );

    if (user) {
      const authData = {
        user: { username: user.username, role: user.role, email: user.email },
        timestamp: Date.now(),
      };

      localStorage.setItem("creditflow_auth", JSON.stringify(authData));
      setIsAuthenticated(true);
      setUser({ username: user.username, role: user.role, email: user.email });
      return true;
    }

    return false;
  };

  const register = async (
    email: string,
    password: string,
    username: string,
  ): Promise<boolean> => {
    // Simple registration logic - in production, this would call your API
    const registeredUsers = JSON.parse(
      localStorage.getItem("creditflow_users") || "[]",
    );

    // Check if user already exists
    const existingUser = registeredUsers.find(
      (user: any) => user.username === username || user.email === email,
    );

    if (existingUser) {
      return false; // User already exists
    }

    // Add new user (default role is 'user', admin can promote later)
    const newUser = {
      username,
      email,
      password,
      role: "user",
      createdAt: Date.now(),
    };

    registeredUsers.push(newUser);
    localStorage.setItem("creditflow_users", JSON.stringify(registeredUsers));

    // Automatically log in the user after registration
    const authData = {
      user: {
        username: newUser.username,
        role: newUser.role,
        email: newUser.email,
      },
      timestamp: Date.now(),
    };

    localStorage.setItem("creditflow_auth", JSON.stringify(authData));
    setIsAuthenticated(true);
    setUser({
      username: newUser.username,
      role: newUser.role,
      email: newUser.email,
    });

    return true;
  };

  const logout = () => {
    localStorage.removeItem("creditflow_auth");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
