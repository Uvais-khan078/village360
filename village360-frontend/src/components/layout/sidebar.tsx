import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  FolderOpen, 
  BarChart3, 
  MapPin, 
  FileText, 
  Users, 
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { 
    href: "/dashboard", 
    label: "Dashboard", 
    icon: LayoutDashboard,
    roles: ["admin", "district_officer", "block_officer", "public_viewer"]
  },
  { 
    href: "/projects", 
    label: "Projects", 
    icon: FolderOpen,
    roles: ["admin", "district_officer", "block_officer", "public_viewer"]
  },
  { 
    href: "/gap-analysis", 
    label: "Gap Analysis", 
    icon: BarChart3,
    roles: ["admin", "district_officer", "block_officer"]
  },
  { 
    href: "/gis-map", 
    label: "GIS Map", 
    icon: MapPin,
    roles: ["admin", "district_officer", "block_officer", "public_viewer"]
  },
  { 
    href: "/reports", 
    label: "Reports", 
    icon: FileText,
    roles: ["admin", "district_officer", "block_officer"]
  },
  { 
    href: "/community", 
    label: "Community", 
    icon: Users,
    roles: ["admin", "district_officer", "block_officer", "public_viewer"]
  },
  { 
    href: "/admin", 
    label: "Admin", 
    icon: Settings,
    roles: ["admin"]
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout, hasRole } = useAuth();

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "admin": return "Administrator";
      case "district_officer": return "District Officer";
      case "block_officer": return "Block Officer";
      case "public_viewer": return "Public Viewer";
      default: return role;
    }
  };

  const getUserInitials = (username?: string) => {
    return username ? username.slice(0, 2).toUpperCase() : "??";
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo and Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">V360</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Village 360</h1>
            <p className="text-sm text-muted-foreground">Monitoring System</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          if (!hasRole(item.roles)) return null;
          
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
              data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <span className="text-secondary-foreground font-medium text-sm">
              {getUserInitials(user?.username)}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {user?.role ? getRoleDisplay(user.role) : "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.district || "No District"}
            </p>
          </div>
          <button 
            onClick={logout}
            className="p-1 hover:bg-muted rounded"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </aside>
  );
}
