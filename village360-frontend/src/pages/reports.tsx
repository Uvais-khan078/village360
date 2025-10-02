import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Plus, Search } from "lucide-react";
import { reportsApi } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const { } = useAuth();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["/api/reports"],
    queryFn: () => reportsApi.getAll(),
  });

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || report.reportType === typeFilter;
    return matchesSearch && matchesType;
  });

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case "progress": return "bg-primary/10 text-primary";
      case "completion": return "bg-secondary/10 text-secondary";
      case "gap_analysis": return "bg-accent/10 text-accent";
      case "monthly": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatReportType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Quick report generation functions
  const generateQuickReport = async (type: string) => {
    // This would typically make an API call to generate the report
    console.log(`Generating ${type} report...`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <ProtectedRoute roles={['admin', 'district_officer', 'block_officer']}>
      <div className="flex h-screen bg-background">
        <Sidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header 
            title="Reports" 
            subtitle="Generate and manage project reports and analytics" 
          />
          
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => generateQuickReport('project_status')}>
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Project Status</h3>
                  <p className="text-sm text-muted-foreground">Current status of all projects</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => generateQuickReport('gap_analysis')}>
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 text-accent mx-auto mb-2" />
                  <h3 className="font-semibold">Gap Analysis</h3>
                  <p className="text-sm text-muted-foreground">Infrastructure gaps by village</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => generateQuickReport('completion_summary')}>
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <h3 className="font-semibold">Completion Summary</h3>
                  <p className="text-sm text-muted-foreground">Completed projects summary</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => generateQuickReport('monthly_report')}>
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-semibold">Monthly Report</h3>
                  <p className="text-sm text-muted-foreground">Comprehensive monthly overview</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-1 gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-reports"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="progress">Progress Reports</SelectItem>
                    <SelectItem value="completion">Completion Reports</SelectItem>
                    <SelectItem value="gap_analysis">Gap Analysis</SelectItem>
                    <SelectItem value="monthly">Monthly Reports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button data-testid="button-create-report">
                <Plus className="w-4 h-4 mr-2" />
                Create Report
              </Button>
            </div>

            {/* Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle>Generated Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredReports.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No reports found</h3>
                    <p className="text-muted-foreground">
                      {reports.length === 0 
                        ? "No reports have been generated yet. Create your first report above."
                        : "No reports match your search criteria."
                      }
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id} data-testid={`report-row-${report.id}`}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{report.title}</p>
                              {report.content && (
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {report.content}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getReportTypeColor(report.reportType!)}>
                              {formatReportType(report.reportType!)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(report.createdAt!).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {/* This would show the actual creator name from joined data */}
                              System User
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                data-testid={`button-download-${report.id}`}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                data-testid={`button-view-${report.id}`}
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
