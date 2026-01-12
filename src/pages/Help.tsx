import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { MdExpandMore, MdHelpOutline, MdEmail, MdPhone } from 'react-icons/md';

export const Help: React.FC = () => {
  const faqs = [
    { question: 'How do I add a new lead?', answer: 'Navigate to the Leads page and click the "Add Lead" button in the top right corner. Fill out the form details and click Save.' },
    { question: 'How can I change my password?', answer: 'Go to Settings > Profile and scroll down to the "Change Password" section.' },
    { question: 'What do the different deal stages mean?', answer: 'Prospecting: Initial contact. Negotiation: Discussing terms. Closed Won: Deal signed. Closed Lost: Deal lost.' },
    { question: 'Can I export my reports?', answer: 'Currently this feature is in development for the next version.' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">How can we help you?</h1>
        <p className="text-gray-500 mt-2">Browse our FAQ or contact support</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-blue-100 bg-blue-50">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-white rounded-full text-blue-600 shadow-sm">
              <MdEmail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Email Support</h3>
              <p className="text-sm text-gray-500">support@crm-demo.com</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-green-100 bg-green-50">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-white rounded-full text-green-600 shadow-sm">
              <MdPhone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Call Us</h3>
              <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MdHelpOutline /> Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-gray-100">
          {faqs.map((faq, index) => (
            <details key={index} className="group py-4 cursor-pointer">
              <summary className="flex justify-between items-center font-medium text-gray-900 list-none">
                {faq.question}
                <MdExpandMore className="transition-transform group-open:rotate-180 text-gray-400" />
              </summary>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed pl-4 border-l-2 border-gray-100">
                {faq.answer}
              </p>
            </details>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};