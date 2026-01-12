import type { User, Lead, Opportunity, Activity } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  USERS: 'crm_users',
  LEADS: 'crm_leads',
  OPPORTUNITIES: 'crm_opportunities',
  ACTIVITIES: 'crm_activities',
  TASKS: 'crm_tasks',
  MESSAGES: 'crm_messages',
  CURRENT_USER: 'crm_current_user',
};

// Mock Initial Data
const INITIAL_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@crm.com', role: 'ADMIN', avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff' },
  { id: '2', name: 'Manager User', email: 'manager@crm.com', role: 'MANAGER', avatar: 'https://ui-avatars.com/api/?name=Manager+User&background=random' },
  { id: '3', name: 'Sales User', email: 'sales@crm.com', role: 'SALES', avatar: 'https://ui-avatars.com/api/?name=Sales+User&background=random' },
];

const INITIAL_LEADS: Lead[] = [
  { id: uuidv4(), name: 'John Doe', email: 'john@example.com', phone: '+1 555-0100', company: 'Tech Corp', status: 'NEW', createdAt: '2023-10-01T10:00:00Z' },
  { id: uuidv4(), name: 'Jane Smith', email: 'jane@design.com', phone: '+1 555-0101', company: 'Design Studio', status: 'CONTACTED', createdAt: '2023-10-02T11:30:00Z' },
  { id: uuidv4(), name: 'Robert Johnson', email: 'robert@finance.inc', phone: '+1 555-0102', company: 'Finance Inc', status: 'QUALIFIED', createdAt: '2023-10-03T09:15:00Z' },
  { id: uuidv4(), name: 'Emily Davis', email: 'emily@marketing.co', phone: '+1 555-0103', company: 'Marketing Co', status: 'LOST', createdAt: '2023-10-04T14:20:00Z' },
  { id: uuidv4(), name: 'Michael Brown', email: 'michael@logistics.net', phone: '+1 555-0104', company: 'Logistics Net', status: 'NEW', createdAt: '2023-10-05T16:45:00Z' },
  { id: uuidv4(), name: 'Sarah Wilson', email: 'sarah@edu.org', phone: '+1 555-0105', company: 'Education Org', status: 'CONTACTED', createdAt: '2023-10-06T13:10:00Z' },
  { id: uuidv4(), name: 'David Miller', email: 'david@construct.com', phone: '+1 555-0106', company: 'Construction Ltd', status: 'QUALIFIED', createdAt: '2023-10-07T10:05:00Z' },
  { id: uuidv4(), name: 'Jessica Taylor', email: 'jessica@retail.store', phone: '+1 555-0107', company: 'Retail Store', status: 'NEW', createdAt: '2023-10-08T11:55:00Z' },
];

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  { id: uuidv4(), title: 'Enterprise License Deal', value: 50000, stage: 'NEGOTIATION', leadId: INITIAL_LEADS[2].id, createdAt: '2023-10-10T09:00:00Z', expectedCloseDate: '2023-11-15' },
  { id: uuidv4(), title: 'Website Redesign', value: 12000, stage: 'PROSPECTING', leadId: INITIAL_LEADS[1].id, createdAt: '2023-10-12T14:30:00Z', expectedCloseDate: '2023-12-01' },
  { id: uuidv4(), title: 'Consulting Project', value: 8500, stage: 'CLOSED_WON', leadId: INITIAL_LEADS[6].id, createdAt: '2023-10-15T11:00:00Z', expectedCloseDate: '2023-10-25' },
  { id: uuidv4(), title: 'Annual Maintenance', value: 3500, stage: 'CLOSED_LOST', leadId: INITIAL_LEADS[3].id, createdAt: '2023-10-18T16:00:00Z', expectedCloseDate: '2023-10-20' },
  { id: uuidv4(), title: 'Mobile App Development', value: 25000, stage: 'PROSPECTING', leadId: INITIAL_LEADS[0].id, createdAt: '2023-10-20T10:30:00Z', expectedCloseDate: '2023-12-15' },
];

const INITIAL_TASKS: any[] = [
  { id: uuidv4(), title: 'Follow up with John Doe', description: 'Discuss contract details', dueDate: '2023-10-25', priority: 'HIGH', status: 'PENDING', assignedTo: '1' },
  { id: uuidv4(), title: 'Prepare Q4 Report', description: 'Gather metrics from all departments', dueDate: '2023-10-28', priority: 'MEDIUM', status: 'IN_PROGRESS', assignedTo: '1' },
];

const INITIAL_MESSAGES: any[] = [
  { id: uuidv4(), from: 'John Doe', subject: 'Re: Contract Proposal', content: 'Hi, I reviewed the proposal and have a few questions about the service level agreement. Can we discuss?', date: '2023-10-20T10:30:00Z', read: false, avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random' },
  { id: uuidv4(), from: 'Support Team', subject: 'System Maintenance', content: 'Scheduled maintenance this weekend.', date: '2023-10-22T09:00:00Z', read: true, avatar: 'https://ui-avatars.com/api/?name=Support+Team&background=random' },
];

export const storage = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token: string) => localStorage.setItem('token', token),
  clearToken: () => localStorage.removeItem('token'),
  
  getUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userStr ? JSON.parse(userStr) : null;
  },
  setUser: (user: User) => localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(STORAGE_KEYS.CURRENT_USER),

  // Generic DB operations
  getAll: <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },
  
  saveAll: <T>(key: string, data: T[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // Initialize DB
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEADS) || JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS) || '[]').length === 0) {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES) || JSON.parse(localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES) || '[]').length === 0) {
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(INITIAL_OPPORTUNITIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) localStorage.setItem(STORAGE_KEYS.ACTIVITIES, '[]');
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
  },

  KEYS: STORAGE_KEYS,
};
