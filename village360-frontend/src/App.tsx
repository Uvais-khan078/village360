import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ProtectedRoute } from "@/components/auth/protected-route";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Projects from "@/pages/projects";
import GapAnalysis from "@/pages/gap-analysis";
import GISMap from "@/pages/gis-map";
import Reports from "@/pages/reports";
import Community from "@/pages/community";
import Admin from "@/pages/admin";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => <Login />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/projects">
        <ProtectedRoute>
          <Projects />
        </ProtectedRoute>
      </Route>
      
      <Route path="/gap-analysis">
        <ProtectedRoute roles={['admin', 'district_officer', 'block_officer']}>
          <GapAnalysis />
        </ProtectedRoute>
      </Route>
      
      <Route path="/gis-map">
        <ProtectedRoute>
          <GISMap />
        </ProtectedRoute>
      </Route>
      
      <Route path="/reports">
        <ProtectedRoute roles={['admin', 'district_officer', 'block_officer']}>
          <Reports />
        </ProtectedRoute>
      </Route>
      
      <Route path="/community">
        <ProtectedRoute>
          <Community />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin">
        <ProtectedRoute roles={['admin']}>
          <Admin />
        </ProtectedRoute>
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
