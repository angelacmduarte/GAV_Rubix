import React, { useEffect } from 'react';
import { Container, Box, Typography, Alert, Grid, Card, CardContent } from '@mui/material';
import MainLayout from '../../components/MainLayout';
import { useNavigation } from '../../contexts/NavigationContext';

/**
 * Managers Dashboard Page
 * Página para dashboards de gestores
 * Base preparada para receber dashboards detalhados por tema
 */
const ManagersDashboard = () => {
  const { setBreadcrumbs, clearBreadcrumbs } = useNavigation();

  useEffect(() => {
    // Definir breadcrumbs específicos para esta página
    setBreadcrumbs([
      { label: 'GAV Rubix', path: '/' },
      { label: 'Dashboards Gestores', path: '/managers' }
    ]);

    // Limpar breadcrumbs ao desmontar
    return () => {
      clearBreadcrumbs();
    };
  }, [setBreadcrumbs, clearBreadcrumbs]);

  return (
    <MainLayout title="Dashboards Gestores">
      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#000066', fontWeight: 600, mb: 1 }}>
            Dashboards Gestores
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Visão consolidada para gestores com KPIs, alertas e insights por tema
          </Typography>
        </Box>

        {/* Placeholder Content */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Esta seção será implementada em breve. Aqui estarão os dashboards detalhados para gestores com:
              <ul style={{ marginTop: 8, marginBottom: 0 }}>
                <li>Tabelas e visualizações por tema</li>
                <li>KPIs e métricas consolidadas</li>
                <li>Alertas e insights acionáveis</li>
                <li>Filtros por tribo/squad</li>
              </ul>
            </Alert>
          </Grid>

          {/* Placeholder Cards */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: '#000066' }}>
                  Trabalho Híbrido
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dashboard de trabalho híbrido será exibido aqui
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: '#000066' }}>
                  Health Check
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dashboard de health check será exibido aqui
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default ManagersDashboard;

