import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { storage } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import type { Patient, Appointment } from '../types';

export const Reports: React.FC = () => {
  const { t } = useLanguage();
  const patients = storage.getAll<Patient>(storage.KEYS.PATIENTS);
  const appointments = storage.getAll<Appointment>(storage.KEYS.APPOINTMENTS);

  // Funnel Data
  const funnelData = [
    { label: t('reports.funnel.total_patients'), value: patients.length, color: 'bg-blue-500', width: '100%' },
    { label: 'Active Patients', value: patients.filter(p => p.status === 'ACTIVE').length, color: 'bg-blue-600', width: '85%' },
    { label: 'Appointments Created', value: appointments.length, color: 'bg-blue-700', width: '70%' },
    { label: 'Completed Appointments', value: appointments.filter(a => a.status === 'COMPLETED').length, color: 'bg-blue-800', width: '50%' },
    { label: 'New Patients', value: patients.filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth()).length, color: 'bg-blue-900', width: '30%' },
  ];

  // Revenue by Month (Mock + Real Data hybrid)
  const months = t('dashboard.charts.months') as string[];
  const revenueData = [
    { month: months[0], value: 45000 },
    { month: months[1], value: 52000 },
    { month: months[2], value: 48000 },
    { month: months[3], value: 61000 },
    { month: months[4], value: 55000 },
    { month: months[5], value: 67000 },
    { month: months[6], value: 72000 },
    { month: months[7], value: 68000 },
    { month: months[8], value: 78000 },
    { month: months[9], value: 85000 }, // Current month boost
    { month: months[10], value: 20000 }, // Partial
    { month: months[11], value: 0 },
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.value));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('reports.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.funnel.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 py-4">
              {funnelData.map((stage, i) => (
                <div key={i} className="relative group">
                  <div className="flex items-center justify-between text-sm mb-1 font-medium text-gray-700">
                    <span>{stage.label}</span>
                    <span>{stage.value}</span>
                  </div>
                  <div className="h-10 w-full bg-gray-100 rounded-lg overflow-hidden flex justify-center">
                    <div 
                      className={`h-full ${stage.color} rounded-lg transition-all duration-1000 ease-out flex items-center justify-center text-white text-xs font-bold shadow-lg`}
                      style={{ width: stage.width }}
                    >
                      {Math.round((stage.value / (patients.length || 1)) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('reports.revenue.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-end justify-between gap-2 px-2 pt-4">
              {revenueData.map((d, i) => {
                const height = (d.value / maxRevenue) * 100;
                return (
                  <div key={i} className="w-full flex flex-col items-center group">
                    <div 
                      className="w-full bg-emerald-500 rounded-t-sm transition-all duration-500 relative hover:bg-emerald-600"
                      style={{ height: `${height}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                        ${d.value.toLocaleString()}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2 font-medium rotate-0 sm:rotate-0">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
             <CardTitle>{t('reports.sources.title')}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
             {/* Simple Pie Chart Representation */}
             <div className="w-48 h-48 rounded-full border-[16px] border-blue-500 border-t-green-500 border-r-purple-500 relative">
               <div className="absolute inset-0 flex items-center justify-center flex-col">
                 <span className="text-2xl font-bold text-gray-900">{t('reports.sources.total')}</span>
                 <span className="text-sm text-gray-500">{patients.length} {t('reports.sources.patients')}</span>
               </div>
             </div>
          </CardContent>
          <div className="px-6 pb-6 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> {t('reports.sources.organic')}</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div> {t('reports.sources.referrals')}</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div> {t('reports.sources.social')}</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-200 rounded-full"></div> {t('reports.sources.others')}</div>
          </div>
        </Card>
        
        {/* More metric cards can go here */}
      </div>
    </div>
  );
};