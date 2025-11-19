import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, Alert } from '@mui/material';
import { Schedule as ScheduleIcon, Warning as WarningIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../../services/api';

/**
 * Status Cards component for Admin Console header
 * Shows system-wide status including last automatic run and alerts
 */
const StatusCards = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatus();
    // Refresh every 30 seconds
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const data = await api.getSystemStatus();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading status:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return 'Data inválida';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      case 'running':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading && !status) {
    return <Typography>Carregando status...</Typography>;
  }

  if (error) {
    return <Alert severity="error">Erro ao carregar status: {error}</Alert>;
  }

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {/* Last Automatic Run Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ScheduleIcon sx={{ mr: 1, color: '#3038D5' }} />
              <Typography variant="h6" component="h3">
                Rotina 07h
              </Typography>
            </Box>
            {status?.last_automatic_run ? (
              <>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Última execução: {formatDateTime(status.last_automatic_run.started_at)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Chip
                    label={status.last_automatic_run.status}
                    color={getStatusColor(status.last_automatic_run.status)}
                    size="small"
                  />
                  {status.last_automatic_run.duration_seconds && (
                    <Typography variant="caption" color="text.secondary">
                      {status.last_automatic_run.duration_seconds.toFixed(1)}s
                    </Typography>
                  )}
                </Box>
                {status.last_automatic_run.rows_imported !== null && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {status.last_automatic_run.rows_imported} linhas importadas
                  </Typography>
                )}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhuma execução automática ainda
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Alerts Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WarningIcon sx={{ mr: 1, color: '#FC6D3A' }} />
              <Typography variant="h6" component="h3">
                Alertas Recentes
              </Typography>
            </Box>
            {status?.recent_alerts && status.recent_alerts.length > 0 ? (
              <Box>
                {status.recent_alerts.slice(0, 3).map((alert, idx) => (
                  <Box key={idx} sx={{ mb: 1 }}>
                    <Typography variant="body2" color="error">
                      {formatDateTime(alert.started_at)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {alert.error_message || 'Falha na execução'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon sx={{ color: '#0BDA5E', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  Nenhum alerta
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Themes Summary Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircleIcon sx={{ mr: 1, color: '#0D9FB5' }} />
              <Typography variant="h6" component="h3">
                Temas
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ color: '#000066', fontWeight: 600 }}>
              {status?.themes_published || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              de {status?.themes_total || 0} publicados
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatusCards;

