import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MdChevronLeft, MdChevronRight, MdToday } from 'react-icons/md';
import { storage } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import type { Task, Opportunity } from '../types';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

export const Calendar: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const tasks = storage.getAll<Task>(storage.KEYS.TASKS);
  const opportunities = storage.getAll<Opportunity>(storage.KEYS.OPPORTUNITIES);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = [
    t('calendar.weekdays.sun'),
    t('calendar.weekdays.mon'),
    t('calendar.weekdays.tue'),
    t('calendar.weekdays.wed'),
    t('calendar.weekdays.thu'),
    t('calendar.weekdays.fri'),
    t('calendar.weekdays.sat')
  ];

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getEventsForDay = (date: Date) => {
    const dayTasks = tasks.filter(task => isSameDay(new Date(task.dueDate), date));
    const dayOpps = opportunities.filter(opp => isSameDay(new Date(opp.expectedCloseDate), date));
    return [...dayTasks.map(t => ({ ...t, type: 'task' })), ...dayOpps.map(o => ({ ...o, type: 'opportunity' }))];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{t('calendar.title')}</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={prevMonth} icon={<MdChevronLeft />} />
          <span className="text-lg font-semibold w-32 text-center capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: language === 'es' ? es : enUS })}
          </span>
          <Button variant="ghost" onClick={nextMonth} icon={<MdChevronRight />} />
          <Button variant="outline" size="sm" onClick={goToToday} className="ml-2" icon={<MdToday />}>{t('calendar.today')}</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {weekDays.map(day => (
              <div key={day} className="py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px border-b border-gray-200">
            {days.map((day) => {
              const events = getEventsForDay(day);
              return (
                <div 
                  key={day.toString()} 
                  className={`min-h-[120px] bg-white p-2 transition-colors hover:bg-gray-50
                    ${!isSameMonth(day, monthStart) ? 'bg-gray-50 text-gray-400' : 'text-gray-900'}
                    ${isToday(day) ? 'bg-blue-50' : ''}
                  `}
                >
                  <div className={`text-right text-sm font-medium mb-1 ${isToday(day) ? 'text-blue-600' : ''}`}>
                    {format(day, dateFormat)}
                  </div>
                  <div className="space-y-1">
                    {events.map((event: any) => (
                      <div 
                        key={event.id} 
                        className={`text-xs p-1 rounded truncate cursor-pointer
                          ${event.type === 'task' 
                            ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500' 
                            : 'bg-green-100 text-green-700 border-l-2 border-green-500'
                          }`}
                        title={event.title}
                      >
                        {event.type === 'task' ? '✓ ' : '$ '}{event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};