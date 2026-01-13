import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { storage } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import type { User } from '../types';

export const Users: React.FC = () => {
  const { t } = useLanguage();
  const users = storage.getAll<User>(storage.KEYS.USERS);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return t('topbar.role.admin');
      case 'MANAGER': return t('topbar.role.manager');
      case 'SALES': return t('topbar.role.sales');
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('users.title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('users.card.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-4">{t('users.table.name')}</th>
                <th className="px-6 py-4">{t('users.table.email')}</th>
                <th className="px-6 py-4">{t('users.table.role')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{getRoleLabel(user.role)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
