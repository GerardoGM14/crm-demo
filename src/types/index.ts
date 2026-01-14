export type Role = 'ADMIN' | 'MANAGER' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  specialty?: string; // Para doctores
  cmp?: string; // Colegio Médico del Perú
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dni: string; // Documento de Identidad
  email: string;
  phone: string;
  birthDate: string;
  gender: 'M' | 'F';
  address: string;
  bloodType?: string;
  allergies?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string; // Denormalized for display
  doctorId: string;
  date: string;
  type: 'CONSULTATION' | 'CHECKUP' | 'PROCEDURE' | 'EMERGENCY';
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
  symptoms?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  type: 'CONSULTATION' | 'LAB' | 'IMAGE' | 'PROCEDURE';
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
