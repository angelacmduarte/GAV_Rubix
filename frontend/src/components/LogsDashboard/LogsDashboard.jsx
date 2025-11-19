import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { Download as DownloadIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../../services/api';

/**
 * Logs Dashboard component
 * Displays ingestion and test run logs with filtering and export
 */
const LogsDashboard = () => {
  const [ingestionRuns, setIngestionRuns] = useState([]);
  const [testRuns, setTestRuns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [themeFilter, setThemeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    loadThemes();
    loadLogs();
  }, []);

  useEffect(() => {
    loadLogs();
  }, [themeFilter, statusFilter]);

  const loadThemes = async () => {
    try {
      const data = await api.getThemes();
      setThemes(data);
    } catch (err) {
      console.error('Error loading themes:', err);
    }
  };

  const loadLogs = async () => {
    setLoading(true);
    try {
      const [ingestion, tests] = await Promise.all([
        api.getIngestionRuns(
          themeFilter ? parseInt(themeFilter) : null,
          100,
          statusFilter || null
        ),
        api.getTestRuns(
          themeFilter ? parseInt(themeFilter) : null,
          100,
          statusFilter || null
        )
      ]);
      setIngestionRuns(ingestion);
      setTestRuns(tests);
    } catch (err) {
      console.error('Error loading logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value).replace(/,/g, ';');
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
    } catch {
      return 'Data inválida';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
      case 'passed':
        return 'success';
      case 'failed':
        return 'error';
      case 'running':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ color: '#000066', fontWeight: 600 }}>
          Dashboard de Logs
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Atualizar logs">
            <IconButton onClick={loadLogs} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Tema</InputLabel>
          <Select
            value={themeFilter}
            label="Tema"
            onChange={(e) => setThemeFilter(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {themes.map((theme) => (
              <MenuItem key={theme.id} value={theme.id}>
                {theme.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="success">Sucesso</MenuItem>
            <MenuItem value="failed">Falha</MenuItem>
            <MenuItem value="running">Em Execução</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Ingestion Runs Table */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3, color: '#000066' }}>
        Execuções de Ingestão
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <Button
            size="small"
            startIcon={<DownloadIcon />}
            onClick={() => exportToCSV(ingestionRuns, 'ingestion_runs.csv')}
            disabled={ingestionRuns.length === 0}
          >
            Exportar CSV
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data/Hora</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Tema</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Duração (s)</TableCell>
              <TableCell>Linhas</TableCell>
              <TableCell>Erro</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingestionRuns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nenhuma execução encontrada
                </TableCell>
              </TableRow>
            ) : (
              ingestionRuns.map((run) => (
                <TableRow key={run.id}>
                  <TableCell>{formatDateTime(run.started_at)}</TableCell>
                  <TableCell>
                    <Chip
                      label={run.trigger_type}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{run.theme_id || 'Global'}</TableCell>
                  <TableCell>
                    <Chip
                      label={run.status}
                      color={getStatusColor(run.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {run.duration_seconds ? run.duration_seconds.toFixed(2) : 'N/A'}
                  </TableCell>
                  <TableCell>{run.rows_imported || '-'}</TableCell>
                  <TableCell>
                    {run.error_message ? (
                      <Tooltip title={run.error_message}>
                        <Typography variant="body2" color="error" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {run.error_message}
                        </Typography>
                      </Tooltip>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Test Runs Table */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3, color: '#000066' }}>
        Execuções de Testes
      </Typography>
      <TableContainer component={Paper}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <Button
            size="small"
            startIcon={<DownloadIcon />}
            onClick={() => exportToCSV(testRuns, 'test_runs.csv')}
            disabled={testRuns.length === 0}
          >
            Exportar CSV
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data/Hora</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Tema</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Duração (s)</TableCell>
              <TableCell>Executor</TableCell>
              <TableCell>Erro</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testRuns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nenhum teste encontrado
                </TableCell>
              </TableRow>
            ) : (
              testRuns.map((run) => (
                <TableRow key={run.id}>
                  <TableCell>{formatDateTime(run.started_at)}</TableCell>
                  <TableCell>
                    <Chip
                      label={run.test_type}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{run.theme_id}</TableCell>
                  <TableCell>
                    <Chip
                      label={run.status}
                      color={getStatusColor(run.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {run.duration_seconds ? run.duration_seconds.toFixed(2) : 'N/A'}
                  </TableCell>
                  <TableCell>{run.triggered_by || '-'}</TableCell>
                  <TableCell>
                    {run.error_message ? (
                      <Tooltip title={run.error_message}>
                        <Typography variant="body2" color="error" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {run.error_message}
                        </Typography>
                      </Tooltip>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LogsDashboard;

