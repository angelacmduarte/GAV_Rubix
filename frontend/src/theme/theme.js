import { createTheme } from '@mui/material/styles';
import { palette } from './palette';

export const theme = createTheme({
  palette,
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
      color: palette.primary.main
    },
    h5: {
      fontWeight: 600,
      color: palette.primary.main
    },
    h6: {
      fontWeight: 600,
      color: palette.primary.main
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4
        },
        containedPrimary: {
          backgroundColor: palette.primary.main,
          '&:hover': {
            backgroundColor: palette.primary.light
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: `1px solid ${palette.divider}`
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: palette.background.paper
        }
      }
    }
  }
});

