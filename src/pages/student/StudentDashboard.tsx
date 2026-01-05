import { motion } from "framer-motion";
import { 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  Clock,
  TrendingUp,
  Flame,
  Calendar,
  LogOut,
  RotateCcw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Mock data
const mockStudentData = {
  name: "John Doe",
  rollNumber: "21CS001",
  attendancePercentage: 87,
  currentStreak: 12,
  totalClasses: 45,
  present: 39,
  late: 3,
  absent: 3,
  todayStatus: "present" as const,
  recentHistory: [
    { date: "2024-01-15", subject: "Data Structures", status: "present" as const, time: "09:02 AM" },
    { date: "2024-01-14", subject: "Algorithms", status: "present" as const, time: "09:05 AM" },
    { date: "2024-01-13", subject: "Database Systems", status: "late" as const, time: "09:18 AM" },
    { date: "2024-01-12", subject: "Computer Networks", status: "present" as const, time: "09:01 AM" },
    { date: "2024-01-11", subject: "Operating Systems", status: "absent" as const },
    { date: "2024-01-10", subject: "Data Structures", status: "present" as const, time: "09:03 AM" },
  ],
};

const StatusIcon = ({ status }: { status: 'present' | 'late' | 'absent' | 'retrial' }) => {
  const configs = {
    present: { icon: CheckCircle2, className: "text-success" },
    late: { icon: Clock, className: "text-late" },
    absent: { icon: XCircle, className: "text-muted-foreground" },
    retrial: { icon: RotateCcw, className: "text-warning" },
  };

  const config = configs[status];
  const Icon = config.icon;

  return <Icon className={`w-5 h-5 ${config.className}`} />;
};

const StudentDashboard = () => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'border-l-success';
      case 'late': return 'border-l-late';
      case 'absent': return 'border-l-muted-foreground';
      default: return 'border-l-warning';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-accent/3 via-transparent to-primary/3 pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">FaceAttend</h1>
              <p className="text-xs text-muted-foreground">Student Portal</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/")}
            className="text-muted-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">Welcome, {mockStudentData.name}</h2>
          <p className="text-muted-foreground">
            Roll Number: {mockStudentData.rollNumber}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {/* Today's Status */}
          <Card variant="status" className={`${getStatusColor(mockStudentData.todayStatus)}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Today's Status</span>
                <StatusIcon status={mockStudentData.todayStatus} />
              </div>
              <div className="text-2xl font-bold capitalize">{mockStudentData.todayStatus}</div>
            </CardContent>
          </Card>

          {/* Attendance Percentage */}
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Attendance</span>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">{mockStudentData.attendancePercentage}%</div>
              <Progress value={mockStudentData.attendancePercentage} className="mt-2 h-2" />
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Current Streak</span>
                <Flame className="w-5 h-5 text-warning" />
              </div>
              <div className="text-2xl font-bold">{mockStudentData.currentStreak} days</div>
              <p className="text-xs text-muted-foreground mt-1">Keep it going!</p>
            </CardContent>
          </Card>

          {/* Total Classes */}
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Classes</span>
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div className="text-2xl font-bold">{mockStudentData.totalClasses}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {mockStudentData.present}P / {mockStudentData.late}L / {mockStudentData.absent}A
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Attendance Breakdown & History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">Attendance Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <span className="text-sm">Present</span>
                    </div>
                    <span className="font-medium">{mockStudentData.present}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-success rounded-full transition-all duration-500"
                      style={{ width: `${(mockStudentData.present / mockStudentData.totalClasses) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-late" />
                      <span className="text-sm">Late</span>
                    </div>
                    <span className="font-medium">{mockStudentData.late}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-late rounded-full transition-all duration-500"
                      style={{ width: `${(mockStudentData.late / mockStudentData.totalClasses) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                      <span className="text-sm">Absent</span>
                    </div>
                    <span className="font-medium">{mockStudentData.absent}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-muted-foreground rounded-full transition-all duration-500"
                      style={{ width: `${(mockStudentData.absent / mockStudentData.totalClasses) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">Attendance History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subject</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockStudentData.recentHistory.map((record, index) => (
                        <motion.tr
                          key={record.date}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border/50 hover:bg-card/50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm">{record.date}</td>
                          <td className="py-3 px-4 text-sm">{record.subject}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {record.time || "—"}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <StatusIcon status={record.status} />
                              <span className="text-sm capitalize">{record.status}</span>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
