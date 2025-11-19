import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Box, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../../services/api';

/**
 * Shared Refresh Button component
 * Displays last update time and allows manual refresh
 */
const RefreshButton = ({ themeId = null, onRefreshComplete, size = 'medium' }) => {
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLastUpdate();
  }, [themeId]);

  const loadLastUpdate = async () => {
    try {
      const status = await api.getSystemStatus();
      const run = themeId 
        ? status.last_manual_run 
        : (status.last_automatic_run || status.last_manual_run);
      
      if (run && run.completed_at) {
        setLastUpdate(new Date(run.completed_at));
      }
    } catch (err) {
      console.error('Error loading last update:', err);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.triggerIngestion(themeId, 'user');
      
      if (result.success) {
        setLastUpdate(new Date());
        if (onRefreshComplete) {
          onRefreshComplete(result);
        }
      } else {
        setError(result.error || 'Falha na atualização');
      }
    } catch (err) {
      setError(err.message || 'Erro ao atualizar dados');
      console.error('Refresh error:', err);
    } finally {
      setLoading(false);
      // Reload last update after a short delay
      setTimeout(loadLastUpdate, 1000);
    }
  };

  const formatLastUpdate = (date) => {
    if (!date) return 'Nunca';
    try {
      return format(date, 'dd/MM/yyyy; HH:mm');
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Button
        variant="contained"
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
        onClick={handleRefresh}
        disabled={loading}
        size={size}
        sx={{
          backgroundColor: '#3038D5',
          '&:hover': {
            backgroundColor: '#0D9FB5'
          }
        }}
      >
        {loading ? 'Atualizando...' : 'Atualizar agora'}
      </Button>
      
      {lastUpdate && (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
          Última atualização: {formatLastUpdate(lastUpdate)}
        </Typography>
      )}
      
      {error && (
        <Typography variant="body2" color="error" sx={{ fontSize: '0.875rem' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default RefreshButton;

