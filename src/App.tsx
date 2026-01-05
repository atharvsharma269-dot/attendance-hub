import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OfflineIndicator } from "@/components/ui/error-state";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import Index from "./pages/Index";
import TeacherAuth from "./pages/auth/TeacherAuth";
import StudentAuth from "./pages/auth/StudentAuth";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import LiveAttendance from "./pages/teacher/LiveAttendance";
import SessionsPage from "./pages/teacher/SessionsPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const AppContent = () => {
  const isOnline = useOnlineStatus();

  return (
    <>
      <OfflineIndicator isOnline={isOnline} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/auth/teacher" element={<TeacherAuth />} />
        <Route path="/auth/student" element={<StudentAuth />} />

        {/* Teacher Protected Routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/attendance"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <LiveAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/sessions"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <SessionsPage />
            </ProtectedRoute>
          }
        />

        {/* Student Protected Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
