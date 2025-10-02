import { apiRequest } from "@/lib/queryClient";
import type { 
  LoginData, 
  RegisterData, 
  User, 
  Project, 
  Village, 
  Report, 
  DashboardStats,
  InsertProject,
  InsertVillage,
  InsertReport,
  ProjectWithDetails 
} from "@shared/schema";

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

// Auth API
export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiRequest("POST", "/api/auth/login", data);
    return response.json();
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiRequest("POST", "/api/auth/register", data);
    return response.json();
  },

  getMe: async (): Promise<Omit<User, 'password'>> => {
    const response = await apiRequest("GET", "/api/auth/me");
    return response.json();
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiRequest("GET", "/api/dashboard/stats");
    return response.json();
  },
};

// Projects API
export const projectsApi = {
  getAll: async (): Promise<ProjectWithDetails[]> => {
    const response = await apiRequest("GET", "/api/projects");
    return response.json();
  },

  getById: async (id: string): Promise<ProjectWithDetails> => {
    const response = await apiRequest("GET", `/api/projects/${id}`);
    return response.json();
  },

  create: async (data: InsertProject): Promise<Project> => {
    const response = await apiRequest("POST", "/api/projects", data);
    return response.json();
  },

  update: async (id: string, data: Partial<InsertProject>): Promise<Project> => {
    const response = await apiRequest("PUT", `/api/projects/${id}`, data);
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest("DELETE", `/api/projects/${id}`);
  },
};

// Villages API
export const villagesApi = {
  getAll: async (): Promise<Village[]> => {
    const response = await apiRequest("GET", "/api/villages");
    return response.json();
  },

  getById: async (id: string): Promise<Village> => {
    const response = await apiRequest("GET", `/api/villages/${id}`);
    return response.json();
  },

  create: async (data: InsertVillage): Promise<Village> => {
    const response = await apiRequest("POST", "/api/villages", data);
    return response.json();
  },
};

// Reports API
export const reportsApi = {
  getAll: async (): Promise<Report[]> => {
    const response = await apiRequest("GET", "/api/reports");
    return response.json();
  },

  create: async (data: InsertReport): Promise<Report> => {
    const response = await apiRequest("POST", "/api/reports", data);
    return response.json();
  },
};
