import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdPhone, MdEmail } from 'react-icons/md';
import { storage } from '../utils/storage';
import type { Lead } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../context/LanguageContext';

export const Leads: React.FC = () => {
  const { t } = useLanguage();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'NEW',
  });

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = () => {
    const data = storage.getAll<Lead>(storage.KEYS.LEADS);
    setLeads(data);
  };

  const handleOpenModal = (lead?: Lead) => {
    if (lead) {
      setEditingLead(lead);
      setFormData(lead);
    } else {
      setEditingLead(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'NEW',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingLead) {
      const updatedLeads = leads.map(l => l.id === editingLead.id ? { ...l, ...formData } as Lead : l);
      storage.saveAll(storage.KEYS.LEADS, updatedLeads);
    } else {
      const newLead: Lead = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        ...(formData as Omit<Lead, 'id' | 'createdAt'>),
      };
      const updatedLeads = [...leads, newLead];
      storage.saveAll(storage.KEYS.LEADS, updatedLeads);
    }
    
    loadLeads();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('leads.delete_confirm'))) {
      const updatedLeads = leads.filter(l => l.id !== id);
      storage.saveAll(storage.KEYS.LEADS, updatedLeads);
      loadLeads();
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW': return <Badge variant="info">{t('leads.status.new')}</Badge>;
      case 'CONTACTED': return <Badge variant="warning">{t('leads.status.contacted')}</Badge>;
      case 'QUALIFIED': return <Badge variant="success">{t('leads.status.qualified')}</Badge>;
      case 'LOST': return <Badge variant="error">{t('leads.status.lost')}</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{t('leads.title')}</h1>
        <Button onClick={() => handleOpenModal()} icon={<MdAdd />}>{t('leads.add')}</Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-72">
            <Input 
              placeholder={t('leads.search_placeholder')}
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
                <th className="px-6 py-4">{t('leads.table.name')}</th>
                <th className="px-6 py-4">{t('leads.table.contact')}</th>
                <th className="px-6 py-4">{t('leads.table.company')}</th>
                <th className="px-6 py-4">{t('leads.table.status')}</th>
                <th className="px-6 py-4 text-right">{t('leads.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {t('leads.no_leads')}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{lead.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <MdEmail className="text-gray-400" /> {lead.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <MdPhone className="text-gray-400" /> {lead.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{lead.company}</td>
                    <td className="px-6 py-4">{getStatusBadge(lead.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(lead)} icon={<MdEdit />} />
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(lead.id)} icon={<MdDelete />} />
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
        title={editingLead ? t('leads.modal.title.edit') : t('leads.modal.title.new')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('leads.form.fullname')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label={t('leads.form.email')}
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label={t('leads.form.phone')}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label={t('leads.form.company')}
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('leads.form.status')}</label>
            <select
              className="block w-full rounded-lg border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="NEW">{t('leads.status.new')}</option>
              <option value="CONTACTED">{t('leads.status.contacted')}</option>
              <option value="QUALIFIED">{t('leads.status.qualified')}</option>
              <option value="LOST">{t('leads.status.lost')}</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{t('leads.save_button')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
