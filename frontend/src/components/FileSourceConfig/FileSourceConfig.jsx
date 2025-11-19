import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Grid,
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../../services/api';
import { colors } from '../../theme/palette';

/**
 * FileSourceConfig Component
 * Componente específico para configuração de arquivos por tema
 * Suporta configuração obrigatória de múltiplos arquivos (ex: Trabalho Híbrido = 2 arquivos)
 */
const FileSourceConfig = ({ 
  theme, 
  dataSources = [], 
  requiredCount = null, // Número de arquivos obrigatórios (ex: 2 para Trabalho Híbrido)
  onUpdate 
}) => {
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [readInfo, setReadInfo] = useState(null);

  // Verificar se todos os arquivos obrigatórios estão configurados
  const isComplete = requiredCount ? dataSources.length >= requiredCount : true;
  const missingCount = requiredCount ? Math.max(0, requiredCount - dataSources.length) : 0;

  const handleAddFile = async () => {
    if (!newFileUrl.trim()) {
      setError('URL do SharePoint é obrigatória');
      return;
    }

    // Validar URL do SharePoint
    if (!newFileUrl.includes('sharepoint.com') && !newFileUrl.includes('sharepoint')) {
      setError('Por favor, insira uma URL válida do SharePoint');
      return;
    }

    try {
      setAdding(true);
      setError(null);
      setSuccess(null);
      setReadInfo(null);

      const result = await api.addDataSource(theme.id, {
        sharepoint_url: newFileUrl.trim(),
        source_name: newFileName.trim() || null,
        display_order: dataSources.length + 1
      });

      if (result.read_info) {
        setReadInfo(result.read_info);
        setSuccess(
          `Arquivo configurado com sucesso! ` +
          `${result.read_info.sheets.length} abas, ${result.read_info.rows_count} linhas detectadas`
        );
      } else {
        setSuccess('Arquivo configurado com sucesso!');
      }

      setNewFileUrl('');
      setNewFileName('');
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setError(err.message || 'Erro ao configurar arquivo. Verifique a URL e tente novamente.');
      console.error('Error adding file source:', err);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteFile = async (dataSourceId) => {
    if (requiredCount && dataSources.length <= requiredCount) {
      setError(`Este tema requer pelo menos ${requiredCount} arquivo(s). Não é possível remover.`);
      return;
    }

    try {
      await api.deleteDataSource(dataSourceId);
      setError(null);
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setError(err.message || 'Erro ao remover arquivo');
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Nunca';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <Box>
      {/* Header com status */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: colors.azulMarinho, fontWeight: 600 }}>
          Configuração de Arquivos
        </Typography>
        {requiredCount && (
          <Chip
            label={
              isComplete 
                ? `✓ ${dataSources.length}/${requiredCount} arquivos configurados`
                : `⚠ ${dataSources.length}/${requiredCount} arquivos (faltam ${missingCount})`
            }
            color={isComplete ? 'success' : 'warning'}
            size="small"
          />
        )}
      </Box>

      {/* Alerts */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }} 
          onClose={() => setError(null)}
          icon={<ErrorIcon />}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 2 }} 
          onClose={() => setSuccess(null)}
          icon={<CheckCircleIcon />}
        >
          {success}
        </Alert>
      )}

      {readInfo && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Arquivo lido com sucesso:</strong>
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
            <li>
              <Typography variant="body2">
                <strong>{readInfo.sheets.length}</strong> abas detectadas
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>{readInfo.rows_count}</strong> linhas totais
              </Typography>
            </li>
            {readInfo.sheets_detail && (
              <li>
                <Typography variant="body2" component="div">
                  <strong>Detalhes por aba:</strong>
                  <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
                    {Object.entries(readInfo.sheets_detail).map(([sheet, rows]) => (
                      <li key={sheet}>
                        <Typography variant="caption">
                          {sheet}: {rows} linhas
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </Typography>
              </li>
            )}
          </Box>
        </Alert>
      )}

      {/* Arquivos configurados */}
      {dataSources.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: colors.azulMarinho, fontWeight: 600 }}>
            Arquivos Configurados ({dataSources.length})
          </Typography>
          <Grid container spacing={2}>
            {dataSources.map((ds, idx) => (
              <Grid item xs={12} md={6} key={ds.id}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    border: `1px solid ${colors.cinzaClaro}`,
                    borderRadius: 1,
                    backgroundColor: colors.branco,
                    position: 'relative'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Box sx={{ flex: 1, pr: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {ds.source_name || `Arquivo ${idx + 1}`}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          wordBreak: 'break-all',
                          fontSize: '0.85rem',
                          mb: 1
                        }}
                      >
                        {ds.sharepoint_url}
                      </Typography>
                      
                      {/* Metadata */}
                      <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {ds.last_read_at && (
                          <Typography variant="caption" color="text.secondary">
                            <strong>Última leitura:</strong> {formatDateTime(ds.last_read_at)}
                          </Typography>
                        )}
                        {ds.sheets_count !== null && (
                          <Typography variant="caption" color="text.secondary">
                            <strong>Estrutura:</strong> {ds.sheets_count} abas, {ds.rows_count || 0} linhas
                          </Typography>
                        )}
                        {ds.last_file_modified && (
                          <Typography variant="caption" color="text.secondary">
                            <strong>Arquivo modificado:</strong> {formatDateTime(ds.last_file_modified)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteFile(ds.id)}
                      disabled={requiredCount && dataSources.length <= requiredCount}
                      title={
                        requiredCount && dataSources.length <= requiredCount
                          ? `Não é possível remover. Este tema requer ${requiredCount} arquivo(s).`
                          : 'Remover arquivo'
                      }
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  {ds.last_read_at && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Configurado"
                      color="success"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Formulário para adicionar novo arquivo */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          border: `2px dashed ${isComplete ? colors.cinzaClaro : colors.amarelo}`,
          borderRadius: 1,
          backgroundColor: colors.cinzaMuitoClaro
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CloudUploadIcon sx={{ color: colors.azulMarinho }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.azulMarinho }}>
            {dataSources.length === 0 
              ? 'Adicionar Primeiro Arquivo' 
              : requiredCount && dataSources.length < requiredCount
              ? `Adicionar Arquivo ${dataSources.length + 1} de ${requiredCount}`
              : 'Adicionar Arquivo Adicional'}
          </Typography>
        </Box>

        {requiredCount && dataSources.length < requiredCount && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Este tema requer <strong>{requiredCount} arquivo(s)</strong>. 
            {missingCount > 0 && ` Faltam ${missingCount} arquivo(s) para completar a configuração.`}
          </Alert>
        )}

        <TextField
          fullWidth
          label="URL do Arquivo SharePoint"
          value={newFileUrl}
          onChange={(e) => setNewFileUrl(e.target.value)}
          placeholder="https://exemplo.sharepoint.com/sites/.../arquivo.xlsx"
          size="medium"
          sx={{ mb: 2 }}
          required
          error={!!error && error.includes('URL')}
          helperText="Cole a URL completa do arquivo Excel no SharePoint"
        />

        <TextField
          fullWidth
          label="Nome do Arquivo (opcional)"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="Ex: Arquivo Principal - Trabalho Híbrido"
          size="medium"
          sx={{ mb: 2 }}
          helperText="Nome descritivo para identificar este arquivo"
        />

        <Button
          variant="contained"
          startIcon={adding ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
          onClick={handleAddFile}
          disabled={adding || !newFileUrl.trim()}
          size="large"
          sx={{
            backgroundColor: colors.azulMarinho,
            '&:hover': {
              backgroundColor: colors.azulVioleta
            }
          }}
        >
          {adding ? 'Configurando...' : 'Adicionar Arquivo'}
        </Button>
      </Paper>

      {/* Instruções */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: colors.cinzaMuitoClaro, borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Como obter a URL do SharePoint:</strong>
        </Typography>
        <Box component="ol" sx={{ pl: 2, mt: 1, mb: 0 }}>
          <li>
            <Typography variant="body2" color="text.secondary">
              Abra o arquivo Excel no SharePoint
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              Clique em "Abrir no navegador" ou copie a URL da barra de endereços
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              Cole a URL completa no campo acima
            </Typography>
          </li>
        </Box>
      </Box>
    </Box>
  );
};

export default FileSourceConfig;

