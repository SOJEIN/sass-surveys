import { createTheme } from '@mui/material/styles';

/**
 * Tema oscuro personalizado para la aplicación
 * Usa Poppins como tipografía principal y una paleta moderna
 */
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Indigo moderno
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#ec4899', // Pink vibrante
      light: '#f472b6',
      dark: '#db2777',
      contrastText: '#ffffff'
    },
    background: {
      default: '#0f172a', // Slate oscuro
      paper: '#1e293b' // Slate medio
    },
    success: {
      main: '#10b981', // Verde esmeralda
      light: '#34d399',
      dark: '#059669'
    },
    warning: {
      main: '#f59e0b', // Ámbar
      light: '#fbbf24',
      dark: '#d97706'
    },
    error: {
      main: '#ef4444', // Rojo
      light: '#f87171',
      dark: '#dc2626'
    },
    info: {
      main: '#3b82f6', // Azul
      light: '#60a5fa',
      dark: '#2563eb'
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      disabled: '#64748b'
    },
    divider: '#334155'
  },
  typography: {
    fontFamily:
      '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5
    },
    button: {
      textTransform: 'none',
      fontWeight: 500
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    'none',
    '0 1px 3px 0 rgb(0 0 0 / 0.3)',
    '0 4px 6px -1px rgb(0 0 0 / 0.3)',
    '0 10px 15px -3px rgb(0 0 0 / 0.3)',
    '0 20px 25px -5px rgb(0 0 0 / 0.3)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 1px 3px 0 rgb(0 0 0 / 0.3)',
    '0 4px 6px -1px rgb(0 0 0 / 0.3)',
    '0 10px 15px -3px rgb(0 0 0 / 0.3)',
    '0 20px 25px -5px rgb(0 0 0 / 0.3)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 1px 3px 0 rgb(0 0 0 / 0.3)',
    '0 4px 6px -1px rgb(0 0 0 / 0.3)',
    '0 10px 15px -3px rgb(0 0 0 / 0.3)',
    '0 20px 25px -5px rgb(0 0 0 / 0.3)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 1px 3px 0 rgb(0 0 0 / 0.3)',
    '0 4px 6px -1px rgb(0 0 0 / 0.3)',
    '0 10px 15px -3px rgb(0 0 0 / 0.3)',
    '0 20px 25px -5px rgb(0 0 0 / 0.3)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 1px 3px 0 rgb(0 0 0 / 0.3)',
    '0 4px 6px -1px rgb(0 0 0 / 0.3)',
    '0 10px 15px -3px rgb(0 0 0 / 0.3)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)'
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none'
        }
      }
    }
  }
});
