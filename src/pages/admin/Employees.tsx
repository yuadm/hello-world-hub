import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Search, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";
import { Employee } from "@/types/employee";
import { getEmploymentStatusConfig } from "@/lib/employeeHelpers";
import { Badge } from "@/components/ui/badge";

const AdminEmployees = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, statusFilter]);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEmployees((data || []) as unknown as Employee[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load employees",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = [...employees];

    if (statusFilter !== "all") {
      filtered = filtered.filter(emp => emp.employment_status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
  };

  const handleDeleteClick = (e: React.MouseEvent, emp: Employee) => {
    e.stopPropagation();
    setEmployeeToDelete(emp);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;

    setDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke('delete-employee-and-revert', {
        body: { employeeId: employeeToDelete.id }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete employee');
      }

      toast({
        title: "Employee Deleted",
        description: `${employeeToDelete.first_name} ${employeeToDelete.last_name} has been deleted and the application reverted to pending.`,
      });

      // Remove from local state
      setEmployees(prev => prev.filter(e => e.id !== employeeToDelete.id));
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete employee",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="mb-8">
          <div className="h-8 w-64 bg-muted rounded-xl animate-shimmer mb-2" />
          <div className="h-5 w-96 bg-muted rounded-lg animate-shimmer" />
        </div>

        <div className="rounded-2xl border-0 bg-card shadow-apple-sm overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <div className="flex gap-4">
              <div className="flex-1 h-10 bg-muted rounded-xl animate-shimmer" />
              <div className="w-48 h-10 bg-muted rounded-xl animate-shimmer" />
            </div>
          </div>
          <div className="divide-y divide-border/50">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="flex-1 h-6 bg-muted rounded-lg animate-shimmer" />
                <div className="w-32 h-6 bg-muted rounded-lg animate-shimmer" />
                <div className="w-24 h-9 bg-muted rounded-lg animate-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Employees</h1>
          <p className="text-muted-foreground">
            Manage approved childminders
          </p>
        </div>

        <Card className="border">
          <CardContent className="p-6">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No employees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <TableRow 
                        key={emp.id}
                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/admin/employees/${emp.id}`)}
                      >
                        <TableCell className="font-medium">
                          {emp.first_name} {emp.last_name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{emp.email}</TableCell>
                        <TableCell>{emp.service_type || "N/A"}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={getEmploymentStatusConfig(emp.employment_status).variant}
                            className="rounded-full px-2.5 py-0.5 text-xs"
                          >
                            {getEmploymentStatusConfig(emp.employment_status).label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {emp.employment_start_date 
                            ? format(new Date(emp.employment_start_date), "MMM dd, yyyy")
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/employees/${emp.id}`);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => handleDeleteClick(e, emp)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee & Revert Application</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Are you sure you want to delete <strong>{employeeToDelete?.first_name} {employeeToDelete?.last_name}</strong>?
              </p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm">
                <p className="font-medium text-destructive mb-2">This will permanently delete:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>The employee record</li>
                  <li>All household members added on the employee side</li>
                  <li>All assistants added on the employee side</li>
                  <li>All co-childminders added on the employee side</li>
                  <li>All forms sent (household, assistant, co-childminder)</li>
                  <li>All reference requests</li>
                  <li>All Ofsted and LA check forms</li>
                </ul>
              </div>
              <p className="text-sm">
                The original application will be reverted to <strong>pending</strong> status so you can make changes and re-approve.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete & Revert"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminEmployees;
