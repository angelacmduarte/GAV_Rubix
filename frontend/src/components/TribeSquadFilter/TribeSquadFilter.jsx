import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Clear as ClearIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import api from '../../services/api';
import { colors } from '../../theme/palette';

/**
 * TribeSquadFilter Component
 * Componente de filtro por tribo e squad
 */
const TribeSquadFilter = ({ selectedTribe, selectedSquad, onTribeChange, onSquadChange, onClear }) => {
  const [tribes, setTribes] = useState([]);
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar tribos
  useEffect(() => {
    loadTribes();
  }, []);

  // Carregar squads quando uma tribo for selecionada
  useEffect(() => {
    if (selectedTribe) {
      loadSquads(selectedTribe);
    } else {
      setSquads([]);
    }
  }, [selectedTribe]);

  const loadTribes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTribes(false);
      setTribes(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar tribos');
      console.error('Error loading tribes:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSquads = async (tribeId) => {
    try {
      setError(null);
      const data = await api.getSquads(tribeId, false);
      setSquads(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar squads');
      console.error('Error loading squads:', err);
      setSquads([]);
    }
  };

  const handleTribeChange = (event) => {
    const tribeId = event.target.value;
    onTribeChange(tribeId || null);
    // Limpar squad quando trocar de tribo
    if (tribeId !== selectedTribe) {
      onSquadChange(null);
    }
  };

  const handleSquadChange = (event) => {
    const squadId = event.target.value;
    onSquadChange(squadId || null);
  };

  const handleClear = () => {
    onTribeChange(null);
    onSquadChange(null);
    if (onClear) {
      onClear();
    }
  };

  const hasFilters = selectedTribe || selectedSquad;

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {/* Tribo Filter */}
      <FormControl 
        size="small" 
        sx={{ minWidth: 200 }}
        disabled={loading}
      >
        <InputLabel id="tribe-filter-label">Tribo</InputLabel>
        <Select
          labelId="tribe-filter-label"
          id="tribe-filter"
          value={selectedTribe || ''}
          label="Tribo"
          onChange={handleTribeChange}
          sx={{
            backgroundColor: colors.branco,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.azulMarinho
            }
          }}
        >
          <MenuItem value="">
            <em>Todas as tribos</em>
          </MenuItem>
          {tribes.map((tribe) => (
            <MenuItem key={tribe.id} value={tribe.id}>
              {tribe.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Squad Filter */}
      <FormControl 
        size="small" 
        sx={{ minWidth: 200 }}
        disabled={loading || !selectedTribe}
      >
        <InputLabel id="squad-filter-label">Squad</InputLabel>
        <Select
          labelId="squad-filter-label"
          id="squad-filter"
          value={selectedSquad || ''}
          label="Squad"
          onChange={handleSquadChange}
          sx={{
            backgroundColor: colors.branco,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.azulMarinho
            }
          }}
        >
          <MenuItem value="">
            <em>Todos os squads</em>
          </MenuItem>
          {squads.map((squad) => (
            <MenuItem key={squad.id} value={squad.id}>
              {squad.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Clear Button */}
      {hasFilters && (
        <Tooltip title="Limpar filtros">
          <IconButton
            onClick={handleClear}
            size="small"
            sx={{
              mt: 0.5,
              color: colors.azulMarinho,
              '&:hover': {
                backgroundColor: colors.cinzaMuitoClaro
              }
            }}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      )}

      {/* Filter Indicator */}
      {hasFilters && (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
          <FilterListIcon sx={{ color: colors.azulTeal, fontSize: 18 }} />
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {selectedTribe && (
              <Chip
                label={`Tribo: ${tribes.find(t => t.id === selectedTribe)?.name || 'N/A'}`}
                size="small"
                onDelete={() => {
                  onTribeChange(null);
                  onSquadChange(null);
                }}
                sx={{
                  backgroundColor: colors.azulTeal,
                  color: colors.branco,
                  '& .MuiChip-deleteIcon': {
                    color: colors.branco
                  }
                }}
              />
            )}
            {selectedSquad && (
              <Chip
                label={`Squad: ${squads.find(s => s.id === selectedSquad)?.name || 'N/A'}`}
                size="small"
                onDelete={() => onSquadChange(null)}
                sx={{
                  backgroundColor: colors.azulVioleta,
                  color: colors.branco,
                  '& .MuiChip-deleteIcon': {
                    color: colors.branco
                  }
                }}
              />
            )}
          </Box>
        </Box>
      )}

      {error && (
        <Box sx={{ color: colors.laranja, fontSize: '0.875rem', mt: 0.5 }}>
          {error}
        </Box>
      )}
    </Box>
  );
};

export default TribeSquadFilter;

