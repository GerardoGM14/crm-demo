import type { User, Patient, Appointment, Task, Message, MedicalRecord } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  USERS: 'crm_users',
  PATIENTS: 'crm_patients', // Changed from LEADS
  APPOINTMENTS: 'crm_appointments', // Changed from OPPORTUNITIES
  ACTIVITIES: 'crm_activities',
  TASKS: 'crm_tasks',
  MESSAGES: 'crm_messages',
  MEDICAL_RECORDS: 'crm_medical_records',
  CURRENT_USER: 'crm_current_user',
};

// Mock Initial Data
const INITIAL_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@crm.com', role: 'ADMIN', avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff' },
  { id: '2', name: 'Dr. Roberto Gomez', email: 'director@clinic.com', role: 'MANAGER', specialty: 'Cardiology', avatar: 'https://ui-avatars.com/api/?name=Roberto+Gomez&background=random' },
  { id: '3', name: 'Dr. Ana Martinez', email: 'ana@clinic.com', role: 'DOCTOR', specialty: 'Pediatrics', avatar: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=random' },
  { id: '4', name: 'Nurse Julia', email: 'julia@clinic.com', role: 'NURSE', avatar: 'https://ui-avatars.com/api/?name=Julia+R&background=random' },
];

const INITIAL_PATIENTS: Patient[] = [
  { id: uuidv4(), firstName: 'Juan', lastName: 'Perez', dni: '45678901', email: 'juan.perez@email.com', phone: '987654321', birthDate: '1980-05-15', gender: 'M', address: 'Av. Arequipa 123, Lima', bloodType: 'O+', allergies: 'Penicilina', status: 'ACTIVE', createdAt: '2023-10-01T10:00:00Z' },
  { id: uuidv4(), firstName: 'Maria', lastName: 'Rodriguez', dni: '78901234', email: 'maria.r@email.com', phone: '998877665', birthDate: '1992-11-20', gender: 'F', address: 'Jr. Union 456, Lima', bloodType: 'A-', status: 'ACTIVE', createdAt: '2023-10-02T11:30:00Z' },
  { id: uuidv4(), firstName: 'Carlos', lastName: 'Sanchez', dni: '12345678', email: 'carlos.s@email.com', phone: '912345678', birthDate: '1975-03-10', gender: 'M', address: 'Calle Los Pinos 789, Miraflores', status: 'INACTIVE', createdAt: '2023-10-03T09:15:00Z' },
  { id: uuidv4(), firstName: 'Elena', lastName: 'Gomez', dni: '23456789', email: 'elena.g@email.com', phone: '923456789', birthDate: '2015-08-25', gender: 'F', address: 'Av. Javier Prado 2020, San Borja', bloodType: 'B+', allergies: 'Nueces', status: 'ACTIVE', createdAt: '2023-10-04T14:20:00Z' },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: uuidv4(), patientId: INITIAL_PATIENTS[0].id, patientName: 'Juan Perez', doctorId: '2', date: '2023-10-25T10:00:00', type: 'CONSULTATION', status: 'CONFIRMED', notes: 'Routine checkup', symptoms: 'Mild chest pain' },
  { id: uuidv4(), patientId: INITIAL_PATIENTS[1].id, patientName: 'Maria Rodriguez', doctorId: '3', date: '2023-10-26T15:30:00', type: 'CHECKUP', status: 'SCHEDULED', notes: 'Annual physical' },
  { id: uuidv4(), patientId: INITIAL_PATIENTS[3].id, patientName: 'Elena Gomez', doctorId: '3', date: '2023-10-20T11:00:00', type: 'PROCEDURE', status: 'COMPLETED', notes: 'Vaccination' },
  { id: uuidv4(), patientId: INITIAL_PATIENTS[0].id, patientName: 'Juan Perez', doctorId: '2', date: '2023-11-05T09:00:00', type: 'CONSULTATION', status: 'SCHEDULED', notes: 'Follow up' },
];

const INITIAL_TASKS: Task[] = [
  { id: uuidv4(), title: 'Call Juan Perez for results', description: 'Inform about lab results', dueDate: '2023-10-25', priority: 'HIGH', status: 'PENDING', assignedTo: '2' },
  { id: uuidv4(), title: 'Order vaccines', description: 'Restock pediatric vaccines', dueDate: '2023-10-28', priority: 'MEDIUM', status: 'IN_PROGRESS', assignedTo: '4' },
];

const INITIAL_MESSAGES: Message[] = [
  { id: uuidv4(), from: 'Juan Perez', subject: 'Consulta sobre medicamentos', content: 'Doctor, tengo una duda sobre la dosis de la pastilla...', date: '2023-10-20T10:30:00Z', read: false, avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=random' },
  { id: uuidv4(), from: 'Lab Results', subject: 'Resultados Listos - Maria R.', content: 'Los análisis de sangre están listos para revisión.', date: '2023-10-22T09:00:00Z', read: true, avatar: 'https://ui-avatars.com/api/?name=Lab&background=random' },
];

const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  { 
    id: uuidv4(), 
    patientId: INITIAL_PATIENTS[0].id, // Juan Perez
    doctorId: '2', // Dr. Roberto Gomez
    date: '2023-08-15T09:30:00',
    type: 'CONSULTATION',
    diagnosis: 'Hipertensión Arterial Leve',
    prescription: 'Losartán 50mg cada 12 horas. Dieta baja en sodio.',
    notes: 'Paciente refiere dolores de cabeza ocasionales. Se solicita monitoreo de presión arterial.'
  },
  { 
    id: uuidv4(), 
    patientId: INITIAL_PATIENTS[0].id, 
    doctorId: '2', 
    date: '2023-09-20T10:00:00',
    type: 'LAB',
    diagnosis: 'Colesterol Elevado',
    prescription: 'Atorvastatina 20mg en la noche.',
    notes: 'Resultados de laboratorio muestran colesterol total de 240 mg/dL.'
  },
  { 
    id: uuidv4(), 
    patientId: INITIAL_PATIENTS[3].id, // Elena Gomez
    doctorId: '3', // Dr. Ana Martinez
    date: '2023-10-20T11:00:00',
    type: 'PROCEDURE',
    diagnosis: 'Vacunación Completa',
    prescription: 'Paracetamol 500mg si hay fiebre.',
    notes: 'Se aplicaron vacunas correspondientes a la edad. Paciente tranquilo.'
  }
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
    // Always update users to ensure new roles (Doctor, Nurse) are available and remove "Sales"
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));

    // Fix for legacy "Sales User" - if current user is Sales, switch to Doctor
    const currentUserStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.role === 'SALES' || currentUser.name === 'Sales User') {
        const doctor = INITIAL_USERS.find(u => u.role === 'DOCTOR');
        if (doctor) {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(doctor));
        }
      }
    }

    // Check PATIENTS (previously LEADS)
    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
      // Check if we need to migrate from LEADS (optional, but good for "adapting")
      // For now, just init with INITIAL_PATIENTS
       if (JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]').length === 0) {
        localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
       }
    }
    // Check APPOINTMENTS (previously OPPORTUNITIES)
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
       if (JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]').length === 0) {
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
       }
    }

    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) localStorage.setItem(STORAGE_KEYS.ACTIVITIES, '[]');
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    if (!localStorage.getItem(STORAGE_KEYS.MEDICAL_RECORDS)) localStorage.setItem(STORAGE_KEYS.MEDICAL_RECORDS, JSON.stringify(INITIAL_MEDICAL_RECORDS));
  },

  KEYS: STORAGE_KEYS,
};
