import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";
import { Employee, EmployeeHouseholdMember } from "@/types/employee";
import { EmployeeDBSComplianceSection } from "@/components/admin/EmployeeDBSComplianceSection";
import { EmployeeAssistantComplianceSection } from "@/components/admin/EmployeeAssistantComplianceSection";
import { 
  calculateAge, 
  daysUntil16thBirthday, 
  getEmploymentStatusConfig,
  getDBSStatusConfig,
  get16thBirthdayDate,
  isTurning16Soon
} from "@/lib/employeeHelpers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const AdminEmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [householdMembers, setHouseholdMembers] = useState<EmployeeHouseholdMember[]>([]);

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      const { data: empData, error: empError } = await supabase
        .from('employees' as any)
        .select('*')
        .eq('id', id)
        .single();

      if (empError) throw empError;

      setEmployee(empData as unknown as Employee);

      const { data: membersData, error: membersError } = await supabase
        .from('employee_household_members' as any)
        .select('*')
        .eq('employee_id', id)
        .order('date_of_birth', { ascending: true });

      if (membersError) throw membersError;

      setHouseholdMembers((membersData || []) as unknown as EmployeeHouseholdMember[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load employee details",
        variant: "destructive",
      });
      navigate('/admin/employees');
    } finally {
      setLoading(false);
    }
  };

  const adults = householdMembers.filter(m => m.member_type === 'adult');
  const children = householdMembers.filter(m => m.member_type === 'child');

  if (loading || !employee) {
    return (
      <AdminLayout>
        <div className="mb-8">
          <div className="h-10 w-48 bg-muted rounded-lg animate-shimmer mb-4" />
          <div className="h-9 w-96 bg-muted rounded-xl animate-shimmer mb-2" />
          <div className="h-5 w-64 bg-muted rounded-lg animate-shimmer" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border-0 bg-card shadow-apple-sm p-6">
              <div className="space-y-4">
                <div className="h-6 w-48 bg-muted rounded-lg animate-shimmer" />
                <div className="space-y-3">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="space-y-1">
                      <div className="h-4 w-32 bg-muted rounded animate-shimmer" />
                      <div className="h-5 w-full bg-muted rounded animate-shimmer" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/employees')}
              className="mb-3 -ml-2 rounded-lg hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>
            <h1 className="text-3xl font-semibold tracking-tight">
              {employee.first_name} {employee.last_name}
            </h1>
            <p className="text-muted-foreground mt-1">{employee.email}</p>
          </div>
          <Badge 
            variant={getEmploymentStatusConfig(employee.employment_status).variant}
            className="px-4 py-2 rounded-full text-sm font-medium"
          >
            {getEmploymentStatusConfig(employee.employment_status).label}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-2xl border-0 shadow-apple-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold tracking-tight">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <p className="text-sm font-medium text-muted-foreground">Name:</p>
                <p className="text-sm font-medium">{employee.first_name} {employee.last_name}</p>
                
                <p className="text-sm font-medium text-muted-foreground">Email:</p>
                <p className="text-sm">{employee.email}</p>
                
                <p className="text-sm font-medium text-muted-foreground">Phone:</p>
                <p className="text-sm">{employee.phone || "N/A"}</p>
                
                <p className="text-sm font-medium text-muted-foreground">Date of Birth:</p>
                <p className="text-sm">
                  {employee.date_of_birth 
                    ? format(new Date(employee.date_of_birth), "MMM dd, yyyy")
                    : "N/A"}
                </p>
                
                <p className="text-sm font-medium text-muted-foreground">NI Number:</p>
                <p className="text-sm">{employee.ni_number || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-apple-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold tracking-tight">Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <p className="text-sm font-medium text-muted-foreground">Start Date:</p>
                <p className="text-sm">
                  {employee.employment_start_date
                    ? format(new Date(employee.employment_start_date), "MMM dd, yyyy")
                    : "N/A"}
                </p>
                
                <p className="text-sm font-medium text-muted-foreground">Status:</p>
                <div>
                  <Badge 
                    variant={getEmploymentStatusConfig(employee.employment_status).variant}
                    className="rounded-full px-3 py-1"
                  >
                    {getEmploymentStatusConfig(employee.employment_status).label}
                  </Badge>
                </div>
                
                <p className="text-sm font-medium text-muted-foreground">Service Type:</p>
                <p className="text-sm">{employee.service_type || "N/A"}</p>
                
                <p className="text-sm font-medium text-muted-foreground">Local Authority:</p>
                <p className="text-sm">{employee.local_authority || "N/A"}</p>
                
                <p className="text-sm font-medium text-muted-foreground">Max Capacity:</p>
                <p className="text-sm">{employee.max_capacity || "N/A"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <EmployeeDBSComplianceSection
          employeeId={id!}
          employeeEmail={employee.email}
          employeeName={`${employee.first_name} ${employee.last_name}`}
        />

        <EmployeeAssistantComplianceSection
          employeeId={id!}
          employeeEmail={employee.email}
          employeeName={`${employee.first_name} ${employee.last_name}`}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminEmployeeDetail;
