import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { MdPeople, MdPieChart, MdDns, MdEventAvailable, MdLocalHospital } from 'react-icons/md';
import { storage } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';
import type { Patient, Appointment } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [stats, setStats] = useState({
    totalPatients: 0,
    scheduledAppointments: 0,
    completedAppointments: 0,
    attendanceRate: 0,
  });
  
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const patients = storage.getAll<Patient>(storage.KEYS.PATIENTS);
    const appointments = storage.getAll<Appointment>(storage.KEYS.APPOINTMENTS);
    
    const completedApps = appointments.filter(a => a.status === 'COMPLETED');
    const cancelledApps = appointments.filter(a => a.status === 'CANCELLED');
    const totalFinished = completedApps.length + cancelledApps.length;
    
    setStats({
      totalPatients: patients.length,
      scheduledAppointments: appointments.filter(a => a.status === 'SCHEDULED' || a.status === 'CONFIRMED').length,
      completedAppointments: completedApps.length,
      attendanceRate: totalFinished > 0 ? Math.round((completedApps.length / totalFinished) * 100) : 100,
    });
    
    setRecentPatients(patients.slice(0, 5));
  }, []);

  const statCards = [
    { 
      title: t('dashboard.stats.active_pipeline'), 
      value: stats.scheduledAppointments, 
      change: '+3', 
      isPositive: true,
      icon: MdEventAvailable, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      title: t('dashboard.stats.total_patients'), 
      value: stats.totalPatients, 
      change: '+12%', 
      isPositive: true,
      icon: MdPeople, 
      color: 'text-violet-600', 
      bg: 'bg-violet-50' 
    },
    { 
      title: t('dashboard.stats.completed_visits'), 
      value: stats.completedAppointments, 
      change: '+5%', 
      isPositive: true,
      icon: MdLocalHospital, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      title: t('dashboard.stats.win_rate'), 
      value: `${stats.attendanceRate}%`, 
      change: '+1%', 
      isPositive: true,
      icon: MdPieChart, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <div className="text-sm text-gray-500">{t('dashboard.last_updated')}</div>
      </div>
      
      {/* Role-Specific Widgets */}
      {user?.role === 'ADMIN' && (
        <Card className="bg-slate-800 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <MdDns className="text-blue-400" /> {t('dashboard.widgets.system_health')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="text-xs text-slate-400 mb-1">{t('dashboard.widgets.cpu_usage')}</div>
                <div className="text-xl font-bold text-green-400">12%</div>
              </div>
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="text-xs text-slate-400 mb-1">{t('dashboard.widgets.memory')}</div>
                <div className="text-xl font-bold text-blue-400">2.4GB</div>
              </div>
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="text-xs text-slate-400 mb-1">{t('dashboard.widgets.active_sessions')}</div>
                <div className="text-xl font-bold text-purple-400">8</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <div className={`text-xs font-medium mt-2 flex items-center ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{stat.change}</span>
                  <span className="ml-1 text-gray-400">{t('dashboard.stats.vs_last_month')}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 h-full">
          <CardHeader>
            <CardTitle>{t('dashboard.charts.revenue_forecast')}</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-64 flex items-end justify-between gap-2 mt-4 px-2">
                {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 95].map((h, i) => (
                  <div key={i} className="w-full bg-blue-50 hover:bg-blue-100 rounded-t-sm relative group transition-all duration-300" style={{ height: `${h}%` }}>
                    <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm transition-all duration-500" style={{ height: `${h * 0.7}%` }}></div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                      ${h}k
                    </div>
                  </div>
                ))}
             </div>
             <div className="flex justify-between mt-4 text-xs text-gray-400 uppercase font-medium">
               {(translations[language] as any)['dashboard.charts.months'].map((m: string) => (
                 <span key={m}>{m}</span>
               ))}
             </div>
          </CardContent>
        </Card>
        
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{t('dashboard.recent_patients.title')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {recentPatients.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">{t('dashboard.recent_patients.no_patients')}</div>
              ) : (
                recentPatients.map(patient => (
                  <div key={patient.id} className="p-4 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                      {patient.firstName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{patient.firstName} {patient.lastName}</p>
                      <p className="text-xs text-gray-500 truncate">{patient.dni}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                      ${patient.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                      {patient.status}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-gray-100 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">{t('dashboard.recent_patients.view_all')}</button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
