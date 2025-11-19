import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Alert } from '@mui/material';
import MainLayout from '../../components/MainLayout';
import StatusCards from '../../components/StatusCards';
import RefreshButton from '../../components/RefreshButton';
import ThemeCard from '../../components/ThemeCard';
import LogsDashboard from '../../components/LogsDashboard';
import api from '../../services/api';

/**
 * Admin Console main page
 * Unified layout with status cards and theme configuration sections
 */
const AdminConsole = () => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getThemes();
      setThemes(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar temas');
      console.error('Error loading themes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeUpdate = () => {
    loadThemes();
  };

  return (
    <MainLayout title="Admin Console">
      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#000066', fontWeight: 600 }}>
            Admin Console
          </Typography>
          <RefreshButton onRefreshComplete={(result) => {
            console.log('Refresh completed:', result);
            loadThemes();
          }} />
        </Box>

        {/* Status Cards */}
        <StatusCards />

        {/* Theme Configuration Sections */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3, color: '#000066' }}>
            Configuração de Temas
          </Typography>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }} 
              onClose={() => setError(null)}
              title="Erro ao carregar dados"
            >
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Erro de Conexão
              </Typography>
              <Typography variant="body2">
                {error}
              </Typography>
              <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Como resolver:
                </Typography>
                <Box component="ol" sx={{ pl: 2, m: 0 }}>
                  <li>
                    <Typography variant="body2">
                      Verifique se o backend está rodando
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Abra um terminal e execute: <code>cd backend && python run.py</code>
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      O servidor deve estar em: <code>http://127.0.0.1:5000</code>
                    </Typography>
                  </li>
                </Box>
              </Box>
            </Alert>
          )}

          {!loading && !error && themes.length === 0 && (
            <Alert severity="info">
              Nenhum tema configurado ainda. Use a API para criar o primeiro tema.
            </Alert>
          )}

          {!loading && themes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              onUpdate={handleThemeUpdate}
            />
          ))}
        </Box>

        {/* Logs Dashboard */}
        <LogsDashboard />
      </Container>
    </MainLayout>
  );
};

export default AdminConsole;

