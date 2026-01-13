import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { MdLogout, MdNotifications } from 'react-icons/md';

export const Topbar: React.FC = () => {
  const { logout, user } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
      <h1 className="text-xl font-semibold text-gray-800">
        {t('topbar.welcome')}, {user?.name.split(' ')[0]}
      </h1>
      
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-700 relative">
          <MdNotifications className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="h-6 w-px bg-gray-200"></div>
        <Button variant="ghost" size="sm" onClick={logout} icon={<MdLogout />}>
          {t('nav.logout')}
        </Button>
      </div>
    </header>
  );
};
