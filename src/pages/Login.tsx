import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MdEmail, MdLock, MdDashboard, MdAdminPanelSettings, MdManageAccounts, MdTrendingUp } from 'react-icons/md';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@crm.com');
  const [password, setPassword] = useState('password'); // Dummy password
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(email);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid credentials. Try admin@crm.com');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-white to-gray-200">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Image & Branding */}
        <div className="w-full md:w-1/2 relative bg-blue-600 hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
            alt="CRM Dashboard" 
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-blue-800/50 flex flex-col items-center justify-center text-white p-12 text-center">
            <div className="mb-6 p-4 bg-white/10 rounded-full backdrop-blur-sm">
              <MdDashboard className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Manage Your Customer Relationships</h2>
            <p className="text-blue-100 text-lg">
              Boost sales, track leads, and close more deals with our all-in-one CRM solution.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">Sign in to your CRM account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<MdEmail />}
              placeholder="Enter your email"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<MdLock />}
              placeholder="Enter your password"
              required
            />

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-center text-sm text-gray-500 mb-4">Quick Demo Access:</p>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  type="button"
                  onClick={() => { setEmail('admin@crm.com'); setPassword('password'); }}
                  className="flex items-center justify-center px-2 py-2 text-xs font-medium bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                >
                  <MdAdminPanelSettings className="w-4 h-4 mr-1.5" />
                  Admin
                </button>
                <button 
                  type="button"
                  onClick={() => { setEmail('manager@crm.com'); setPassword('password'); }}
                  className="flex items-center justify-center px-2 py-2 text-xs font-medium bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors"
                >
                  <MdManageAccounts className="w-4 h-4 mr-1.5" />
                  Manager
                </button>
                <button 
                  type="button"
                  onClick={() => { setEmail('sales@crm.com'); setPassword('password'); }}
                  className="flex items-center justify-center px-2 py-2 text-xs font-medium bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                >
                  <MdTrendingUp className="w-4 h-4 mr-1.5" />
                  Sales
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
