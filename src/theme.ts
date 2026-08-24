import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#111111',
      light: '#3A3A3A',
      dark: '#000000',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#F0F0F0',
      light: '#FAFAFA',
      dark: '#D6D6D6',
      contrastText: '#111111'
    },
    error: {
      main: '#2B2B2B',
      contrastText: '#FFFFFF'
    },
    text: {
      primary: '#111111',
      secondary: '#6B6B6B'
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF'
    },
    divider: '#E5E5E5',
    action: {
      hover: '#E8E8E8',
      selected: '#E0E0E0'
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FAFAFA',
          color: '#111111'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        colorSecondary: {
          backgroundColor: '#F0F0F0',
          color: '#111111',
          borderBottom: '1px solid #E5E5E5'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      }
    }
  }
});

export default theme;
