import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { MdAttachMoney, MdPeople, MdTrendingUp, MdPieChart, MdDns, MdGroupWork, MdTrackChanges } from 'react-icons/md';
import { storage } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import type { Lead, Opportunity } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeOpportunities: 0,
    totalValue: 0,
    wonValue: 0,
    winRate: 0,
  });
  
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const leads = storage.getAll<Lead>(storage.KEYS.LEADS);
    const opportunities = storage.getAll<Opportunity>(storage.KEYS.OPPORTUNITIES);
    
    const wonOpps = opportunities.filter(o => o.stage === 'CLOSED_WON');
    const lostOpps = opportunities.filter(o => o.stage === 'CLOSED_LOST');
    const closedCount = wonOpps.length + lostOpps.length;
    
    setStats({
      totalLeads: leads.length,
      activeOpportunities: opportunities.filter(o => o.stage !== 'CLOSED_LOST' && o.stage !== 'CLOSED_WON').length,
      totalValue: opportunities.reduce((acc, curr) => acc + curr.value, 0),
      wonValue: wonOpps.reduce((acc, curr) => acc + curr.value, 0),
      winRate: closedCount > 0 ? Math.round((wonOpps.length / closedCount) * 100) : 0,
    });
    
    setRecentLeads(leads.slice(0, 5));
  }, []);

  const statCards = [
    { 
      title: 'Total Revenue', 
      value: `$${stats.wonValue.toLocaleString()}`, 
      change: '+12.5%', 
      isPositive: true,
      icon: MdAttachMoney, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      title: 'Active Pipeline', 
      value: `$${stats.totalValue.toLocaleString()}`, 
      change: '+5.2%', 
      isPositive: true,
      icon: MdTrendingUp, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      title: 'Total Leads', 
      value: stats.totalLeads, 
      change: '+24%', 
      isPositive: true,
      icon: MdPeople, 
      color: 'text-violet-600', 
      bg: 'bg-violet-50' 
    },
    { 
      title: 'Win Rate', 
      value: `${stats.winRate}%`, 
      change: '-2.1%', 
      isPositive: false,
      icon: MdPieChart, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">Last updated: Today</div>
      </div>
      
      {/* Role-Specific Widgets */}
      {user?.role === 'ADMIN' && (
        <Card className="bg-slate-800 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <MdDns className="text-blue-400" /> System Health (Admin View)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="text-xs text-slate-400 mb-1">CPU Usage</div>
                <div className="text-xl font-bold text-green-400">12%</div>
              </div>
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="text-xs text-slate-400 mb-1">Memory</div>
                <div className="text-xl font-bold text-blue-400">2.4GB</div>
              </div>
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="text-xs text-slate-400 mb-1">Active Sessions</div>
                <div className="text-xl font-bold text-purple-400">8</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {user?.role === 'MANAGER' && (
        <Card className="bg-indigo-50 border-indigo-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <MdGroupWork className="text-indigo-600" /> Team Performance (Manager View)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Sales Team A</span>
                <span className="font-bold text-indigo-700">92% to Target</span>
              </div>
              <div className="h-2 bg-indigo-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 w-[92%]"></div>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-gray-600">Sales Team B</span>
                <span className="font-bold text-indigo-700">78% to Target</span>
              </div>
              <div className="h-2 bg-indigo-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 w-[78%]"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {user?.role === 'SALES' && (
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <MdTrackChanges className="text-blue-200" /> My Monthly Target (Sales View)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold">$12,500</span>
              <span className="text-blue-100 mb-1">/ $20,000</span>
            </div>
            <div className="h-3 bg-blue-800/30 rounded-full overflow-hidden backdrop-blur-sm">
              <div className="h-full bg-white/90 w-[62.5%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
            </div>
            <div className="mt-2 text-xs text-blue-100 text-right">62.5% Achieved - Keep pushing!</div>
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
                  <span className="ml-1 text-gray-400">vs last month</span>
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
            <CardTitle>Revenue Forecast</CardTitle>
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
               {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                 <span key={m}>{m}</span>
               ))}
             </div>
          </CardContent>
        </Card>
        
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {recentLeads.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">No leads found</div>
              ) : (
                recentLeads.map(lead => (
                  <div key={lead.id} className="p-4 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
                      <p className="text-xs text-gray-500 truncate">{lead.company}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                      ${lead.status === 'NEW' ? 'bg-blue-100 text-blue-700' : 
                        lead.status === 'QUALIFIED' ? 'bg-green-100 text-green-700' :
                        lead.status === 'CONTACTED' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                      {lead.status}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-gray-100 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All Leads</button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};