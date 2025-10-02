import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit } from "lucide-react";
import { projectsApi } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Progress } from "@/components/ui/progress";

export function ProjectsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const { hasRole } = useAuth();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: () => projectsApi.getAll(),
  });

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.village?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "ongoing":
        return "secondary";
      case "delayed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-secondary";
      case "ongoing":
        return "text-primary";
      case "delayed":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Projects</h3>
          <div className="flex items-center space-x-2">
            <Input 
              type="text" 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
              data-testid="input-search-projects"
            />
            {hasRole(['admin', 'district_officer', 'block_officer']) && (
              <Button data-testid="button-add-project">
                Add Project
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Village</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">No projects found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.slice(0, 10).map((project) => (
                  <TableRow key={project.id} data-testid={`project-row-${project.id}`}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{project.title}</p>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {project.village?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={project.progress || 0} className="flex-1" />
                        <span className="text-sm text-muted-foreground">
                          {project.progress || 0}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className={getStatusColor(project.status)}>
                      {project.endDate ? 
                        new Date(project.endDate).toLocaleDateString() : 
                        'No due date'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          data-testid={`button-view-project-${project.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {hasRole(['admin', 'district_officer', 'block_officer']) && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            data-testid={`button-edit-project-${project.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min(filteredProjects.length, 10)} of {filteredProjects.length} projects
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
