import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DBSCertificateHealthCard } from "@/components/admin/DBSCertificateHealthCard";
import { GlobalComplianceDashboard } from "@/components/admin/GlobalComplianceDashboard";
import AdminLayout from "@/components/admin/AdminLayout";

interface DashboardMetrics {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  todayApplications: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    todayApplications: 0,
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data: applications, error } = await supabase
        .from('childminder_applications' as any)
        .select('status, created_at');

      if (error) throw error;

      const appData = (applications || []) as unknown as Array<{ status: string; created_at: string }>;
      const today = new Date().toDateString();
      const todayApps = appData.filter(
        app => new Date(app.created_at).toDateString() === today
      ).length || 0;

      const pending = appData.filter(app => app.status === 'pending').length || 0;
      const approved = appData.filter(app => app.status === 'approved').length || 0;
      const rejected = appData.filter(app => app.status === 'rejected').length || 0;

      setMetrics({
        totalApplications: appData.length || 0,
        pendingApplications: pending,
        approvedApplications: approved,
        rejectedApplications: rejected,
        todayApplications: todayApps,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const metricCards = [
    {
      title: "Total Applications",
      value: metrics.totalApplications,
      icon: FileText,
      description: "All time applications",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Pending Review",
      value: metrics.pendingApplications,
      icon: Clock,
      description: "Awaiting review",
      gradient: "from-amber-500 to-amber-600",
    },
    {
      title: "Approved",
      value: metrics.approvedApplications,
      icon: CheckCircle,
      description: "Approved applications",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Rejected",
      value: metrics.rejectedApplications,
      icon: XCircle,
      description: "Rejected applications",
      gradient: "from-rose-500 to-rose-600",
    },
    {
      title: "Today's Applications",
      value: metrics.todayApplications,
      icon: Users,
      description: "Submitted today",
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="mb-8">
          <div className="h-8 w-64 bg-muted rounded-xl animate-shimmer mb-2" />
          <div className="h-5 w-96 bg-muted rounded-lg animate-shimmer" />
        </div>

        <div className="mb-8 space-y-4">
          <div className="rounded-2xl border-0 bg-card shadow-apple-sm p-6">
            <div className="flex items-center justify-center py-12">
              <div className="w-40 h-40 rounded-full bg-muted animate-shimmer" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-2xl border-0 bg-card shadow-apple-sm p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-muted rounded-lg animate-shimmer" />
                  <div className="w-12 h-12 rounded-xl bg-muted animate-shimmer" />
                </div>
                <div className="h-10 w-24 bg-muted rounded-lg animate-shimmer" />
                <div className="h-4 w-40 bg-muted rounded-lg animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-primary to-secondary" />
          <span className="text-sm font-medium text-primary uppercase tracking-widest">Admin Dashboard</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Welcome back, Admin
        </h2>
        <p className="text-muted-foreground text-lg">
          Monitor and manage childminder operations in real-time
        </p>
      </div>

      {/* DBS Certificate Health */}
      <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <DBSCertificateHealthCard />
      </div>

      {/* Global DBS Compliance Dashboard */}
      <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <GlobalComplianceDashboard />
      </div>

      {/* Application Statistics */}
      <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary to-secondary" />
          Application Overview
        </h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((metric, index) => (
          <Card 
            key={metric.title} 
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-hover hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 animate-fade-in"
            style={{ animationDelay: `${0.4 + index * 0.1}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300`}>
                <metric.icon className="h-7 w-7 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-5xl font-bold tracking-tight mb-2 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                {metric.value}
              </div>
              <p className="text-sm text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
