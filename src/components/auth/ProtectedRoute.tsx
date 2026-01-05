import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles,
  redirectTo = "/"
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" text="Verifying access..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login based on attempted route
    const loginPath = location.pathname.startsWith("/teacher") 
      ? "/auth/teacher" 
      : "/auth/student";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user?.role ?? null)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
