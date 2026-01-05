import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-10 h-10",
};

export const LoadingSpinner = ({ 
  size = "md", 
  text, 
  className 
}: LoadingSpinnerProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

export const FullPageLoader = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 pointer-events-none" />
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};

export const CardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("animate-pulse rounded-xl bg-muted/50 border border-border/50", className)}>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-8 bg-muted rounded w-full" />
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ columns = 4 }: { columns?: number }) => {
  return (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-muted rounded flex-1" 
          style={{ maxWidth: i === 0 ? "200px" : "100px" }}
        />
      ))}
    </div>
  );
};
