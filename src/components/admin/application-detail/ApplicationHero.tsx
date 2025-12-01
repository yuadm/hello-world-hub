import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, UserCheck, Edit } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApplicationHeroProps {
  applicantName: string;
  email: string;
  status: string;
  updating: boolean;
  existingEmployeeId: string | null;
  onStatusChange: (status: string) => void;
  onDownloadPDF: () => void;
  onViewEmployee: () => void;
  onEdit: () => void;
}

export const ApplicationHero = ({
  applicantName,
  email,
  status,
  updating,
  existingEmployeeId,
  onStatusChange,
  onDownloadPDF,
  onViewEmployee,
  onEdit,
}: ApplicationHeroProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="rounded-2xl bg-card shadow-apple-sm border-0 p-8">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight mb-2 truncate">
            {applicantName}
          </h1>
          <p className="text-muted-foreground mb-4">{email}</p>
          <Badge variant={getStatusVariant(status)} className="capitalize">
            {status}
          </Badge>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Button
            variant="outline"
            size="icon"
            onClick={onDownloadPDF}
            className="rounded-xl"
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            onClick={onEdit}
            className="rounded-xl gap-2"
            disabled={status === "approved"}
            title={status === "approved" ? "Cannot edit approved applications" : "Edit application"}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>

          {existingEmployeeId && (
            <Button
              variant="outline"
              onClick={onViewEmployee}
              className="rounded-xl gap-2"
            >
              <UserCheck className="h-4 w-4" />
              View Employee
            </Button>
          )}

          <Select value={status} onValueChange={onStatusChange} disabled={updating}>
            <SelectTrigger className="w-[140px] rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
