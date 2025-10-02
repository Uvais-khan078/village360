import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// const mockAlerts: Alert[] = [
//   {
//     id: "1",
//     title: "Water Project Delayed",
//     village: "Rampur Village",
//     time: "2 hours ago",
//     type: "error"
//   },
//   {
//     id: "2",
//     title: "School Construction 80%",
//     village: "Bharatpur Village",
//     time: "5 hours ago",
//     type: "warning"
//   },
//   {
//     id: "3",
//     title: "Road Project Completed",
//     village: "Shivpur Village",
//     time: "1 day ago",
//     type: "success"
//   }
// ];

export function RecentAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* {mockAlerts.map((alert) => {
            const styles = getAlertStyles(alert.type);
            return (
              <div
                key={alert.id}
                className={`flex items-start space-x-3 p-3 ${styles.bg} rounded-lg border ${styles.border}`}
                data-testid={`alert-${alert.id}`}
              >
                <div className={`w-2 h-2 ${styles.dot} rounded-full mt-2`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{alert.title}</p>
                  <p className="text-xs text-muted-foreground">{alert.village}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </div>
            );
          })} */}
        </div>
        <Button 
          variant="ghost" 
          className="w-full mt-4 text-primary hover:text-primary/80"
          data-testid="button-view-all-alerts"
        >
          View all alerts
        </Button>
      </CardContent>
    </Card>
  );
}
