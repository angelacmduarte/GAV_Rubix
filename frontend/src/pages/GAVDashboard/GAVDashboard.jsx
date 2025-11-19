import React, { useEffect } from 'react';
import { Container, Box, Typography, Alert, Grid, Card, CardContent, Button } from '@mui/material';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import MainLayout from '../../components/MainLayout';
import { useNavigation } from '../../contexts/NavigationContext';

/**
 * GAV Dashboard Page
 * Página para dashboards rotativos GAV Rubix otimizados para monitores/TV
 */
const GAVDashboard = () => {
  const { setBreadcrumbs, clearBreadcrumbs } = useNavigation();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'GAV Rubix', path: '/' },
      { label: 'GAV Rubix Dashboards', path: '/gav' }
    ]);

    return () => {
      clearBreadcrumbs();
    };
  }, [setBreadcrumbs, clearBreadcrumbs]);

  return (
    <MainLayout title="GAV Rubix Dashboards">
      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#000066', fontWeight: 600, mb: 1 }}>
            GAV Rubix Dashboards
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Dashboards rotativos otimizados para exibição em monitores e TVs
          </Typography>
        </Box>

        {/* Placeholder Content */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Esta seção será implementada em breve. Aqui estarão os dashboards rotativos com:
              <ul style={{ marginTop: 8, marginBottom: 0 }}>
                <li>URLs dedicadas para cada dashboard</li>
                <li>Componente de slideshow automático</li>
                <li>Controle manual para override</li>
                <li>Otimização para telas grandes (TVs/monitores)</li>
                <li>Modo fullscreen e rotação automática</li>
              </ul>
            </Alert>
          </Grid>

          {/* Placeholder Cards */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: '#000066' }}>
                  Dashboard Trabalho Híbrido
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  URL: /gav/trabalho-hibrido
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<OpenInNewIcon />}
                  disabled
                >
                  Abrir Dashboard
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: '#000066' }}>
                  Dashboard Health Check
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  URL: /gav/health-check
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<OpenInNewIcon />}
                  disabled
                >
                  Abrir Dashboard
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default GAVDashboard;

