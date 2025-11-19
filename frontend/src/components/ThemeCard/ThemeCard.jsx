import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Button,
  TextField,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  Publish as PublishIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../../services/api';
import FileSourceConfig from '../FileSourceConfig';
import { colors } from '../../theme/palette';

/**
 * Theme Card component
 * Displays theme configuration with data sources, test/publish controls
 */
const ThemeCard = ({ theme, onUpdate }) => {
  // Expandir por padrão se não houver arquivos configurados ou se for Trabalho Híbrido sem os 2 arquivos
  const shouldExpandByDefault = 
    (theme.data_sources || []).length === 0 || 
    (theme.name === 'Trabalho Híbrido' && (theme.data_sources || []).length < 2);
  const [expanded, setExpanded] = useState(shouldExpandByDefault);
  const [themeData, setThemeData] = useState(theme);
  const [dataSources, setDataSources] = useState(theme.data_sources || []);
  const [testing, setTesting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [testHistoryOpen, setTestHistoryOpen] = useState(false);
  const [testHistory, setTestHistory] = useState([]);
  const [ingestionHistory, setIngestionHistory] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setThemeData(theme);
    setDataSources(theme.data_sources || []);
  }, [theme]);


  const handleTest = async () => {
    setTesting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await api.runTest(theme.id);
      
      if (result.status === 'passed') {
        setSuccess('Teste automatizado passou! Deseja executar teste manual?');
        // In a real implementation, show a dialog asking for manual test confirmation
      } else {
        setError('Teste automatizado falhou. Verifique os logs.');
      }
    } catch (err) {
      setError(err.message || 'Erro ao executar teste');
    } finally {
      setTesting(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    setError(null);

    try {
      // Check if can publish
      const canPublish = await api.canPublish(theme.id);
      
      if (!canPublish.can_publish) {
        setError(`Não é possível publicar: ${canPublish.reason}`);
        setPublishing(false);
        return;
      }

      const result = await api.publishTheme(theme.id, 'user');
      setThemeData({ ...themeData, status: 'published' });
      setSuccess('Tema publicado com sucesso!');
      
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message || 'Erro ao publicar tema');
    } finally {
      setPublishing(false);
    }
  };

  const loadTestHistory = async () => {
    try {
      const history = await api.getTestRuns(theme.id, 10);
      setTestHistory(history);
    } catch (err) {
      console.error('Error loading test history:', err);
    }
  };

  const loadIngestionHistory = async () => {
    try {
      const history = await api.getIngestionRuns(theme.id, 10);
      setIngestionHistory(history);
    } catch (err) {
      console.error('Error loading ingestion history:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'testing':
        return 'warning';
      case 'approved':
        return 'info';
      default:
        return 'default';
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

  return (
    <Card sx={{ mb: 3, border: `1px solid #E5E5E5` }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ color: '#000066', fontWeight: 600 }}>
              {themeData.name}
            </Typography>
            <Chip
              label={themeData.status}
              color={getStatusColor(themeData.status)}
              size="small"
            />
          </Box>
        }
        subheader={themeData.description || 'Sem descrição'}
        action={
          <IconButton onClick={() => setExpanded(!expanded)}>
            <ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </IconButton>
        }
      />
      
      <CardContent>
        {/* Alerta se Trabalho Híbrido não tiver os 2 arquivos */}
        {themeData.name === 'Trabalho Híbrido' && dataSources.length < 2 && (
          <Alert 
            severity="warning" 
            sx={{ mb: 2 }}
            action={
              <Button 
                size="small" 
                onClick={() => setExpanded(true)}
                sx={{ color: 'inherit' }}
              >
                Configurar
              </Button>
            }
          >
            <strong>Atenção:</strong> Este tema requer 2 arquivos Excel do SharePoint. 
            {dataSources.length === 0 
              ? ' Nenhum arquivo configurado ainda.' 
              : ` Faltam ${2 - dataSources.length} arquivo(s).`}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}


        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<PlayArrowIcon />}
            onClick={handleTest}
            disabled={testing}
            size="small"
          >
            {testing ? 'Testando...' : 'Testar'}
          </Button>
          
          <Button
            variant="contained"
            startIcon={<PublishIcon />}
            onClick={handlePublish}
            disabled={publishing || themeData.status === 'published'}
            size="small"
            sx={{
              backgroundColor: '#0D9FB5',
              '&:hover': { backgroundColor: '#0B8FA3' }
            }}
          >
            {publishing ? 'Publicando...' : 'Publicar'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => {
              setTestHistoryOpen(true);
              loadTestHistory();
              loadIngestionHistory();
            }}
            size="small"
          >
            Ver Histórico
          </Button>
        </Box>

        <Accordion 
          expanded={expanded} 
          onChange={(e, isExpanded) => setExpanded(isExpanded)}
          sx={{
            mt: 2,
            '&:before': {
              display: 'none'
            },
            border: `1px solid ${colors.cinzaClaro}`,
            borderRadius: 1
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: themeData.name === 'Trabalho Híbrido' && dataSources.length < 2 
                ? '#FFF3CD' 
                : colors.cinzaMuitoClaro,
              '&:hover': {
                backgroundColor: themeData.name === 'Trabalho Híbrido' && dataSources.length < 2
                  ? '#FFE69C'
                  : colors.cinzaClaro
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.azulMarinho }}>
                📁 Configuração de Arquivos
              </Typography>
              <Chip 
                label={`${dataSources.length} arquivo(s)`}
                size="small"
                color={dataSources.length > 0 ? 'primary' : 'default'}
              />
              {themeData.name === 'Trabalho Híbrido' && dataSources.length < 2 && (
                <Chip 
                  label={`⚠ Faltam ${2 - dataSources.length} arquivo(s)`} 
                  color="warning" 
                  size="small"
                />
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {/* Usar novo componente FileSourceConfig para temas específicos */}
            {themeData.name === 'Trabalho Híbrido' ? (
              <FileSourceConfig
                theme={themeData}
                dataSources={dataSources}
                requiredCount={2}
                onUpdate={onUpdate}
              />
            ) : (
              <FileSourceConfig
                theme={themeData}
                dataSources={dataSources}
                requiredCount={null}
                onUpdate={onUpdate}
              />
            )}
          </AccordionDetails>
        </Accordion>
      </CardContent>

      {/* History Dialog */}
      <Dialog
        open={testHistoryOpen}
        onClose={() => setTestHistoryOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Histórico - {themeData.name}</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
            Testes
          </Typography>
          <List>
            {testHistory.length > 0 ? (
              testHistory.map((test) => (
                <React.Fragment key={test.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={test.status}
                            color={test.status === 'passed' ? 'success' : 'error'}
                            size="small"
                          />
                          <Typography variant="body2">
                            {test.test_type} - {formatDateTime(test.started_at)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        test.duration_seconds
                          ? `Duração: ${test.duration_seconds.toFixed(1)}s`
                          : test.error_message
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="Nenhum teste executado ainda" />
              </ListItem>
            )}
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Ingestões
          </Typography>
          <List>
            {ingestionHistory.length > 0 ? (
              ingestionHistory.map((ingestion) => (
                <React.Fragment key={ingestion.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={ingestion.status}
                            color={ingestion.status === 'success' ? 'success' : 'error'}
                            size="small"
                          />
                          <Typography variant="body2">
                            {ingestion.trigger_type} - {formatDateTime(ingestion.started_at)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        ingestion.rows_imported !== null
                          ? `${ingestion.rows_imported} linhas importadas`
                          : ingestion.error_message
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="Nenhuma ingestão registrada ainda" />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestHistoryOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ThemeCard;

