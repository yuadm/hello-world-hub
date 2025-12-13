import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  onSuccess: () => void;
}

export const DeleteEmployeeModal = ({
  isOpen,
  onClose,
  employee,
  onSuccess,
}: DeleteEmployeeModalProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!employee) return;

    setIsDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        'delete-employee-reset-application',
        {
          body: { employeeId: employee.id },
        }
      );

      if (error) throw error;

      toast({
        title: "Employee Deleted",
        description: `${employee.first_name} ${employee.last_name} has been deleted and the application reset to pending.`,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error deleting employee:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete employee",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!employee) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>Delete Employee & Reset Application</AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to delete <strong>{employee.first_name} {employee.last_name}</strong>?
              </p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm">
                <p className="font-medium text-destructive mb-2">This action will permanently delete:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>All household members and their forms</li>
                  <li>All assistants and their forms</li>
                  <li>All co-childminders and their applications</li>
                  <li>All reference requests and responses</li>
                  <li>All Ofsted and LA form submissions</li>
                  <li>The employee record itself</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                The original application will be reset to <strong>pending</strong> status so you can make changes and re-approve it.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete & Reset"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
