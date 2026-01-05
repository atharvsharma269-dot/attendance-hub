import { motion } from "framer-motion";
import { 
  Scan, 
  PlayCircle, 
  Calendar, 
  RotateCcw, 
  FileText, 
  ClipboardList, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const dashboardCards = [
  {
    title: "Start Attendance",
    description: "Begin a new attendance session with face recognition",
    icon: PlayCircle,
    color: "from-success to-success/60",
    link: "/teacher/attendance",
    stats: "Live Session",
  },
  {
    title: "Sessions",
    description: "View all past and ongoing sessions",
    icon: Calendar,
    color: "from-primary to-primary/60",
    link: "/teacher/sessions",
    stats: "24 This Week",
  },
  {
    title: "Retrials",
    description: "Manage pending face recognition retrials",
    icon: RotateCcw,
    color: "from-warning to-warning/60",
    link: "/teacher/retrials",
    stats: "3 Pending",
  },
  {
    title: "Reports",
    description: "Generate and download attendance reports",
    icon: FileText,
    color: "from-accent to-accent/60",
    link: "/teacher/reports",
    stats: "Export Ready",
  },
  {
    title: "Audit Logs",
    description: "Track all system activities and changes",
    icon: ClipboardList,
    color: "from-muted-foreground to-muted-foreground/60",
    link: "/teacher/audit",
    stats: "142 Events",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const TeacherDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Scan className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">FaceAttend</h1>
              <p className="text-xs text-muted-foreground">Teacher Dashboard</p>
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
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">Welcome back, Teacher</h2>
          <p className="text-muted-foreground">
            Manage your attendance sessions and view real-time recognition data
          </p>
        </motion.div>

        {/* Dashboard Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {dashboardCards.map((card, index) => (
            <motion.div key={card.title} variants={itemVariants}>
              <Link to={card.link}>
                <Card variant="interactive" className="h-full group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <card.icon className="w-7 h-7 text-primary-foreground" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                        {card.stats}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                    <div className="flex items-center text-primary text-sm font-medium">
                      Open
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Total Students", value: "156" },
            { label: "Today's Present", value: "142" },
            { label: "Attendance Rate", value: "91.0%" },
            { label: "Active Sessions", value: "2" },
          ].map((stat) => (
            <Card key={stat.label} variant="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
