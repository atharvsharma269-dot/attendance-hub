export type SessionStatus = "scheduled" | "active" | "completed" | "cancelled";

export interface Session {
  id: string;
  name: string;
  course: string;
  status: SessionStatus;
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  totalStudents: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  retrialCount: number;
}

export const sessionStatusConfig: Record<SessionStatus, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  scheduled: {
    label: "Scheduled",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  active: {
    label: "Active",
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
  },
  completed: {
    label: "Completed",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    borderColor: "border-border",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
  },
};

// Session state machine - valid transitions
export const validSessionTransitions: Record<SessionStatus, SessionStatus[]> = {
  scheduled: ["active", "cancelled"],
  active: ["completed"],
  completed: [], // Terminal state
  cancelled: [], // Terminal state
};

export const canTransitionTo = (
  currentStatus: SessionStatus,
  targetStatus: SessionStatus
): boolean => {
  return validSessionTransitions[currentStatus].includes(targetStatus);
};

export const getNextActions = (status: SessionStatus): { action: string; targetStatus: SessionStatus }[] => {
  const transitions = validSessionTransitions[status];
  
  const actionLabels: Record<SessionStatus, string> = {
    scheduled: "Schedule",
    active: "Start",
    completed: "Complete",
    cancelled: "Cancel",
  };

  return transitions.map(targetStatus => ({
    action: actionLabels[targetStatus],
    targetStatus,
  }));
};
