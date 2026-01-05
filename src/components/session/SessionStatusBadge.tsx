import { cn } from "@/lib/utils";
import { SessionStatus, sessionStatusConfig } from "@/types/session";
import { Circle, Play, CheckCircle, XCircle } from "lucide-react";

interface SessionStatusBadgeProps {
  status: SessionStatus;
  size?: "sm" | "md";
  showIcon?: boolean;
}

const statusIcons = {
  scheduled: Circle,
  active: Play,
  completed: CheckCircle,
  cancelled: XCircle,
};

export const SessionStatusBadge = ({
  status,
  size = "md",
  showIcon = true,
}: SessionStatusBadgeProps) => {
  const config = sessionStatusConfig[status];
  const Icon = statusIcons[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        config.bgColor,
        config.borderColor,
        config.color,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      {showIcon && (
        <Icon className={cn(
          status === "active" && "animate-pulse",
          size === "sm" ? "w-3 h-3" : "w-4 h-4"
        )} />
      )}
      {config.label}
    </span>
  );
};
