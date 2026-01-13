import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { MdSave, MdPerson, MdNotifications, MdLock, MdLanguage, MdSecurity } from 'react-icons/md';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'logs' | 'language'>('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('settings.alert.success'));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation */}
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <MdPerson /> {t('settings.tab.profile')}
          </button>
          
          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => setActiveTab('logs')}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${activeTab === 'logs' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <MdSecurity /> {t('settings.tab.system_logs')}
            </button>
          )}

          <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium flex items-center gap-2">
            <MdNotifications /> {t('settings.tab.notifications')}
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium flex items-center gap-2">
            <MdLock /> {t('settings.tab.security')}
          </button>
          <button 
            onClick={() => setActiveTab('language')}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${activeTab === 'language' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <MdLanguage /> {t('settings.tab.language')}
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-2">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.profile.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`} 
                      alt={t('settings.profile.avatar_alt')} 
                      className="w-20 h-20 rounded-full"
                    />
                    <div>
                      <Button variant="outline" size="sm" type="button">{t('settings.profile.change_avatar')}</Button>
                      <p className="text-xs text-gray-500 mt-1">{t('settings.profile.avatar_hint')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label={t('settings.profile.full_name')}
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                    <Input 
                      label={t('settings.profile.email')}
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      disabled
                      className="bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">{t('settings.password.title')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        type="password"
                        label={t('settings.password.current')}
                        value={formData.currentPassword} 
                        onChange={e => setFormData({...formData, currentPassword: e.target.value})} 
                      />
                      <Input 
                        type="password"
                        label={t('settings.password.new')}
                        value={formData.newPassword} 
                        onChange={e => setFormData({...formData, newPassword: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" icon={<MdSave />}>
                      {t('settings.save_changes')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'language' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.language.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{t('settings.language.select')}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`p-4 rounded-lg border-2 flex items-center justify-between transition-colors ${language === 'en' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🇺🇸</span>
                        <span className={`font-medium ${language === 'en' ? 'text-blue-700' : 'text-gray-700'}`}>{t('settings.language.english')}</span>
                      </div>
                      {language === 'en' && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                    </button>

                    <button
                      onClick={() => setLanguage('es')}
                      className={`p-4 rounded-lg border-2 flex items-center justify-between transition-colors ${language === 'es' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🇪🇸</span>
                        <span className={`font-medium ${language === 'es' ? 'text-blue-700' : 'text-gray-700'}`}>{t('settings.language.spanish')}</span>
                      </div>
                      {language === 'es' && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'logs' && user?.role === 'ADMIN' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.tab.system_logs')} {t('settings.logs.admin_only')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-gray-900">{t('settings.logs.login_activity')}</p>
                        <p className="text-gray-500">User {user?.name} {t('settings.logs.login_success')}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date().toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}</p>
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