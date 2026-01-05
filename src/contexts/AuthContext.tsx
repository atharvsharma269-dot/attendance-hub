import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type UserRole = "teacher" | "student" | null;

export interface User {
  id: string;
  name: string;
  role: UserRole;
  identifier: string; // Registration number for teachers, roll number for students
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (identifier: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // This is a placeholder for actual API authentication
      // In production, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login - in production, validate against backend
      const mockUser: User = {
        id: crypto.randomUUID(),
        name: role === "teacher" ? "Dr. Smith" : "Student User",
        role,
        identifier,
      };
      
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // Additional cleanup like clearing tokens would happen here
  }, []);

  const hasRole = useCallback((role: UserRole): boolean => {
    return user?.role === role;
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
