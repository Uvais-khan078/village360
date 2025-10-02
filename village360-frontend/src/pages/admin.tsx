import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, Plus, Search, Edit, Trash2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Mock user data - in real app this would come from API
// const mockUsers = [
//   {
//     id: "1",
//     username: "admin_user",
//     email: "admin@pmajay.gov.in",
//     role: "admin",
//     district: "Uttar Pradesh",
//     block: "Central",
//     createdAt: "2024-01-15T10:30:00Z",
//     lastLogin: "2024-12-15T14:20:00Z"
//   },
//   {
//     id: "2",
//     username: "district_officer_up",
//     email: "do.up@pmajay.gov.in",
//     role: "district_officer",
//     district: "Uttar Pradesh",
//     block: "North",
//     createdAt: "2024-02-10T09:15:00Z",
//     lastLogin: "2024-12-14T16:45:00Z"
//   },
//   {
//     id: "3",
//     username: "block_officer_1",
//     email: "bo1@pmajay.gov.in",
//     role: "block_officer",
//     district: "Uttar Pradesh",
//     block: "South",
//     createdAt: "2024-03-05T11:20:00Z",
//     lastLogin: "2024-12-13T13:30:00Z"
//   },
// ];

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const { toast } = useToast();

// Real API call for users
const { data: users = [], isLoading, error } = useQuery({
  queryKey: ["/api/admin/users"],
  queryFn: () => apiRequest("GET", "/api/admin/users").then(res => res.json()),
});

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "default";
      case "district_officer": return "secondary";
      case "block_officer": return "outline";
      case "public_viewer": return "secondary";
      default: return "outline";
    }
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleCreateUser = async () => {
    try {
      // Mock API call - replace with real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "User created",
        description: "New user has been created successfully.",
      });

      setIsCreateUserOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      // Mock API call - replace with real implementation
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: "User deleted",
        description: "User has been removed from the system.",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading admin panel...</p>
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
            <p>Error loading admin data. No data available.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <ProtectedRoute roles={['admin']}>
      <div className="flex h-screen bg-background">
        <Sidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header 
            title="Admin Panel" 
            subtitle="Manage users, system settings and configurations" 
          />
          
          <div className="flex-1 overflow-auto p-6">
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList>
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="settings">System Settings</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-6">
                {/* User Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                          <p className="text-2xl font-bold">{users.length}</p>
                        </div>
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Admins</p>
                          <p className="text-2xl font-bold">{users.filter((u: any) => u.role === 'admin').length}</p>
                        </div>
                        <Shield className="w-8 h-8 text-destructive" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Officers</p>
                          <p className="text-2xl font-bold">
                            {users.filter((u: any) => ['district_officer', 'block_officer'].includes(u.role)).length}
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-secondary" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Public Users</p>
                          <p className="text-2xl font-bold">{users.filter((u: any) => u.role === 'public_viewer').length}</p>
                        </div>
                        <Users className="w-8 h-8 text-accent" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* User Management */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>User Management</CardTitle>
                      <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                        <DialogTrigger asChild>
                          <Button data-testid="button-create-user">
                            <Plus className="w-4 h-4 mr-2" />
                            Add User
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="username">Username</Label>
                              <Input id="username" placeholder="Enter username" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" type="email" placeholder="Enter email" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="role">Role</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Administrator</SelectItem>
                                  <SelectItem value="district_officer">District Officer</SelectItem>
                                  <SelectItem value="block_officer">Block Officer</SelectItem>
                                  <SelectItem value="public_viewer">Public Viewer</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="district">District</Label>
                                <Input id="district" placeholder="Enter district" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="block">Block</Label>
                                <Input id="block" placeholder="Enter block" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="password">Password</Label>
                              <Input id="password" type="password" placeholder="Enter password" />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleCreateUser} className="flex-1">
                                Create User
                              </Button>
                              <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Filters */}
                    <div className="flex gap-4 items-center mb-6">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                          data-testid="input-search-users"
                        />
                      </div>
                      
                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="admin">Administrators</SelectItem>
                          <SelectItem value="district_officer">District Officers</SelectItem>
                          <SelectItem value="block_officer">Block Officers</SelectItem>
                          <SelectItem value="public_viewer">Public Viewers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Users Table */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user: any) => (
                          <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{user.username}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getRoleBadgeVariant(user.role)}>
                                {formatRole(user.role)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>{user.district}</p>
                                {user.block && <p className="text-muted-foreground">{user.block}</p>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              data-testid={`button-edit-${user.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleDeleteUser}
                              data-testid={`button-delete-${user.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Automatic Backups</h3>
                          <p className="text-sm text-muted-foreground">Enable daily database backups</p>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-muted-foreground">System alert notifications</p>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Data Export</h3>
                          <p className="text-sm text-muted-foreground">Export system data to CSV/PDF</p>
                        </div>
                        <Button variant="outline" size="sm">Export</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Session Timeout</h3>
                          <p className="text-sm text-muted-foreground">Current: 24 hours</p>
                        </div>
                        <Button variant="outline" size="sm">Modify</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Password Policy</h3>
                          <p className="text-sm text-muted-foreground">Minimum 8 characters, special chars required</p>
                        </div>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Two-Factor Authentication</h3>
                          <p className="text-sm text-muted-foreground">Enable 2FA for all admin users</p>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
