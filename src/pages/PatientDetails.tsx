import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { 
  MdArrowBack, MdAdd, MdHistory, 
  MdEvent, MdPerson, MdPhone, MdEmail, MdLocationOn, 
  MdBloodtype, MdWarning, MdCake, MdMedicalServices, MdScience 
} from 'react-icons/md';
import { storage } from '../utils/storage';
import type { Patient, MedicalRecord, Appointment } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const { t } = useLanguage();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalHistory, setMedicalHistory] = useState<MedicalRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // New Record Modal State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<MedicalRecord>>({
    type: 'CONSULTATION',
    diagnosis: '',
    prescription: '',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      loadPatientData(id);
    }
  }, [id]);

  const loadPatientData = (patientId: string) => {
    setLoading(true);
    const allPatients = storage.getAll<Patient>(storage.KEYS.PATIENTS);
    const foundPatient = allPatients.find(p => p.id === patientId);
    
    if (foundPatient) {
      setPatient(foundPatient);
      
      // Load Medical History
      const allRecords = storage.getAll<MedicalRecord>(storage.KEYS.MEDICAL_RECORDS);
      const patientRecords = allRecords.filter(r => r.patientId === patientId);
      setMedicalHistory(patientRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

      // Load Appointments
      const allAppointments = storage.getAll<Appointment>(storage.KEYS.APPOINTMENTS);
      const patientAppointments = allAppointments.filter(a => a.patientId === patientId);
      setAppointments(patientAppointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    setLoading(false);
  };

  const handleAddRecord = () => {
    if (!patient || !newRecord.diagnosis) return;

    const record: MedicalRecord = {
      id: uuidv4(),
      patientId: patient.id,
      doctorId: storage.getUser()?.id || 'unknown',
      date: new Date().toISOString(),
      diagnosis: newRecord.diagnosis || '',
      prescription: newRecord.prescription || '',
      notes: newRecord.notes || '',
      type: newRecord.type as any || 'CONSULTATION'
    };

    const updatedRecords = [record, ...medicalHistory];
    setMedicalHistory(updatedRecords);
    
    const allRecords = storage.getAll<MedicalRecord>(storage.KEYS.MEDICAL_RECORDS);
    storage.saveAll(storage.KEYS.MEDICAL_RECORDS, [...allRecords, record]);
    
    setIsRecordModalOpen(false);
    setNewRecord({ type: 'CONSULTATION', diagnosis: '', prescription: '', notes: '' });
  };

  if (loading) return <div className="p-8 text-center">Loading patient data...</div>;
  if (!patient) return <div className="p-8 text-center text-red-500">Patient not found</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/patients')}>
            <MdArrowBack className="mr-2" /> Back to Patients
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {patient.firstName} {patient.lastName}
          </h1>
          <Badge variant={patient.status === 'ACTIVE' ? 'success' : 'default'}>
            {patient.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => setIsRecordModalOpen(true)}>
            <MdAdd className="mr-2" /> New Consultation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MdPerson className="text-blue-500" /> Patient Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {patient.firstName[0]}{patient.lastName[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900">DNI: {patient.dni}</p>
                  <p className="text-gray-500">Born: {new Date(patient.birthDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <MdPhone /> {patient.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MdEmail /> {patient.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MdLocationOn /> {patient.address}
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2"><MdBloodtype /> Blood Type</span>
                  <span className="font-medium">{patient.bloodType || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2"><MdCake /> Age</span>
                  <span className="font-medium">
                    {new Date().getFullYear() - new Date(patient.birthDate).getFullYear()} years
                  </span>
                </div>
              </div>

              {patient.allergies && (
                <div className="bg-red-50 p-3 rounded-md border border-red-100">
                  <div className="flex items-center gap-2 text-red-700 font-medium mb-1">
                    <MdWarning /> Allergies
                  </div>
                  <p className="text-red-600 text-sm">{patient.allergies}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MdEvent className="text-purple-500" /> Recent Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No appointments found</p>
              ) : (
                <div className="space-y-4">
                  {appointments.slice(0, 3).map(apt => (
                    <div key={apt.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                      <div className={`p-2 rounded-lg ${
                        apt.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                        apt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <MdEvent />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{new Date(apt.date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{apt.type} - {apt.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Medical History Timeline */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MdHistory className="text-emerald-500" /> Medical History & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {medicalHistory.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                  <MdMedicalServices className="mx-auto text-4xl text-gray-300 mb-2" />
                  <p className="text-gray-500">No medical records found for this patient.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setIsRecordModalOpen(true)}>
                    Start First Consultation
                  </Button>
                </div>
              ) : (
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {medicalHistory.map((record) => (
                    <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      {/* Icon */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        {record.type === 'LAB' ? <MdScience className="text-purple-500" /> : <MdMedicalServices className="text-blue-500" />}
                      </div>
                      
                      {/* Content */}
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 shadow-sm bg-white">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-slate-900">{record.diagnosis}</div>
                          <time className="font-caveat font-medium text-indigo-500 text-sm">
                            {new Date(record.date).toLocaleDateString()}
                          </time>
                        </div>
                        <div className="text-slate-500 text-sm mb-2">
                          <span className="font-semibold text-xs uppercase tracking-wider text-slate-400">{record.type}</span>
                        </div>
                        <div className="text-slate-600 mb-3 text-sm">
                          {record.notes}
                        </div>
                        {record.prescription && (
                          <div className="bg-indigo-50 p-3 rounded text-sm border border-indigo-100">
                            <span className="font-semibold text-indigo-700">Rx:</span> {record.prescription}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Consultation Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="New Clinical Consultation"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              className="w-full p-2 border rounded-md"
              value={newRecord.type}
              onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value as any })}
            >
              <option value="CONSULTATION">Medical Consultation</option>
              <option value="CHECKUP">Routine Checkup</option>
              <option value="EMERGENCY">Emergency</option>
              <option value="PROCEDURE">Procedure</option>
            </select>
          </div>
          <Input
            label="Diagnosis"
            value={newRecord.diagnosis}
            onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
            placeholder="e.g. Acute Bronchitis"
          />
          <Input
            label="Prescription (Rx)"
            value={newRecord.prescription}
            onChange={(e) => setNewRecord({ ...newRecord, prescription: e.target.value })}
            placeholder="e.g. Amoxicillin 500mg x 7 days"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes</label>
            <textarea
              className="w-full p-2 border rounded-md h-24"
              value={newRecord.notes}
              onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
              placeholder="Patient symptoms, observations, etc."
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setIsRecordModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddRecord}>Save Record</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
