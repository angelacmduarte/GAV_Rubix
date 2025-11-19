import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon
} from '@mui/icons-material';
import TribeSquadFilter from '../TribeSquadFilter';
import { useNavigation } from '../../contexts/NavigationContext';
import { colors } from '../../theme/palette';

/**
 * Top App Bar Component
 * Barra superior com título e controles principais
 */
const TopAppBar = ({ onMenuClick, title = 'GAV Rubix', children, showFilters = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { filters, updateFilters, clearFilters } = useNavigation();

  const handleTribeChange = (tribeId) => {
    updateFilters({ tribe: tribeId, squad: null }); // Limpar squad ao trocar tribo
  };

  const handleSquadChange = (squadId) => {
    updateFilters({ squad: squadId });
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: colors.branco,
        color: colors.preto,
        boxShadow: `0 1px 3px ${colors.cinzaClaro}`,
        borderBottom: `1px solid ${colors.cinzaClaro}`
      }}
    >
      <Toolbar 
        sx={{ 
          flexDirection: 'column', 
          alignItems: 'stretch', 
          py: 1,
          minHeight: showFilters && !isMobile ? '120px !important' : '64px !important'
        }}
      >
        {/* First Row: Title and Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', minHeight: '48px' }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              color: colors.azulMarinho,
              fontWeight: 600,
              fontSize: '1.25rem'
            }}
          >
            {title}
          </Typography>
          
          {children && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {children}
            </Box>
          )}
        </Box>

        {/* Second Row: Filters */}
        {showFilters && !isMobile && (
          <Box sx={{ mt: 1, width: '100%' }}>
            <TribeSquadFilter
              selectedTribe={filters.tribe}
              selectedSquad={filters.squad}
              onTribeChange={handleTribeChange}
              onSquadChange={handleSquadChange}
              onClear={handleClearFilters}
            />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;

