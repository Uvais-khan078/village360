import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { VillageMap } from "@/components/maps/village-map";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Maximize2, Layers, Filter } from "lucide-react";

export default function GISMap() {
  const [mapFilter, setMapFilter] = useState("all");
  const [layerFilter, setLayerFilter] = useState("projects");

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="GIS Map" 
          subtitle="Interactive map showing villages, projects, and infrastructure" 
        />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="h-full space-y-4">
            {/* Map Controls */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                <Select value={mapFilter} onValueChange={setMapFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Villages</SelectItem>
                    <SelectItem value="active">Active Projects</SelectItem>
                    <SelectItem value="completed">Completed Projects</SelectItem>
                    <SelectItem value="delayed">Delayed Projects</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={layerFilter} onValueChange={setLayerFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="projects">Project Status</SelectItem>
                    <SelectItem value="amenities">Amenities</SelectItem>
                    <SelectItem value="population">Population Density</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm" data-testid="button-advanced-filter">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filter
                </Button>
                
                <Button variant="outline" size="sm" data-testid="button-layers">
                  <Layers className="w-4 h-4 mr-2" />
                  Layers
                </Button>
              </div>
              
              <Button size="sm" data-testid="button-fullscreen">
                <Maximize2 className="w-4 h-4 mr-2" />
                Fullscreen
              </Button>
            </div>

            {/* Map Legend */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-secondary rounded-full"></div>
                    <span>Completed Projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>Active Projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <span>Delayed Projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                    <span>No Projects</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Map */}
            <div className="flex-1 min-h-[600px]">
              <VillageMap />
            </div>

            {/* Map Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">1,247</div>
                  <div className="text-sm text-muted-foreground">Total Villages</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">342</div>
                  <div className="text-sm text-muted-foreground">Active Projects</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">187</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-destructive">23</div>
                  <div className="text-sm text-muted-foreground">Delayed</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
