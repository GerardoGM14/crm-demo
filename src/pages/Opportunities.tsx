import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { MdAdd, MdEdit, MdDelete, MdAttachMoney, MdCalendarToday } from 'react-icons/md';
import { storage } from '../utils/storage';
import type { Opportunity } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const Opportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Opportunity>>({
    title: '',
    value: 0,
    stage: 'PROSPECTING',
    expectedCloseDate: '',
    leadId: '', // Ideally this would be a select from existing leads
  });

  const stages: { key: Opportunity['stage']; label: string; color: string }[] = [
    { key: 'PROSPECTING', label: 'Prospecting', color: 'bg-blue-100 text-blue-800' },
    { key: 'NEGOTIATION', label: 'Negotiation', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'CLOSED_WON', label: 'Closed Won', color: 'bg-green-100 text-green-800' },
    { key: 'CLOSED_LOST', label: 'Closed Lost', color: 'bg-red-100 text-red-800' },
  ];

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = () => {
    const data = storage.getAll<Opportunity>(storage.KEYS.OPPORTUNITIES);
    setOpportunities(data);
  };

  const handleOpenModal = (opp?: Opportunity) => {
    if (opp) {
      setEditingId(opp.id);
      setFormData(opp);
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        value: 0,
        stage: 'PROSPECTING',
        expectedCloseDate: new Date().toISOString().split('T')[0],
        leadId: '1', // Mock lead ID
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedOpps: Opportunity[];
    
    if (editingId) {
      updatedOpps = opportunities.map(o => o.id === editingId ? { ...o, ...formData } as Opportunity : o);
    } else {
      const newOpp: Opportunity = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        ...formData as any,
      };
      updatedOpps = [...opportunities, newOpp];
    }

    storage.saveAll(storage.KEYS.OPPORTUNITIES, updatedOpps);
    setOpportunities(updatedOpps);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this opportunity?')) {
      const updatedOpps = opportunities.filter(o => o.id !== id);
      storage.saveAll(storage.KEYS.OPPORTUNITIES, updatedOpps);
      setOpportunities(updatedOpps);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('oppId', id);
  };

  const handleDrop = (e: React.DragEvent, stage: Opportunity['stage']) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('oppId');
    const updatedOpps = opportunities.map(o => o.id === id ? { ...o, stage } : o);
    storage.saveAll(storage.KEYS.OPPORTUNITIES, updatedOpps);
    setOpportunities(updatedOpps);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Opportunities Pipeline</h1>
        <Button onClick={() => handleOpenModal()} icon={<MdAdd />}>Add Deal</Button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 min-w-[1000px] h-full pb-4">
          {stages.map(stage => (
            <div 
              key={stage.key} 
              className="flex-1 bg-gray-100 rounded-lg flex flex-col min-w-[250px]"
              onDrop={(e) => handleDrop(e, stage.key)}
              onDragOver={handleDragOver}
            >
              <div className={`p-3 font-semibold text-sm flex justify-between items-center rounded-t-lg ${stage.color}`}>
                <span>{stage.label}</span>
                <span className="bg-white/50 px-2 py-0.5 rounded text-xs">
                  {opportunities.filter(o => o.stage === stage.key).length}
                </span>
              </div>
              
              <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                {opportunities.filter(o => o.stage === stage.key).map(opp => (
                  <div
                    key={opp.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, opp.id)}
                    className="bg-white p-4 rounded shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 truncate pr-2">{opp.title}</h4>
                      <button 
                        onClick={() => handleOpenModal(opp)}
                        className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MdEdit />
                      </button>
                    </div>
                    
                    <div className="flex items-center text-green-600 font-semibold mb-2">
                      <MdAttachMoney className="mr-1" />
                      {formatCurrency(opp.value)}
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500 mt-3 pt-3 border-t border-gray-50">
                      <div className="flex items-center">
                        <MdCalendarToday className="mr-1" />
                        {new Date(opp.expectedCloseDate).toLocaleDateString()}
                      </div>
                      <button 
                        onClick={() => handleDelete(opp.id)}
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
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Deal' : 'New Deal'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deal Title</label>
            <Input
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Enterprise License"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value ($)</label>
            <Input
              type="number"
              required
              value={formData.value}
              onChange={e => setFormData({ ...formData, value: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.stage}
              onChange={e => setFormData({ ...formData, stage: e.target.value as Opportunity['stage'] })}
            >
              {stages.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close Date</label>
            <Input
              type="date"
              required
              value={formData.expectedCloseDate}
              onChange={e => setFormData({ ...formData, expectedCloseDate: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Deal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
