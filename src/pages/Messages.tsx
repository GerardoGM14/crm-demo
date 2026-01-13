import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MdSearch, MdStarBorder, MdDelete, MdReply, MdArchive, MdMarkEmailRead } from 'react-icons/md';
import { storage } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import type { Message } from '../types';

export const Messages: React.FC = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    const data = storage.getAll<Message>(storage.KEYS.MESSAGES);
    setMessages(data);
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      const updatedMessages = messages.map(m => m.id === message.id ? { ...m, read: true } : m);
      setMessages(updatedMessages);
      storage.saveAll(storage.KEYS.MESSAGES, updatedMessages);
    }
  };

  const handleDelete = (id: string) => {
    const updatedMessages = messages.filter(m => m.id !== id);
    setMessages(updatedMessages);
    storage.saveAll(storage.KEYS.MESSAGES, updatedMessages);
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  const filteredMessages = messages.filter(m => 
    m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('messages.title')}</h1>
      
      <Card className="flex-1 flex overflow-hidden">
        {/* Message List */}
        <div className={`w-full md:w-1/3 border-r border-gray-100 flex flex-col ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100">
            <Input 
              placeholder={t('messages.search_placeholder')} 
              icon={<MdSearch />} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.length === 0 ? (
               <div className="p-8 text-center text-gray-500 text-sm">{t('messages.no_messages')}</div>
            ) : (
              filteredMessages.map(message => (
                <div 
                  key={message.id}
                  onClick={() => handleSelectMessage(message)}
                  className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50
                    ${selectedMessage?.id === message.id ? 'bg-blue-50' : ''}
                    ${!message.read ? 'bg-white font-semibold' : 'bg-white text-gray-600'}
                  `}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="truncate font-medium">{message.from}</span>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {new Date(message.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')}
                    </span>
                  </div>
                  <div className="text-sm truncate mb-1">{message.subject}</div>
                  <div className="text-xs text-gray-400 truncate">{message.content}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className={`flex-1 flex flex-col bg-white ${!selectedMessage ? 'hidden md:flex' : 'flex'}`}>
          {selectedMessage ? (
            <>
              <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  {selectedMessage.avatar ? (
                    <img src={selectedMessage.avatar} alt={selectedMessage.from} className="w-12 h-12 rounded-full" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {selectedMessage.from.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                    <div className="text-sm text-gray-500">
                      {t('messages.from')} <span className="font-medium text-gray-900">{selectedMessage.from}</span>
                      <span className="mx-2">•</span>
                      {new Date(selectedMessage.date).toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="sm" icon={<MdStarBorder />} />
                   <Button variant="ghost" size="sm" icon={<MdArchive />} />
                   <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(selectedMessage.id)} icon={<MdDelete />} />
                </div>
              </div>
              
              <div className="flex-1 p-8 overflow-y-auto">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.content}
                </p>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
                 <Button variant="outline" onClick={() => setSelectedMessage(null)} className="md:hidden">{t('messages.back')}</Button>
                 <Button icon={<MdReply />}>{t('messages.reply')}</Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MdMarkEmailRead className="w-16 h-16 mb-4 opacity-20" />
              <p>{t('messages.select_prompt')}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};