import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { villagesApi, projectsApi } from "@/lib/api";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any;
  }
}

export function VillageMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);

  const { data: villages = [] } = useQuery({
    queryKey: ["/api/villages"],
    queryFn: () => villagesApi.getAll(),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: () => projectsApi.getAll(),
  });

  useEffect(() => {
    const loadLeaflet = async () => {
      // Load Leaflet CSS and JS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.L || mapInstanceRef.current) return;

      // Initialize map centered on Uttar Pradesh, India
      const map = window.L.map(mapRef.current).setView([26.8467, 80.9462], 8);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add village markers
      villages.forEach((village) => {
        const villageProjects = projects.filter(p => p.villageId === village.id);
        const completedCount = villageProjects.filter(p => p.status === 'completed').length;
        const delayedCount = villageProjects.filter(p => p.status === 'delayed').length;
        const activeCount = villageProjects.filter(p => p.status === 'ongoing').length;

        let markerColor = '#2563eb'; // Default blue
        if (delayedCount > 0) {
          markerColor = '#dc2626'; // Red for delays
        } else if (completedCount > activeCount) {
          markerColor = '#059669'; // Green for mostly completed
        }

        const marker = window.L.circleMarker([
          parseFloat(village.latitude), 
          parseFloat(village.longitude)
        ], {
          color: markerColor,
          fillColor: markerColor,
          fillOpacity: 0.7,
          radius: 8
        }).addTo(map);

        marker.bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-lg">${village.name}</h3>
            <p class="text-sm text-gray-600">${village.district}, ${village.block}</p>
            <p class="text-sm text-gray-600">${villageProjects.length} projects</p>
            <div class="mt-2 text-xs">
              <div class="text-green-600">Completed: ${completedCount}</div>
              <div class="text-blue-600">Active: ${activeCount}</div>
              <div class="text-red-600">Delayed: ${delayedCount}</div>
            </div>
          </div>
        `);
      });
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [villages, projects]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Village & Project Locations</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" data-testid="button-filter-map">
              Filter
            </Button>
            <Button size="sm" data-testid="button-fullscreen-map">
              Full Screen
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef} 
          className="h-96 rounded-lg border border-border bg-muted"
          data-testid="map-container"
        />
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span>Completed Projects</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Active Projects</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <span>Delayed Projects</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
