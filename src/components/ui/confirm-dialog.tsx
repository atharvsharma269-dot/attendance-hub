import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ConfirmDialogProps {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export const ConfirmDialog = ({
  trigger,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {variant === "destructive" && (
              <AlertTriangle className="w-5 h-5 text-destructive" />
            )}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Audit-safe action button with confirmation
interface AuditActionButtonProps {
  action: string;
  entityType: string;
  entityId: string;
  children: ReactNode;
  variant?: "default" | "destructive" | "outline" | "ghost";
  onConfirm: () => void | Promise<void>;
  requiresConfirmation?: boolean;
}

export const AuditActionButton = ({
  action,
  entityType,
  entityId,
  children,
  variant = "default",
  onConfirm,
  requiresConfirmation = true,
}: AuditActionButtonProps) => {
  const handleConfirm = async () => {
    // Log the action for audit trail (would be sent to backend)
    console.log(`[AUDIT] Action: ${action}, Entity: ${entityType}, ID: ${entityId}, Time: ${new Date().toISOString()}`);
    await onConfirm();
  };

  if (!requiresConfirmation) {
    return (
      <Button variant={variant} onClick={handleConfirm}>
        {children}
      </Button>
    );
  }

  return (
    <ConfirmDialog
      trigger={<Button variant={variant}>{children}</Button>}
      title={`Confirm ${action}`}
      description={`Are you sure you want to ${action.toLowerCase()} this ${entityType}? This action will be logged for audit purposes.`}
      confirmText={action}
      variant={action.toLowerCase().includes("delete") ? "destructive" : "default"}
      onConfirm={handleConfirm}
    />
  );
};
