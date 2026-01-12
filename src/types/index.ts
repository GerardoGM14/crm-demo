export type Role = 'ADMIN' | 'MANAGER' | 'SALES';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST';
  createdAt: string;
  assignedTo?: string; // User ID
}

export interface Opportunity {
  id: string;
  title: string;
  value: number;
  stage: 'PROSPECTING' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
  leadId: string;
  createdAt: string;
  expectedCloseDate: string;
}

export interface Activity {
  id: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE';
  description: string;
  date: string;
  relatedTo: string; // Lead ID or Opportunity ID
  createdBy: string; // User ID
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedTo: string; // User ID
}

export interface Message {
  id: string;
  from: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  avatar?: string;
}
