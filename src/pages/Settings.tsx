import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { MdSave, MdPerson, MdNotifications, MdLock, MdLanguage, MdSecurity } from 'react-icons/md';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'logs'>('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings updated successfully! (Demo mode)');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation */}
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <MdPerson /> Profile
          </button>
          
          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => setActiveTab('logs')}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${activeTab === 'logs' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <MdSecurity /> System Logs
            </button>
          )}

          <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium flex items-center gap-2">
            <MdNotifications /> Notifications
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium flex items-center gap-2">
            <MdLock /> Security
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium flex items-center gap-2">
            <MdLanguage /> Language
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-2">
          {activeTab === 'profile' ? (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full"
                    />
                    <div>
                      <Button variant="outline" size="sm" type="button">Change Avatar</Button>
                      <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. Max 1MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Full Name" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                    <Input 
                      label="Email Address" 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      disabled
                      className="bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Change Password</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        type="password"
                        label="Current Password" 
                        value={formData.currentPassword} 
                        onChange={e => setFormData({...formData, currentPassword: e.target.value})} 
                      />
                      <Input 
                        type="password"
                        label="New Password" 
                        value={formData.newPassword} 
                        onChange={e => setFormData({...formData, newPassword: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" icon={<MdSave />}>Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>System Logs (Admin Only)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-gray-900">User Login Activity</p>
                        <p className="text-gray-500">User {user?.name} logged in successfully.</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date().toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};