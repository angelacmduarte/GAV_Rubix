import React, { useEffect } from 'react';
import { Container, Box, Typography, Alert, Grid, Card, CardContent } from '@mui/material';
import MainLayout from '../../components/MainLayout';
import { useNavigation } from '../../contexts/NavigationContext';

/**
 * Reports Page
 * Página para relatórios detalhados por tema
 */
const ReportsPage = () => {
  const { setBreadcrumbs, clearBreadcrumbs } = useNavigation();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'GAV Rubix', path: '/' },
      { label: 'Relatórios', path: '/reports' }
    ]);

    return () => {
      clearBreadcrumbs();
    };
  }, [setBreadcrumbs, clearBreadcrumbs]);

  return (
    <MainLayout title="Relatórios">
      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#000066', fontWeight: 600, mb: 1 }}>
            Relatórios
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Análises detalhadas e relatórios por tema configurado
          </Typography>
        </Box>

        {/* Placeholder Content */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Esta seção será implementada em breve. Aqui estarão os relatórios detalhados com:
              <ul style={{ marginTop: 8, marginBottom: 0 }}>
                <li>Análises por tema (Trabalho Híbrido, Health Check, 1-1s, Feedbacks)</li>
                <li>Exportação de dados (CSV, Excel, PDF)</li>
                <li>Filtros avançados e comparações temporais</li>
                <li>Visualizações interativas</li>
              </ul>
            </Alert>
          </Grid>

          {/* Placeholder Cards */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: '#000066' }}>
                  Trabalho Híbrido
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Relatório de trabalho híbrido
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: '#000066' }}>
                  Health Check
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Relatório de health check
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: '#000066' }}>
                  1-1s
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Relatório de 1-1s
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default ReportsPage;

