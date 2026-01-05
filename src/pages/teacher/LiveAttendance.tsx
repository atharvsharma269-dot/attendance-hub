import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scan, 
  ArrowLeft, 
  Camera,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Download,
  Square,
  User
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockStudents = {
  present: [
    { id: 1, name: "John Doe", rollNumber: "21CS001", time: "09:02 AM" },
    { id: 2, name: "Jane Smith", rollNumber: "21CS002", time: "09:03 AM" },
    { id: 3, name: "Mike Johnson", rollNumber: "21CS003", time: "09:05 AM" },
    { id: 4, name: "Sarah Williams", rollNumber: "21CS004", time: "09:07 AM" },
    { id: 5, name: "David Brown", rollNumber: "21CS005", time: "09:08 AM" },
  ],
  late: [
    { id: 6, name: "Emily Davis", rollNumber: "21CS006", time: "09:18 AM" },
    { id: 7, name: "Chris Wilson", rollNumber: "21CS007", time: "09:22 AM" },
  ],
  absent: [
    { id: 8, name: "Alex Taylor", rollNumber: "21CS008" },
    { id: 9, name: "Sam Martinez", rollNumber: "21CS009" },
  ],
  retrials: [
    { id: 10, name: "Jordan Lee", rollNumber: "21CS010", reason: "Low confidence" },
  ],
};

const StatusBadge = ({ status }: { status: 'present' | 'late' | 'absent' | 'retrial' }) => {
  const configs = {
    present: { icon: CheckCircle2, label: "Present", className: "bg-success/10 text-success border-success/20" },
    late: { icon: Clock, label: "Late", className: "bg-late/10 text-late border-late/20" },
    absent: { icon: XCircle, label: "Absent", className: "bg-muted text-muted-foreground border-border" },
    retrial: { icon: RotateCcw, label: "Retrial", className: "bg-warning/10 text-warning border-warning/20" },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

const StudentCard = ({ 
  student, 
  status 
}: { 
  student: { id: number; name: string; rollNumber: string; time?: string; reason?: string }; 
  status: 'present' | 'late' | 'absent' | 'retrial' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50 hover:bg-card/80 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">{student.name}</p>
          <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {student.time && (
          <span className="text-sm text-muted-foreground">{student.time}</span>
        )}
        <StatusBadge status={status} />
      </div>
    </motion.div>
  );
};

const LiveAttendance = () => {
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [retrialRollNumber, setRetrialRollNumber] = useState("");
  const [isRetrialOpen, setIsRetrialOpen] = useState(false);
  const { toast } = useToast();

  const handleRetrial = () => {
    toast({
      title: "Retrial Submitted",
      description: `Manual retrial initiated for ${retrialRollNumber}`,
    });
    setRetrialRollNumber("");
    setIsRetrialOpen(false);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: "Your report will download shortly.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
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
                <Scan className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Live Attendance</h1>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isSessionActive ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
                  <p className="text-xs text-muted-foreground">
                    {isSessionActive ? 'Session Active' : 'Session Ended'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isRetrialOpen} onOpenChange={setIsRetrialOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Manual Retrial
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manual Retrial</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="retrial-roll">Roll Number</Label>
                    <Input
                      id="retrial-roll"
                      placeholder="e.g., 21CS001"
                      value={retrialRollNumber}
                      onChange={(e) => setRetrialRollNumber(e.target.value)}
                    />
                  </div>
                  <div className="aspect-video bg-secondary rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Camera Preview</p>
                    </div>
                  </div>
                  <Button onClick={handleRetrial} className="w-full" variant="gradient">
                    Capture & Submit
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant={isSessionActive ? "destructive" : "success"}
              size="sm"
              onClick={() => setIsSessionActive(!isSessionActive)}
            >
              {isSessionActive ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  End Session
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Start Session
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Webcam Feed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card variant="glass" className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Live Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="webcam-frame aspect-[4/3] bg-secondary rounded-xl flex items-center justify-center relative overflow-hidden">
                  {isSessionActive && <div className="scan-line" />}
                  <div className="text-center z-10">
                    <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {isSessionActive ? "Scanning for faces..." : "Session not active"}
                    </p>
                  </div>
                </div>

                {/* Recent Recognition */}
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Recent Recognition</p>
                  <AnimatePresence mode="popLayout">
                    {mockStudents.present.slice(0, 3).map((student, index) => (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          <span className="text-sm font-medium">{student.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{student.time}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Attendance Lists */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card variant="glass">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Attendance List</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                      <Download className="w-4 h-4 mr-2" />
                      CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="present" className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="present" className="relative">
                      Present
                      <span className="ml-1.5 bg-success text-success-foreground text-xs px-1.5 py-0.5 rounded-full">
                        {mockStudents.present.length}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="late">
                      Late
                      <span className="ml-1.5 bg-late text-late-foreground text-xs px-1.5 py-0.5 rounded-full">
                        {mockStudents.late.length}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="absent">
                      Absent
                      <span className="ml-1.5 bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded-full">
                        {mockStudents.absent.length}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="retrials">
                      Retrials
                      <span className="ml-1.5 bg-warning text-warning-foreground text-xs px-1.5 py-0.5 rounded-full">
                        {mockStudents.retrials.length}
                      </span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="max-h-[500px] overflow-y-auto pr-2 space-y-2">
                    <TabsContent value="present" className="mt-0 space-y-2">
                      <AnimatePresence>
                        {mockStudents.present.map((student) => (
                          <StudentCard key={student.id} student={student} status="present" />
                        ))}
                      </AnimatePresence>
                    </TabsContent>

                    <TabsContent value="late" className="mt-0 space-y-2">
                      <AnimatePresence>
                        {mockStudents.late.map((student) => (
                          <StudentCard key={student.id} student={student} status="late" />
                        ))}
                      </AnimatePresence>
                    </TabsContent>

                    <TabsContent value="absent" className="mt-0 space-y-2">
                      <AnimatePresence>
                        {mockStudents.absent.map((student) => (
                          <StudentCard key={student.id} student={student} status="absent" />
                        ))}
                      </AnimatePresence>
                    </TabsContent>

                    <TabsContent value="retrials" className="mt-0 space-y-2">
                      <AnimatePresence>
                        {mockStudents.retrials.map((student) => (
                          <StudentCard key={student.id} student={student} status="retrial" />
                        ))}
                      </AnimatePresence>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default LiveAttendance;
