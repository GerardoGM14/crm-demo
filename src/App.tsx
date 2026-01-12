import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Opportunities } from './pages/Opportunities';
import { Users } from './pages/Users';
import { Tasks } from './pages/Tasks';
import { Calendar } from './pages/Calendar';
import { Reports } from './pages/Reports';
import { Messages } from './pages/Messages';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Help />} />
              
              {/* Manager & Admin */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />}>
                <Route path="/reports" element={<Reports />} />
              </Route>

              {/* Admin Only */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/users" element={<Users />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
