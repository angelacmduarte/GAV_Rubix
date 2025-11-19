/**
 * GAV Rubix Color Palette
 * Based on Guia de Cores 2025
 */

export const colors = {
  // Primary blues
  azulMarinho: '#000066',
  azulVioleta: '#3038D5',
  azulTeal: '#0D9FB5',
  azulClaro: '#40E6F2',
  
  // Accent colors
  amarelo: '#FAA919',
  laranja: '#FC6D3A',
  
  // Neutrals
  cinzaClaro: '#E5E5E5',
  cinzaMuitoClaro: '#F4F4F4',
  preto: '#010B0C',
  branco: '#FFFFFF',
  
  // Enterprise Rubix colors
  rubixAzul: '#009AEC',
  rubixAzulEscuro: '#052A9E',
  rubixRoxo: '#7E5CE6',
  rubixVerde: '#0BDA5E',
  rubixLaranja: '#E6441C',
  rubixRosa: '#FC2275'
};

export const palette = {
  primary: {
    main: colors.azulMarinho,
    light: colors.azulVioleta,
    dark: colors.azulMarinho,
    contrastText: colors.branco
  },
  secondary: {
    main: colors.azulTeal,
    light: colors.azulClaro,
    dark: colors.azulTeal,
    contrastText: colors.branco
  },
  error: {
    main: colors.laranja,
    contrastText: colors.branco
  },
  warning: {
    main: colors.amarelo,
    contrastText: colors.preto
  },
  background: {
    default: colors.cinzaMuitoClaro,
    paper: colors.branco
  },
  text: {
    primary: colors.preto,
    secondary: colors.azulMarinho
  },
  divider: colors.cinzaClaro
};

