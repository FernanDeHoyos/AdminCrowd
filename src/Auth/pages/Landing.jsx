import { AppBar, Toolbar, Typography, Button, Container, Box, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';


const theme = createTheme();

export const Landing =() => {
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            IncidentSoft
          </Typography>
          <Button color="inherit" component={Link} to="/auth/login">Inicio de Sesión</Button>
        </Toolbar>
      </AppBar>
      <Box textAlign="center" my={5}>
      <Typography variant="h2" component="h1" gutterBottom>
        Bienvenido a Mi Aplicación
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Una solución innovadora para tus necesidades
      </Typography>
      <Button variant="contained" color="primary" size="large" component={Link} to="/login" style={{ marginRight: '1rem' }}>
        Inicio de Sesión
      </Button>
    </Box>
  </ThemeProvider>
  );
}

