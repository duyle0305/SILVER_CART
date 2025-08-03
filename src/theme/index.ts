import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    primary: {
      main: '#6880F6',
      light: '#F5F5FA',
      dark: '#4758A8',
      contrastText: '#ffffff',
      '100': '#F5F5FA',
      '200': '#E2E5F6',
      '300': '#B1BDF6',
      '400': '#98A8F6',
      '500': '#8094F6',
      '600': '#6880F6',
      '700': '#5D72DB',
      '800': '#5265C2',
      '900': '#4758A8',
    },
    grey: {
      '50': '#F9F9FA',
      '100': '#F0F0F2',
      '200': '#E4E4E7',
      '300': '#C8C8CD',
      '400': '#ACACAF',
      '500': '#909094',
      '600': '#757579',
      '700': '#5F5F63',
      '800': '#4A4A4D',
      '900': '#333336',
    },
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#FFA000',
    },
    success: {
      main: '#388E3C',
    },
    info: {
      main: '#1976D2',
    },
    red: {
      '100': '#FFCDD2',
      '300': '#E57373',
      '500': '#D32F2F',
      '700': '#C62828',
      '900': '#B71C1C',
    },
    yellow: {
      '100': '#FFECB3',
      '300': '#FFD54F',
      '500': '#FFA000',
      '700': '#F57C00',
      '900': '#E65100',
    },
    green: {
      '100': '#C8E6C9',
      '300': '#81C784',
      '500': '#388E3C',
      '700': '#2E7D32',
      '900': '#1B5E20',
    },
  },
})
