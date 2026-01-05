import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Scan, 
  ArrowLeft, 
  Calendar,
  Download,
  Plus,
  Play,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionStatusBadge } from "@/components/session/SessionStatusBadge";
import { ExportFilters, AttendanceFilters, defaultFilters } from "@/components/filters/ExportFilters";
import { ConfirmDialog, AuditActionButton } from "@/components/ui/confirm-dialog";
import { ErrorState } from "@/components/ui/error-state";
import { CardSkeleton } from "@/components/ui/loading-spinner";
import { Session, SessionStatus, canTransitionTo } from "@/types/session";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockSessions: Session[] = [
  {
    id: "1",
    name: "Morning Lecture",
    course: "CS101 - Data Structures",
    status: "completed",
    scheduledAt: "2024-01-15T09:00:00",
    startedAt: "2024-01-15T09:02:00",
    endedAt: "2024-01-15T10:30:00",
    totalStudents: 45,
    presentCount: 40,
    lateCount: 3,
    absentCount: 2,
    retrialCount: 0,
  },
  {
    id: "2",
    name: "Lab Session",
    course: "CS201 - Algorithms",
    status: "active",
    scheduledAt: "2024-01-15T14:00:00",
    startedAt: "2024-01-15T14:01:00",
    totalStudents: 30,
    presentCount: 25,
    lateCount: 2,
    absentCount: 3,
    retrialCount: 1,
  },
  {
    id: "3",
    name: "Evening Tutorial",
    course: "CS101 - Data Structures",
    status: "scheduled",
    scheduledAt: "2024-01-15T16:00:00",
    totalStudents: 45,
    presentCount: 0,
    lateCount: 0,
    absentCount: 0,
    retrialCount: 0,
  },
];

const SessionCard = ({ 
  session, 
  onStart, 
  onView 
}: { 
  session: Session; 
  onStart: (id: string) => void;
  onView: (id: string) => void;
}) => {
  const attendanceRate = session.totalStudents > 0 
    ? Math.round((session.presentCount / session.totalStudents) * 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card variant="interactive" className="h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{session.name}</h3>
              <p className="text-sm text-muted-foreground">{session.course}</p>
            </div>
            <SessionStatusBadge status={session.status} />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(session.scheduledAt).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>

          {session.status !== "scheduled" && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="text-center p-2 rounded-lg bg-success/10">
                <div className="text-lg font-bold text-success">{session.presentCount}</div>
                <div className="text-xs text-muted-foreground">Present</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-late/10">
                <div className="text-lg font-bold text-late">{session.lateCount}</div>
                <div className="text-xs text-muted-foreground">Late</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted">
                <div className="text-lg font-bold">{session.absentCount}</div>
                <div className="text-xs text-muted-foreground">Absent</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-warning/10">
                <div className="text-lg font-bold text-warning">{session.retrialCount}</div>
                <div className="text-xs text-muted-foreground">Retrial</div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-border">
            {session.status !== "scheduled" && (
              <div className="text-sm">
                <span className="text-muted-foreground">Rate: </span>
                <span className="font-semibold text-primary">{attendanceRate}%</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 ml-auto">
              {session.status === "scheduled" && canTransitionTo("scheduled", "active") && (
                <AuditActionButton
                  action="Start"
                  entityType="session"
                  entityId={session.id}
                  variant="default"
                  onConfirm={() => onStart(session.id)}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </AuditActionButton>
              )}
              {session.status === "active" && (
                <Link to={`/teacher/attendance?session=${session.id}`}>
                  <Button variant="gradient" size="sm">
                    <Scan className="w-4 h-4 mr-1" />
                    Live View
                  </Button>
                </Link>
              )}
              {session.status === "completed" && (
                <Button variant="outline" size="sm" onClick={() => onView(session.id)}>
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SessionsPage = () => {
  const [filters, setFilters] = useState<AttendanceFilters>(defaultFilters);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const { toast } = useToast();

  const courses = [...new Set(mockSessions.map(s => s.course))];

  const filteredSessions = mockSessions.filter(session => {
    if (filters.status !== "all" && session.status !== filters.status) return false;
    if (filters.course !== "all" && session.course !== filters.course) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!session.name.toLowerCase().includes(search) && 
          !session.course.toLowerCase().includes(search)) {
        return false;
      }
    }
    return true;
  });

  const handleStartSession = (id: string) => {
    toast({
      title: "Session Started",
      description: "The attendance session is now active.",
    });
  };

  const handleViewSession = (id: string) => {
    toast({
      title: "Opening Session Details",
      description: `Viewing session ${id}`,
    });
  };

  const handleExport = (format: "csv" | "pdf") => {
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: `Exporting ${filteredSessions.length} sessions`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/teacher/dashboard" 
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Sessions</h1>
                <p className="text-xs text-muted-foreground">
                  {filteredSessions.length} sessions
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="gradient" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Session
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Filters */}
        <Card variant="glass" className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <ExportFilters
              filters={filters}
              onFiltersChange={setFilters}
              courses={courses}
            />
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <ErrorState
            type="server"
            message={error}
            onRetry={() => window.location.reload()}
            className="mb-6"
          />
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} className="h-[280px]" />
            ))}
          </div>
        ) : (
          /* Sessions Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onStart={handleStartSession}
                onView={handleViewSession}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Sessions Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or create a new session.
            </p>
            <Button variant="gradient">
              <Plus className="w-4 h-4 mr-2" />
              Create Session
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SessionsPage;
