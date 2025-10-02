import { useQuery } from "@tanstack/react-query";
import { Building2, FolderOpen, CheckCircle, AlertTriangle } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ProjectChart } from "@/components/dashboard/project-chart";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";
import { ProjectsTable } from "@/components/dashboard/projects-table";
import { VillageMap } from "@/components/maps/village-map";
import { dashboardApi } from "@/lib/api";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: () => dashboardApi.getStats(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Dashboard" 
          subtitle="Welcome back, monitor your villages and projects" 
        />
        
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Villages"
              value={stats?.totalVillages || 0}
              subtitle="↗ 12 new this month"
              icon={Building2}
              iconColor="text-primary"
            />
            <StatsCard
              title="Active Projects"
              value={stats?.activeProjects || 0}
              subtitle="↗ 23% from last month"
              icon={FolderOpen}
              iconColor="text-secondary"
            />
            <StatsCard
              title="Completed Projects"
              value={stats?.completedProjects || 0}
              subtitle="↗ 8% completion rate"
              icon={CheckCircle}
              iconColor="text-accent"
            />
            <StatsCard
              title="Delayed Projects"
              value={stats?.delayedProjects || 0}
              subtitle="⚠ Needs attention"
              icon={AlertTriangle}
              iconColor="text-destructive"
              valueColor="text-destructive"
            />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ProjectChart />
            <RecentAlerts />
          </div>

          {/* Projects Table */}
          <ProjectsTable />

          {/* Map Section */}
          <VillageMap />
        </div>
      </main>
    </div>
  );
}
