export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';
  department: string;
  avatar?: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo_admin',
    email: 'admin@grcatlas.com',
    name: 'Sarah Johnson',
    role: 'admin',
    department: 'Security Operations',
    avatar: 'SJ'
  },
  {
    id: 'demo_user',
    email: 'user@grcatlas.com',
    name: 'Mike Chen',
    role: 'user',
    department: 'Risk Management',
    avatar: 'MC'
  },
  {
    id: 'demo_viewer',
    email: 'viewer@grcatlas.com',
    name: 'Emily Davis',
    role: 'viewer',
    department: 'Compliance',
    avatar: 'ED'
  },
  {
    id: 'demo_auditor',
    email: 'auditor@grcatlas.com',
    name: 'David Wilson',
    role: 'user',
    department: 'Internal Audit',
    avatar: 'DW'
  }
];

export function findDemoUser(email: string): DemoUser | undefined {
  return DEMO_USERS.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export function isDemoUser(email: string): boolean {
  return DEMO_USERS.some(user => user.email.toLowerCase() === email.toLowerCase());
}
