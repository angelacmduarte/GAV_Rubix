import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme/theme';
import { NavigationProvider } from './contexts/NavigationContext';
import AdminConsole from './pages/AdminConsole';
import ManagersDashboard from './pages/ManagersDashboard';
import ReportsPage from './pages/ReportsPage';
import GAVDashboard from './pages/GAVDashboard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavigationProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/admin" element={<AdminConsole />} />
            <Route path="/managers" element={<ManagersDashboard />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/gav" element={<GAVDashboard />} />
            {/* Rota catch-all para redirecionar para admin */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </NavigationProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;

