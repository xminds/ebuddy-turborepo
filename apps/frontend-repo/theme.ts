// theme.ts
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6b6b',
    },
    secondary: {
      main: '#8e8eff',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

export default theme;
