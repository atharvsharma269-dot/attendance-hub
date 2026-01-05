import { motion } from "framer-motion";
import { Scan, GraduationCap, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-16"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Scan className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">FaceAttend</span>
          </div>
        </motion.header>

        {/* Hero Section */}
        <main className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              AI-Powered Attendance System
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-4xl"
          >
            <span className="gradient-text">Face Recognition</span>
            <br />
            Attendance System
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12"
          >
            Seamless, contactless attendance tracking powered by advanced facial recognition technology. Fast, accurate, and secure.
          </motion.p>

          {/* Login Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl"
          >
            <Link to="/auth/teacher" className="block">
              <Card variant="interactive" className="group h-full">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Teacher Portal</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Manage attendance sessions, view reports, and handle retrials
                  </p>
                  <Button variant="gradient" size="lg" className="w-full">
                    Login as Teacher
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/auth/student" className="block">
              <Card variant="interactive" className="group h-full">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Student Portal</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    View your attendance records, streaks, and percentage
                  </p>
                  <Button variant="outline" size="lg" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                    Login as Student
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl"
          >
            {[
              { title: "Fast Recognition", desc: "Under 2 seconds per face" },
              { title: "99.5% Accuracy", desc: "Advanced AI algorithms" },
              { title: "Real-time Sync", desc: "Instant status updates" },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{feature.title}</div>
                <div className="text-sm text-muted-foreground">{feature.desc}</div>
              </div>
            ))}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Index;
