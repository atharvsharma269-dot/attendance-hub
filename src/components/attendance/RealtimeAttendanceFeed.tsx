import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock, RotateCcw, User, Wifi, WifiOff } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";

export interface AttendanceEvent {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  status: "present" | "late" | "absent" | "retrial";
  timestamp: string;
  confidence?: number;
}

interface RealtimeAttendanceFeedProps {
  sessionId: string;
  onNewEvent?: (event: AttendanceEvent) => void;
}

const statusConfig = {
  present: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
  late: { icon: Clock, color: "text-late", bg: "bg-late/10", border: "border-late/20" },
  absent: { icon: XCircle, color: "text-muted-foreground", bg: "bg-muted", border: "border-border" },
  retrial: { icon: RotateCcw, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
};

export const RealtimeAttendanceFeed = ({ 
  sessionId, 
  onNewEvent 
}: RealtimeAttendanceFeedProps) => {
  // WebSocket URL would come from environment in production
  const wsUrl = `${import.meta.env.VITE_WS_URL || "ws://localhost:3001"}/ws/attendance/${sessionId}`;

  const { status, lastMessage, isConnected } = useWebSocket<AttendanceEvent>({
    url: wsUrl,
    onMessage: (message) => {
      if (message.type === "attendance_update" && message.payload) {
        onNewEvent?.(message.payload as AttendanceEvent);
      }
    },
  });

  // Note: In production, you would call connect() when the component mounts
  // and the session is active. For now, this is a placeholder structure.

  return (
    <div className="space-y-3">
      {/* Connection Status */}
      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/50">
        <span className="text-xs font-medium text-muted-foreground">Real-time Feed</span>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-3 h-3 text-success" />
              <span className="text-xs text-success">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground capitalize">{status}</span>
            </>
          )}
        </div>
      </div>

      {/* Placeholder for live events - actual events come from WebSocket */}
      <div className="text-center py-8 text-muted-foreground text-sm">
        <p>Waiting for real-time attendance events...</p>
        <p className="text-xs mt-1">Events will appear here when the backend is connected</p>
      </div>
    </div>
  );
};

// Individual event card for use in lists
export const AttendanceEventCard = ({ event }: { event: AttendanceEvent }) => {
  const config = statusConfig[event.status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`flex items-center justify-between p-3 rounded-lg ${config.bg} border ${config.border}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">{event.studentName}</p>
          <p className="text-xs text-muted-foreground">{event.rollNumber}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${config.color}`} />
        <span className="text-xs text-muted-foreground">
          {new Date(event.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  );
};
