import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProjectChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadChart = async () => {
      if (!chartRef.current) return;
      
      // Dynamically import Chart.js
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      const ctx = chartRef.current;
      
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Completed Projects',
            data: [12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 45, 48],
            borderColor: 'hsl(5 150 105)',
            backgroundColor: 'hsl(5 150 105 / 0.1)',
            tension: 0.4,
            fill: true
          }, {
            label: 'In Progress',
            data: [25, 30, 35, 40, 42, 45, 48, 50, 52, 55, 58, 60],
            borderColor: 'hsl(30 64 175)',
            backgroundColor: 'hsl(30 64 175 / 0.1)',
            tension: 0.4,
            fill: true
          }, {
            label: 'Delayed',
            data: [5, 6, 4, 7, 8, 6, 5, 4, 6, 7, 5, 4],
            borderColor: 'hsl(239 68 68)',
            backgroundColor: 'hsl(239 68 68 / 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                padding: 20
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'hsl(226 232 240)'
              }
            },
            x: {
              grid: {
                color: 'hsl(226 232 240)'
              }
            }
          },
          elements: {
            point: {
              radius: 4,
              hoverRadius: 6
            }
          }
        }
      });
    };

    loadChart();
  }, []);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Project Status Overview</CardTitle>
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <canvas ref={chartRef} data-testid="chart-project-status"></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
