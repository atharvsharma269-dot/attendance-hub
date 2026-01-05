import { WifiOff, RefreshCw, AlertTriangle, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  type?: "network" | "server" | "notFound" | "generic";
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const errorConfigs = {
  network: {
    icon: WifiOff,
    title: "Connection Lost",
    message: "Unable to connect to the server. Please check your internet connection.",
    color: "text-warning",
  },
  server: {
    icon: ServerCrash,
    title: "Server Error",
    message: "Something went wrong on our end. Please try again later.",
    color: "text-destructive",
  },
  notFound: {
    icon: AlertTriangle,
    title: "Not Found",
    message: "The requested resource could not be found.",
    color: "text-muted-foreground",
  },
  generic: {
    icon: AlertTriangle,
    title: "Something Went Wrong",
    message: "An unexpected error occurred. Please try again.",
    color: "text-warning",
  },
};

export const ErrorState = ({
  type = "generic",
  title,
  message,
  onRetry,
  className,
}: ErrorStateProps) => {
  const config = errorConfigs[type];
  const Icon = config.icon;

  return (
    <Card className={cn("border-destructive/20", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Icon className={cn("w-8 h-8", config.color)} />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title || config.title}</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {message || config.message}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Inline error for smaller contexts
export const InlineError = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-destructive" />
        <span className="text-destructive">{message}</span>
      </div>
      {onRetry && (
        <Button size="sm" variant="ghost" onClick={onRetry}>
          <RefreshCw className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};

// Offline indicator banner
export const OfflineIndicator = ({ isOnline }: { isOnline: boolean }) => {
  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-warning text-warning-foreground py-2 px-4 text-center text-sm font-medium">
      <WifiOff className="w-4 h-4 inline-block mr-2" />
      You're offline. Some features may be unavailable.
    </div>
  );
};
