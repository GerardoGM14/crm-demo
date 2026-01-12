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

export const Leads: React.FC = () => {
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
    if (window.confirm('Are you sure you want to delete this lead?')) {
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
      case 'NEW': return <Badge variant="info">New</Badge>;
      case 'CONTACTED': return <Badge variant="warning">Contacted</Badge>;
      case 'QUALIFIED': return <Badge variant="success">Qualified</Badge>;
      case 'LOST': return <Badge variant="error">Lost</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
        <Button onClick={() => handleOpenModal()} icon={<MdAdd />}>Add Lead</Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-72">
            <Input 
              placeholder="Search leads..." 
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
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No leads found. Add one to get started!
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
        title={editingLead ? 'Edit Lead' : 'Add New Lead'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="block w-full rounded-lg border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="LOST">Lost</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Lead</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
