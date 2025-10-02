export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'admin',
  district: 'Sample District',
  block: 'Sample Block',
  createdAt: new Date().toISOString(),
};

export const mockDashboardStats = {
  totalProjects: 25,
  activeProjects: 18,
  completedProjects: 7,
  totalVillages: 150,
  totalReports: 45,
  pendingTasks: 12,
  recentActivity: [
    { id: 1, type: 'project_created', message: 'New project started in Village A', timestamp: new Date().toISOString() },
    { id: 2, type: 'report_submitted', message: 'Monthly report submitted', timestamp: new Date().toISOString() },
    { id: 3, type: 'task_completed', message: 'Road construction completed', timestamp: new Date().toISOString() },
  ],
  notifications: [
    { id: 1, title: 'Budget Alert', message: 'Project budget exceeded', type: 'warning' },
    { id: 2, title: 'New Report', message: 'Community feedback received', type: 'info' },
  ]
};

export const mockProjects = [
  {
    id: 1,
    title: 'Village Infrastructure Project',
    description: 'Improving roads and water supply in rural areas',
    status: 'active',
    progress: 75,
    villageId: 1,
    budget: 50000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    createdAt: new Date().toISOString(),
    village: {
      id: 1,
      name: 'Village A',
      district: 'District 1',
      population: 2000,
      latitude: 28.6139,
      longitude: 77.2090,
      status: 'active'
    }
  },
  {
    id: 2,
    title: 'Education Initiative',
    description: 'Building new school facilities and providing educational resources',
    status: 'planning',
    progress: 10,
    villageId: 2,
    budget: 75000,
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    createdAt: new Date().toISOString(),
    village: {
      id: 2,
      name: 'Village B',
      district: 'District 1',
      population: 1800,
      latitude: 28.7041,
      longitude: 77.1025,
      status: 'active'
    }
  },
  {
    id: 3,
    title: 'Healthcare Center',
    description: 'Establishing a primary healthcare facility',
    status: 'completed',
    progress: 100,
    villageId: 3,
    budget: 100000,
    startDate: '2023-06-01',
    endDate: '2024-05-31',
    createdAt: new Date().toISOString(),
    village: {
      id: 3,
      name: 'Village C',
      district: 'District 2',
      population: 2500,
      latitude: 28.5355,
      longitude: 77.3910,
      status: 'active'
    }
  }
];

export const mockVillages = [
  {
    id: 1,
    name: 'Village A',
    district: 'District 1',
    population: 2000,
    latitude: 28.6139,
    longitude: 77.2090,
    status: 'active'
  },
  {
    id: 2,
    name: 'Village B',
    district: 'District 1',
    population: 1800,
    latitude: 28.7041,
    longitude: 77.1025,
    status: 'active'
  },
  {
    id: 3,
    name: 'Village C',
    district: 'District 2',
    population: 2500,
    latitude: 28.5355,
    longitude: 77.3910,
    status: 'active'
  },
  {
    id: 4,
    name: 'Village D',
    district: 'District 2',
    population: 1200,
    latitude: 28.4595,
    longitude: 77.0266,
    status: 'inactive'
  }
];

export const mockReports = [
  {
    id: 1,
    title: 'Monthly Progress Report',
    content: 'Project is progressing well with 75% completion. Community engagement is high.',
    reportType: 'progress',
    projectId: 1,
    createdAt: new Date().toISOString(),
    author: 'Field Officer'
  },
  {
    id: 2,
    title: 'Community Feedback',
    content: 'Villagers are satisfied with the infrastructure improvements. Water supply has improved significantly.',
    reportType: 'completion',
    projectId: 1,
    createdAt: new Date().toISOString(),
    author: 'Community Liaison'
  },
  {
    id: 3,
    title: 'Budget Utilization Report',
    content: '85% of allocated budget has been utilized. Remaining funds will be used for final inspections.',
    reportType: 'gap_analysis',
    projectId: 2,
    createdAt: new Date().toISOString(),
    author: 'Finance Officer'
  }
];

export const getMockData = (url: string, method: string, data?: any) => {
  if (method === 'POST' && url === '/api/auth/login') {
    if (data.username === 'testuser' && data.password === 'test@123') {
      return {
        token: 'mock-jwt-token-12345',
        user: mockUser
      };
    }
    throw new Error('Invalid credentials');
  }

  if (method === 'GET' && url === '/api/auth/me') {
    return mockUser;
  }

  if (method === 'GET' && url === '/api/dashboard/stats') {
    return mockDashboardStats;
  }

  if (method === 'GET' && url === '/api/projects') {
    return mockProjects;
  }

  if (method === 'GET' && url.startsWith('/api/projects/')) {
    const id = url.split('/').pop();
    return mockProjects.find(p => p.id === parseInt(id || '0')) || null;
  }

  if (method === 'GET' && url === '/api/villages') {
    return mockVillages;
  }

  if (method === 'GET' && url.startsWith('/api/villages/')) {
    const id = url.split('/').pop();
    return mockVillages.find(v => v.id === parseInt(id || '0')) || null;
  }

  if (method === 'GET' && url === '/api/reports') {
    return mockReports;
  }

  if (method === 'POST' && url === '/api/projects') {
    const newProject = { ...data, id: mockProjects.length + 1, createdAt: new Date().toISOString() };
    return newProject;
  }

  if (method === 'POST' && url === '/api/reports') {
    const newReport = { ...data, id: mockReports.length + 1, createdAt: new Date().toISOString() };
    return newReport;
  }

  // Default fallback
  return { message: 'Mock data not implemented for this endpoint' };
};
