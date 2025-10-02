import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, MapPin, Calendar } from "lucide-react";
import { projectsApi, dashboardApi } from "@/lib/api";
import { useState } from "react";

export default function Community() {
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: () => projectsApi.getAll(),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: () => dashboardApi.getStats(),
  });

  // Filter for completed and ongoing projects only (public transparency)
  const publicProjects = projects.filter(project => 
    ['completed', 'ongoing'].includes(project.status)
  );

  const filteredProjects = publicProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.village?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = districtFilter === "all" || 
      project.village?.district.toLowerCase().includes(districtFilter.toLowerCase());
    return matchesSearch && matchesDistrict;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-secondary" />;
      case "ongoing":
        return <Clock className="w-4 h-4 text-primary" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-secondary/10 text-secondary";
      case "ongoing":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatCurrency = (amount: string | number | null | undefined) => {
    if (!amount) return "Budget not disclosed";
    return `₹${parseFloat(amount.toString()).toLocaleString('en-IN')}`;
  };

  if (projectsLoading || statsLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading community dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Community Dashboard" 
          subtitle="Transparent view of development projects and their progress" 
        />
        
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Public Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Total Villages</p>
                    <p className="text-3xl font-bold text-foreground" data-testid="stat-total-villages">
                      {stats?.totalVillages || 0}
                    </p>
                    <p className="text-xs text-secondary mt-1">Under Development</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Projects in Progress</p>
                    <p className="text-3xl font-bold text-primary" data-testid="stat-active-projects">
                      {stats?.activeProjects || 0}
                    </p>
                    <p className="text-xs text-primary mt-1">Currently Active</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Completed Projects</p>
                    <p className="text-3xl font-bold text-secondary" data-testid="stat-completed-projects">
                      {stats?.completedProjects || 0}
                    </p>
                    <p className="text-xs text-secondary mt-1">Successfully Delivered</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Input
              placeholder="Search projects or villages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 max-w-md"
              data-testid="input-search-community"
            />
            
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                <SelectItem value="uttar pradesh">Uttar Pradesh</SelectItem>
                <SelectItem value="bihar">Bihar</SelectItem>
                <SelectItem value="rajasthan">Rajasthan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Projects Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Development Projects</h2>
              <p className="text-sm text-muted-foreground">
                Showing {filteredProjects.length} public projects
              </p>
            </div>

            {filteredProjects.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                  <p className="text-muted-foreground">
                    No projects match your current search criteria.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow" data-testid={`community-project-${project.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {project.village?.name}, {project.village?.district}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          {getStatusIcon(project.status)}
                          <Badge className={getStatusColor(project.status)}>
                            {project.status === 'completed' ? 'Completed' : 'In Progress'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {project.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.progress || 0}%</span>
                        </div>
                        <Progress value={project.progress || 0} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Budget</p>
                          <p className="text-sm font-medium">
                              {formatCurrency(project.budget)}
                            </p>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            {project.status === 'completed' ? 'Completed' : 'Target Date'}
                          </p>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <p className="text-sm font-medium">
                              {project.endDate ? 
                                new Date(project.endDate!).toLocaleDateString() : 
                                'Not specified'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
