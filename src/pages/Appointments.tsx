import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { MdAdd, MdEdit, MdDelete, MdMedicalServices, MdCalendarToday } from 'react-icons/md';
import { storage } from '../utils/storage';
import type { Appointment, Patient } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../context/LanguageContext';

export const Appointments: React.FC = () => {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Appointment>>({
    patientId: '',
    doctorId: '2', // Default to current doctor
    date: '',
    type: 'CONSULTATION',
    status: 'SCHEDULED',
    notes: '',
  });

  const stages: { key: Appointment['status']; label: string; color: string }[] = [
    { key: 'SCHEDULED', label: t('appointments.stage.prospecting'), color: 'bg-blue-100 text-blue-800' },
    { key: 'CONFIRMED', label: t('appointments.stage.negotiation'), color: 'bg-yellow-100 text-yellow-800' },
    { key: 'COMPLETED', label: t('appointments.stage.closed_won'), color: 'bg-green-100 text-green-800' },
    { key: 'CANCELLED', label: t('appointments.stage.closed_lost'), color: 'bg-red-100 text-red-800' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const apps = storage.getAll<Appointment>(storage.KEYS.APPOINTMENTS);
    const pats = storage.getAll<Patient>(storage.KEYS.PATIENTS);
    setAppointments(apps);
    setPatients(pats);
  };

  const handleOpenModal = (app?: Appointment) => {
    if (app) {
      setEditingId(app.id);
      setFormData(app);
    } else {
      setEditingId(null);
      setFormData({
        patientId: patients.length > 0 ? patients[0].id : '',
        doctorId: '2',
        date: new Date().toISOString().slice(0, 16),
        type: 'CONSULTATION',
        status: 'SCHEDULED',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedApps: Appointment[];
    
    // Find patient name
    const patient = patients.find(p => p.id === formData.patientId);
    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';

    if (editingId) {
      updatedApps = appointments.map(a => a.id === editingId ? { ...a, ...formData, patientName } as Appointment : a);
    } else {
      const newApp: Appointment = {
        id: uuidv4(),
        ...formData as any,
        patientName,
      };
      updatedApps = [...appointments, newApp];
    }

    storage.saveAll(storage.KEYS.APPOINTMENTS, updatedApps);
    setAppointments(updatedApps);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('appointments.delete_confirm'))) {
      const updatedApps = appointments.filter(a => a.id !== id);
      storage.saveAll(storage.KEYS.APPOINTMENTS, updatedApps);
      setAppointments(updatedApps);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('appId', id);
  };

  const handleDrop = (e: React.DragEvent, status: Appointment['status']) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('appId');
    const updatedApps = appointments.map(a => a.id === id ? { ...a, status } : a);
    storage.saveAll(storage.KEYS.APPOINTMENTS, updatedApps);
    setAppointments(updatedApps);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{t('appointments.title')}</h1>
        <Button onClick={() => handleOpenModal()} icon={<MdAdd />}>{t('appointments.add')}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full overflow-x-auto pb-4">
        {stages.map(stage => (
          <div 
            key={stage.key} 
            className="flex flex-col h-full min-w-[280px]"
            onDrop={(e) => handleDrop(e, stage.key)}
            onDragOver={handleDragOver}
          >
            <div className={`p-3 rounded-t-lg border-b-2 ${stage.color.replace('text', 'border')} bg-white shadow-sm flex justify-between items-center`}>
              <h3 className="font-semibold text-gray-700">{stage.label}</h3>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                {appointments.filter(op => op.status === stage.key).length}
              </span>
            </div>
            
            <div className="p-3 space-y-3 flex-1 overflow-y-auto">
              {appointments.filter(a => a.status === stage.key).map(app => (
                <div
                  key={app.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, app.id)}
                  className="bg-white p-4 rounded shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 truncate pr-2">{app.patientName}</h4>
                    <button 
                      onClick={() => handleOpenModal(app)}
                      className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MdEdit />
                    </button>
                  </div>
                  
                  <div className="flex items-center text-blue-600 font-medium mb-2 text-sm">
                    <MdMedicalServices className="mr-1" />
                    {app.type}
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500 mt-3 pt-3 border-t border-gray-50">
                    <div className="flex items-center">
                      <MdCalendarToday className="mr-1" />
                      {new Date(app.date).toLocaleDateString()}
                    </div>
                    <button 
                      onClick={() => handleDelete(app.id)}
                      className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? t('appointments.modal.title.edit') : t('appointments.modal.title.new')}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={formData.patientId}
              onChange={e => setFormData({ ...formData, patientId: e.target.value })}
            >
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('appointments.form.stage')}</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as Appointment['status'] })}
            >
              {stages.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
             <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as any })}
             >
                <option value="CONSULTATION">Consultation</option>
                <option value="CHECKUP">Checkup</option>
                <option value="PROCEDURE">Procedure</option>
                <option value="EMERGENCY">Emergency</option>
             </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('appointments.form.date')}</label>
            <Input
              type="datetime-local"
              required
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <Input
              value={formData.notes || ''}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Symptoms, diagnosis, etc."
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{t('appointments.save_button')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
