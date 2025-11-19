import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import NavigationDrawer from '../NavigationDrawer';
import TopAppBar from '../TopAppBar';
import ContextualBreadcrumbs from '../ContextualBreadcrumbs';
import { useNavigation } from '../../contexts/NavigationContext';
import { colors } from '../../theme/palette';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 64;

/**
 * Main Layout Component
 * Layout wrapper principal com menu lateral, barra superior e breadcrumbs
 */
const MainLayout = ({ children, title, breadcrumbItems }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const { customBreadcrumbs, currentSession } = useNavigation();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerWidth = drawerOpen ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED;
  
  // Usar breadcrumbs customizados do contexto se disponíveis, senão usar os passados via props
  const finalBreadcrumbItems = customBreadcrumbs || breadcrumbItems;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top App Bar */}
      <TopAppBar
        onMenuClick={handleDrawerToggle}
        title={title}
        showFilters={currentSession === 'managers' || currentSession === 'reports'}
      />

      {/* Navigation Drawer */}
      <NavigationDrawer
        open={drawerOpen}
        onClose={handleDrawerToggle}
        variant={isMobile ? 'temporary' : 'persistent'}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { 
            xs: '100%',
            md: `calc(100% - ${drawerWidth}px)` 
          },
          mt: (currentSession === 'managers' || currentSession === 'reports') && !isMobile ? '120px' : '64px',
          ml: { 
            xs: 0,
            md: isMobile ? 0 : `${drawerWidth}px` 
          },
          backgroundColor: colors.cinzaMuitoClaro,
          minHeight: (currentSession === 'managers' || currentSession === 'reports') && !isMobile ? 'calc(100vh - 120px)' : 'calc(100vh - 64px)',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Contextual Breadcrumbs */}
        <ContextualBreadcrumbs items={finalBreadcrumbItems} />

        {/* Page Content */}
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;

