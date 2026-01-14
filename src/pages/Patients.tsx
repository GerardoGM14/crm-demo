import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdPhone, MdEmail, MdCreditCard, MdCake, MdVisibility } from 'react-icons/md';
import { storage } from '../utils/storage';
import type { Patient } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../context/LanguageContext';

export const Patients: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Patient>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dni: '',
    status: 'ACTIVE',
    birthDate: '',
    address: '',
    allergies: '',
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    const data = storage.getAll<Patient>(storage.KEYS.PATIENTS);
    setPatients(data);
  };

  const handleOpenModal = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData(patient);
    } else {
      setEditingPatient(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dni: '',
        status: 'ACTIVE',
        birthDate: '',
        address: '',
        allergies: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPatient) {
      const updatedPatients = patients.map(p => p.id === editingPatient.id ? { ...p, ...formData } as Patient : p);
      storage.saveAll(storage.KEYS.PATIENTS, updatedPatients);
    } else {
      const newPatient: Patient = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        gender: 'M', // Default
        ...(formData as Omit<Patient, 'id' | 'createdAt' | 'gender'>),
      } as Patient;
      const updatedPatients = [...patients, newPatient];
      storage.saveAll(storage.KEYS.PATIENTS, updatedPatients);
    }
    
    loadPatients();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('patients.delete_confirm'))) {
      const updatedPatients = patients.filter(p => p.id !== id);
      storage.saveAll(storage.KEYS.PATIENTS, updatedPatients);
      loadPatients();
    }
  };

  const filteredPatients = patients.filter(patient => 
    patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.dni.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Badge variant="success">Active</Badge>;
      case 'INACTIVE': return <Badge variant="error">Inactive</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{t('patients.title')}</h1>
        <Button onClick={() => handleOpenModal()} icon={<MdAdd />}>{t('patients.add')}</Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-72">
            <Input 
              placeholder={t('patients.search_placeholder')}
              icon={<MdSearch />} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-4">{t('patients.table.name')}</th>
                <th className="px-6 py-4">{t('patients.table.contact')}</th>
                <th className="px-6 py-4">{t('patients.table.company')}</th>
                <th className="px-6 py-4">{t('patients.table.status')}</th>
                <th className="px-6 py-4 text-right">{t('patients.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {t('patients.no_patients')}
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 cursor-pointer hover:text-blue-600" onClick={() => navigate(`/patients/${patient.id}`)}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                        <div>
                          <div>{patient.firstName} {patient.lastName}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                             <MdCake size={12}/> {patient.birthDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <MdEmail className="text-gray-400" /> {patient.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <MdPhone className="text-gray-400" /> {patient.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MdCreditCard className="text-gray-400" />
                        {patient.dni}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(patient.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/patients/${patient.id}`)} icon={<MdVisibility />} />
                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(patient)} icon={<MdEdit />} />
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(patient.id)} icon={<MdDelete />} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPatient ? t('patients.modal.title.edit') : t('patients.modal.title.new')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          <Input
            label="DNI"
            value={formData.dni}
            onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
            required
          />
          <Input
            label={t('patients.form.email')}
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label={t('patients.form.phone')}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <Input
            label="Allergies"
            value={formData.allergies}
            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            placeholder="e.g. Penicillin, Peanuts"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('patients.form.status')}</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Patient['status'] })}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{t('patients.save_button')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
