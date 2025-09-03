// components/ui/alert-modal.tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"; // Adjust path if necessary
  import { Button } from "@/components/ui/button"; // Adjust path if necessary
  import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react";
  
  // Define the props for the AlertModal
  export interface AlertModalProps {
      title: string;
      type: 'success' | 'error' | 'info' | 'warning';
      text: string;
      isOpen: boolean; // Controlled by the global state
      onClose: () => void; // Function to close the modal
  }
  
  // Map alert types to icons
  const iconMap = {
      success: <CheckCircle2 className="h-6 w-6 text-green-500" />,
      error: <XCircle className="h-6 w-6 text-red-500" />,
      info: <Info className="h-6 w-6 text-blue-500" />,
      warning: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
  };
  
  // Map alert types to title colors (using Tailwind CSS classes)
  const titleColorMap = {
      success: "text-green-600",
      error: "text-red-600",
      info: "text-blue-600",
      warning: "text-yellow-600",
  };
  
  export function AlertModal({ title, type, text, isOpen, onClose }: AlertModalProps) {
      return (
          <Dialog open={isOpen} onOpenChange={onClose}>
              <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader className="flex flex-row items-center gap-3">
                      {iconMap[type]}
                      <DialogTitle className={`${titleColorMap[type]}`}>{title}</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                      {text}
                  </DialogDescription>
                  <DialogFooter>
                      <Button type="button" onClick={onClose}>
                          Close
                      </Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
      );
  }
  