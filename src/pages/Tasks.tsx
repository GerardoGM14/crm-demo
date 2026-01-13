import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdCheckCircle, MdRadioButtonUnchecked, MdDateRange, MdFlag } from 'react-icons/md';
import { storage } from '../utils/storage';
import type { Task } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const Tasks: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'MY'>('MY');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    status: 'PENDING',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const data = storage.getAll<Task>(storage.KEYS.TASKS);
    setTasks(data);
  };

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData(task);
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'MEDIUM',
        status: 'PENDING',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTasks = [...tasks];
    
    if (editingTask) {
      const index = newTasks.findIndex(t => t.id === editingTask.id);
      newTasks[index] = { ...editingTask, ...formData } as Task;
    } else {
      newTasks.push({
        id: uuidv4(),
        ...formData,
        assignedTo: '1', // Default to current user for demo
      } as Task);
    }

    storage.saveAll('TASKS', newTasks);
    setTasks(newTasks);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('tasks.delete_confirm'))) {
      const updatedTasks = tasks.filter(t => t.id !== id);
      storage.saveAll('TASKS', updatedTasks);
      setTasks(updatedTasks);
    }
  };

  const toggleStatus = (task: Task) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === task.id) {
        return { ...t, status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' };
      }
      return t;
    });
    storage.saveAll(storage.KEYS.TASKS, updatedTasks as Task[]);
    setTasks(updatedTasks as Task[]);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role-based filtering
    if (user?.role === 'SALES') {
      return matchesSearch && task.assignedTo === user.id;
    } else {
      // Admin/Manager can filter
      if (filterType === 'MY') {
        return matchesSearch && task.assignedTo === user?.id;
      }
      return matchesSearch;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-50';
      case 'MEDIUM': return 'text-orange-600 bg-orange-50';
      case 'LOW': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'HIGH': return t('tasks.priority.high');
      case 'MEDIUM': return t('tasks.priority.medium');
      case 'LOW': return t('tasks.priority.low');
      default: return priority;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{t('tasks.title')}</h1>
        <div className="flex gap-2">
          {/* Admin/Manager Filter Toggle */}
          {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
            <div className="flex bg-gray-100 rounded-lg p-1 mr-2">
              <button
                onClick={() => setFilterType('MY')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filterType === 'MY' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('tasks.filter.my')}
              </button>
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filterType === 'ALL' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('tasks.filter.all')}
              </button>
            </div>
          )}
          <Button onClick={() => handleOpenModal()} icon={<MdAdd />}>{t('tasks.add')}</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-72">
            <Input 
              placeholder={t('tasks.search_placeholder')} 
              icon={<MdSearch />} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {filteredTasks.length === 0 ? (
               <div className="p-8 text-center text-gray-500">
                 {t('tasks.no_tasks')}
               </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-gray-50 flex items-start gap-4 transition-colors group">
                  <button 
                    onClick={() => toggleStatus(task)}
                    className={`mt-1 text-2xl transition-colors ${task.status === 'COMPLETED' ? 'text-green-500' : 'text-gray-300 hover:text-green-500'}`}
                  >
                    {task.status === 'COMPLETED' ? <MdCheckCircle /> : <MdRadioButtonUnchecked />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium truncate ${task.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                        <MdFlag className="w-3 h-3" /> {getPriorityLabel(task.priority)}
                      </span>
                    </div>
                    {task.description && <p className="text-sm text-gray-500 mb-2">{task.description}</p>}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <MdDateRange /> {t('tasks.due')} {task.dueDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(task)} icon={<MdEdit />} />
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(task.id)} icon={<MdDelete />} />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? t('tasks.modal.title.edit') : t('tasks.modal.title.new')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('tasks.form.title')}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('tasks.form.description')}</label>
            <textarea
              className="block w-full rounded-lg border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label={t('tasks.form.dueDate')}
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('tasks.form.priority')}</label>
              <select
                className="block w-full rounded-lg border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              >
                <option value="LOW">{t('tasks.priority.low')}</option>
                <option value="MEDIUM">{t('tasks.priority.medium')}</option>
                <option value="HIGH">{t('tasks.priority.high')}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>{t('common.cancel')}</Button>
            <Button type="submit">{editingTask ? t('tasks.save_changes') : t('tasks.save_create')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};