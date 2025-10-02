import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { villagesApi } from "@/lib/api";
import { ProtectedRoute } from "@/components/auth/protected-route";

const amenityTypes = [
  { type: "education", label: "Education", icon: "🏫" },
  { type: "water", label: "Water Supply", icon: "💧" },
  { type: "healthcare", label: "Healthcare", icon: "🏥" },
  { type: "electricity", label: "Electricity", icon: "⚡" },
  { type: "roads", label: "Roads", icon: "🛣️" },
];

export default function GapAnalysis() {
  const { data: villages = [], isLoading, error } = useQuery({
    queryKey: ["/api/villages"],
    queryFn: () => villagesApi.getAll(),
  });

  const getGapSeverity = (available: number, required: number) => {
    const percentage = (available / required) * 100;
    if (percentage >= 100) return { level: "good", color: "bg-secondary" };
    if (percentage >= 70) return { level: "moderate", color: "bg-accent" };
    return { level: "critical", color: "bg-destructive" };
  };

  const getOverallGapSummary = () => {
    const summary: Record<string, { available: number; required: number }> = {};

    villages.forEach((village: any) => {
      if (!village.amenities) return;
      village.amenities.forEach((amenity: any) => {
        if (!summary[amenity.type]) {
          summary[amenity.type] = { available: 0, required: 0 };
        }
        summary[amenity.type].available += amenity.available;
        summary[amenity.type].required += amenity.required;
      });
    });

    return summary;
  };

  const overallSummary = getOverallGapSummary();

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading gap analysis...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-destructive">
            <p>Error loading gap analysis data. No data available.</p>
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
            title="Gap Analysis" 
            subtitle="Analyze missing amenities and infrastructure gaps across villages" 
          />
          
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* Filters */}
            <div className="flex gap-4 items-center">
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  <SelectItem value="district1">District 1</SelectItem>
                  <SelectItem value="district2">District 2</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Amenities</SelectItem>
                  {amenityTypes.map(amenity => (
                    <SelectItem key={amenity.type} value={amenity.type}>
                      {amenity.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Overall Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {amenityTypes.map(amenity => {
                const data = overallSummary[amenity.type] || { available: 0, required: 0 };
                const percentage = data.required > 0 ? (data.available / data.required) * 100 : 0;
                const severity = getGapSeverity(data.available, data.required);
                
                return (
                  <Card key={amenity.type} data-testid={`summary-${amenity.type}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{amenity.icon}</span>
                        <Badge variant={severity.level === "good" ? "default" : severity.level === "moderate" ? "secondary" : "destructive"}>
                          {Math.round(percentage)}%
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm">{amenity.label}</h3>
                      <p className="text-xs text-muted-foreground">
                        {data.available} of {data.required} available
                      </p>
                      <Progress value={percentage} className="mt-2" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Village-wise Gap Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Village-wise Gap Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {villages.map(village => (
                    <div key={village.id} className="border rounded-lg p-4" data-testid={`village-gap-${village.id}`}>
                      <h3 className="text-lg font-semibold mb-4">{village.name}</h3>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {village.amenities?.map((amenity: any) => {
                          const amenityInfo = amenityTypes.find(a => a.type === amenity.type);
                          const percentage = amenity.required > 0 ? (amenity.available / amenity.required) * 100 : 0;
                          const severity = getGapSeverity(amenity.available, amenity.required);

                          return (
                            <div key={amenity.type} className="border rounded-md p-3" data-testid={`amenity-${village.id}-${amenity.type}`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-lg">{amenityInfo?.icon}</span>
                                <Badge
                                  variant={severity.level === "good" ? "default" : severity.level === "moderate" ? "secondary" : "destructive"}
                                >
                                  {Math.round(percentage)}%
                                </Badge>
                              </div>
                              <h4 className="font-medium text-sm">{amenityInfo?.label}</h4>
                              <p className="text-xs text-muted-foreground">
                                {amenity.available} / {amenity.required}
                              </p>
                              <Progress value={percentage} className="mt-2" />
                              {amenity.available < amenity.required && (
                                <p className="text-xs text-destructive mt-1">
                                  Gap: {amenity.required - amenity.available}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
