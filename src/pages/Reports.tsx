import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { storage } from '../utils/storage';
import type { Lead, Opportunity } from '../types';

export const Reports: React.FC = () => {
  const leads = storage.getAll<Lead>(storage.KEYS.LEADS);
  const opportunities = storage.getAll<Opportunity>(storage.KEYS.OPPORTUNITIES);

  // Funnel Data
  const funnelData = [
    { label: 'Total Leads', value: leads.length, color: 'bg-blue-500', width: '100%' },
    { label: 'Contacted', value: leads.filter(l => l.status !== 'NEW').length, color: 'bg-blue-600', width: '80%' },
    { label: 'Qualified', value: leads.filter(l => l.status === 'QUALIFIED').length, color: 'bg-blue-700', width: '60%' },
    { label: 'Opportunities', value: opportunities.length, color: 'bg-blue-800', width: '40%' },
    { label: 'Won Deals', value: opportunities.filter(o => o.stage === 'CLOSED_WON').length, color: 'bg-blue-900', width: '20%' },
  ];

  // Revenue by Month (Mock + Real Data hybrid)
  const revenueData = [
    { month: 'Jan', value: 45000 },
    { month: 'Feb', value: 52000 },
    { month: 'Mar', value: 48000 },
    { month: 'Apr', value: 61000 },
    { month: 'May', value: 55000 },
    { month: 'Jun', value: 67000 },
    { month: 'Jul', value: 72000 },
    { month: 'Aug', value: 68000 },
    { month: 'Sep', value: 78000 },
    { month: 'Oct', value: 85000 }, // Current month boost
    { month: 'Nov', value: 20000 }, // Partial
    { month: 'Dec', value: 0 },
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.value));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Funnel</CardTitle>
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
                      {Math.round((stage.value / leads.length) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (YTD)</CardTitle>
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
             <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
             {/* Simple Pie Chart Representation */}
             <div className="w-48 h-48 rounded-full border-[16px] border-blue-500 border-t-green-500 border-r-purple-500 relative">
               <div className="absolute inset-0 flex items-center justify-center flex-col">
                 <span className="text-2xl font-bold text-gray-900">Total</span>
                 <span className="text-sm text-gray-500">{leads.length} Leads</span>
               </div>
             </div>
          </CardContent>
          <div className="px-6 pb-6 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Organic Search</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Referrals</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div> Social Media</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-200 rounded-full"></div> Others</div>
          </div>
        </Card>
        
        {/* More metric cards can go here */}
      </div>
    </div>
  );
};