import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Filter } from "lucide-react";
import { projectsApi } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { hasRole } = useAuth();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: () => projectsApi.getAll(),
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.village?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "ongoing": return "secondary";  
      case "delayed": return "destructive";
      case "planning": return "outline";
      default: return "outline";
    }
  };

  const getBudgetDisplay = (budget: string | null | undefined) => {
    if (!budget) return "No budget set";
    return `₹${parseFloat(budget).toLocaleString('en-IN')}`;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading projects...</p>
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
          title="Project Management" 
          subtitle="Monitor and manage development projects across villages" 
        />
        
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects or villages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-projects"
                />
              </div>
              
              <Button variant="outline" size="sm" data-testid="button-filter">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            
            {hasRole(['admin', 'district_officer', 'block_officer']) && (
              <Button data-testid="button-add-project">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            )}
          </div>

          {/* Project Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { status: "all", label: "All Projects", count: projects.length },
              { status: "ongoing", label: "In Progress", count: projects.filter(p => p.status === "ongoing").length },
              { status: "completed", label: "Completed", count: projects.filter(p => p.status === "completed").length },
              { status: "delayed", label: "Delayed", count: projects.filter(p => p.status === "delayed").length },
            ].map((filter) => (
              <Button
                key={filter.status}
                variant={statusFilter === filter.status ? "default" : "outline"}
                onClick={() => setStatusFilter(filter.status)}
                className="flex flex-col h-auto p-4"
                data-testid={`filter-${filter.status}`}
              >
                <span className="text-2xl font-bold">{filter.count}</span>
                <span className="text-sm">{filter.label}</span>
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">No projects found</p>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow" data-testid={`project-card-${project.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                      <Badge variant={getStatusVariant(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Village:</span>
                        <span className="font-medium">{project.village?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-medium">{getBudgetDisplay(project.budget)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span className="font-medium">
                          {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress || 0}%</span>
                      </div>
                      <Progress value={project.progress || 0} />
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" data-testid={`button-view-${project.id}`}>
                        View Details
                      </Button>
                      {hasRole(['admin', 'district_officer', 'block_officer']) && (
                        <Button variant="outline" size="sm" className="flex-1" data-testid={`button-edit-${project.id}`}>
                          Edit
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
