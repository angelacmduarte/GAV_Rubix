import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  Tv as TvIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';
import { useNavigation } from '../../contexts/NavigationContext';
import { colors } from '../../theme/palette';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 64;

/**
 * Navigation Drawer Component
 * Menu lateral responsivo com navegação entre sessões
 */
const NavigationDrawer = ({ open, onClose, variant = 'persistent' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentSession, navigateToSession } = useNavigation();

  const menuItems = [
    {
      id: 'admin',
      sessionId: 'admin',
      label: 'Admin Console',
      icon: <SettingsIcon />,
      path: '/admin',
      description: 'Configuração e gestão'
    },
    {
      id: 'managers',
      sessionId: 'managers',
      label: 'Dashboards Gestores',
      icon: <DashboardIcon />,
      path: '/managers',
      description: 'Visão para gestores',
      badge: 'Em breve'
    },
    {
      id: 'reports',
      sessionId: 'reports',
      label: 'Relatórios',
      icon: <AssessmentIcon />,
      path: '/reports',
      description: 'Análises detalhadas',
      badge: 'Em breve'
    },
    {
      id: 'gav',
      sessionId: 'gav',
      label: 'GAV Rubix',
      icon: <TvIcon />,
      path: '/gav',
      description: 'Dashboards rotativos',
      badge: 'Em breve'
    }
  ];

  const handleNavigation = (path, sessionId) => {
    if (sessionId) {
      navigateToSession(sessionId);
    } else {
      navigate(path);
    }
    if (isMobile) {
      onClose();
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          backgroundColor: colors.branco,
          borderRight: `1px solid ${colors.cinzaClaro}`,
          overflowX: 'hidden'
        },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          px: open ? 2 : 1,
          minHeight: '64px !important',
          backgroundColor: colors.azulMarinho,
          color: colors.branco
        }}
      >
        {open && (
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 600,
              fontSize: '1.1rem'
            }}
          >
            GAV Rubix
          </Typography>
        )}
        {open && !isMobile && (
          <IconButton
            onClick={onClose}
            sx={{
              color: colors.branco,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
        {!open && !isMobile && (
          <IconButton
            onClick={onClose}
            sx={{
              color: colors.branco,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
      
      <Divider />
      
      <List sx={{ px: open ? 1 : 0.5, py: 1 }}>
        {menuItems.map((item) => {
          const active = isActive(item.path) || currentSession === item.sessionId;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path, item.sessionId)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: open ? 2.5 : 1.5,
                  borderRadius: 1,
                  backgroundColor: active ? colors.azulMarinho : 'transparent',
                  color: active ? colors.branco : colors.preto,
                  '&:hover': {
                    backgroundColor: active 
                      ? colors.azulVioleta 
                      : colors.cinzaMuitoClaro
                  },
                  '& .MuiListItemIcon-root': {
                    minWidth: open ? 40 : 0,
                    color: active ? colors.branco : colors.azulMarinho,
                    justifyContent: 'center'
                  },
                  '& .MuiListItemText-primary': {
                    fontWeight: active ? 600 : 400,
                    fontSize: '0.95rem'
                  }
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.label}
                    secondary={item.description}
                    secondaryTypographyProps={{
                      fontSize: '0.75rem',
                      color: active ? 'rgba(255, 255, 255, 0.7)' : colors.azulMarinho,
                      mt: 0.5
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default NavigationDrawer;

