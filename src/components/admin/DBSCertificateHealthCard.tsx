import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { differenceInDays } from "date-fns";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

interface HealthMetrics {
  healthScore: number;
  valid: { count: number; percentage: number };
  expiring: { count: number; percentage: number };
  expired: { count: number; percentage: number };
  total: number;
}

export const DBSCertificateHealthCard = () => {
  const [metrics, setMetrics] = useState<HealthMetrics>({
    healthScore: 0,
    valid: { count: 0, percentage: 0 },
    expiring: { count: 0, percentage: 0 },
    expired: { count: 0, percentage: 0 },
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificateHealth();
  }, []);

  const fetchCertificateHealth = async () => {
    try {
      const today = new Date();

      // Fetch household members (applicants)
      const { data: householdMembers } = await supabase
        .from('household_member_dbs_tracking')
        .select('dbs_certificate_expiry_date, full_name, member_type, dbs_status')
        .not('dbs_certificate_expiry_date', 'is', null);

      // Fetch employees
      const { data: employees } = await supabase
        .from('employees')
        .select('dbs_certificate_expiry_date, first_name, last_name, employment_status')
        .eq('employment_status', 'active')
        .not('dbs_certificate_expiry_date', 'is', null);

      // Fetch employee household members
      const { data: employeeHousehold } = await supabase
        .from('employee_household_members')
        .select('dbs_certificate_expiry_date, full_name, dbs_status')
        .not('dbs_certificate_expiry_date', 'is', null);

      // Combine all certificates
      const allCertificates = [
        ...(householdMembers || []).map(m => ({ expiryDate: m.dbs_certificate_expiry_date })),
        ...(employees || []).map(e => ({ expiryDate: e.dbs_certificate_expiry_date })),
        ...(employeeHousehold || []).map(m => ({ expiryDate: m.dbs_certificate_expiry_date })),
      ];

      const total = allCertificates.length;

      if (total === 0) {
        setMetrics({
          healthScore: 0,
          valid: { count: 0, percentage: 0 },
          expiring: { count: 0, percentage: 0 },
          expired: { count: 0, percentage: 0 },
          total: 0,
        });
        setLoading(false);
        return;
      }

      // Categorize certificates
      let validCount = 0;
      let expiringCount = 0;
      let expiredCount = 0;

      allCertificates.forEach(cert => {
        const daysUntilExpiry = differenceInDays(new Date(cert.expiryDate), today);
        
        if (daysUntilExpiry < 0) {
          expiredCount++;
        } else if (daysUntilExpiry <= 90) {
          expiringCount++;
        } else {
          validCount++;
        }
      });

      const healthScore = Math.round((validCount / total) * 100);

      setMetrics({
        healthScore,
        valid: { 
          count: validCount, 
          percentage: Math.round((validCount / total) * 100) 
        },
        expiring: { 
          count: expiringCount, 
          percentage: Math.round((expiringCount / total) * 100) 
        },
        expired: { 
          count: expiredCount, 
          percentage: Math.round((expiredCount / total) * 100) 
        },
        total,
      });
    } catch (error) {
      console.error("Error fetching certificate health:", error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = () => {
    if (metrics.healthScore >= 80) return "hsl(var(--chart-2))"; // Green
    if (metrics.healthScore >= 50) return "hsl(var(--chart-3))"; // Amber
    return "hsl(var(--chart-1))"; // Red
  };

  const chartData = [
    {
      name: 'Health',
      value: metrics.healthScore,
      fill: getHealthColor(),
    },
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            DBS Certificate Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading certificate data...</div>
        </CardContent>
      </Card>
    );
  }

  if (metrics.total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            DBS Certificate Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No certificates tracked yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          DBS Certificate Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-[200px_1fr] gap-6 items-center">
          {/* Circular Progress */}
          <div className="flex flex-col items-center justify-center">
            <ResponsiveContainer width={180} height={180}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={20}
                data={chartData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background={{ fill: 'hsl(var(--muted))' }}
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute">
              <div className="text-center">
                <div className="text-4xl font-bold" style={{ color: getHealthColor() }}>
                  {metrics.healthScore}%
                </div>
                <div className="text-sm text-muted-foreground">Health Score</div>
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="space-y-3">
            {/* Valid */}
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-green-900 dark:text-green-100">Valid</div>
                    <div className="text-xs text-green-700 dark:text-green-300">Valid for 90+ days</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {metrics.valid.count}
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300">
                    {metrics.valid.percentage}%
                  </div>
                </div>
              </div>
            </div>

            {/* Expiring */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <div>
                    <div className="text-sm font-medium text-amber-900 dark:text-amber-100">Expiring</div>
                    <div className="text-xs text-amber-700 dark:text-amber-300">Within 90 days</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                    {metrics.expiring.count}
                  </div>
                  <div className="text-xs text-amber-700 dark:text-amber-300">
                    {metrics.expiring.percentage}%
                  </div>
                </div>
              </div>
            </div>

            {/* Expired */}
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="text-sm font-medium text-red-900 dark:text-red-100">Expired</div>
                    <div className="text-xs text-red-700 dark:text-red-300">Past expiry date</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                    {metrics.expired.count}
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-300">
                    {metrics.expired.percentage}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground text-center">
          Tracking {metrics.total} total certificate{metrics.total !== 1 ? 's' : ''}
        </div>
      </CardContent>
    </Card>
  );
};
