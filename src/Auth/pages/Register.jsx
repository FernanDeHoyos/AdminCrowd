import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../../Hooks/useAuth';
import { useForm } from '../../Hooks/useForm';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const Register = () => {
  const { startRegister } = useAuth();

  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const { formState, onInputChange } = useForm({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { first_name, last_name, phone, email, password, confirmPassword } = formState;

  const handleRegister = () => {
    if ([first_name, last_name, phone, email, password, confirmPassword].includes('')) {
      setError(true);
      setMessage('Debe completar este campo');
      return;
    }

    if (!isEmailValid(email)) {
      setError(true);
      setMessage('El correo electrónico no es válido');
      return;
    }

    if (password.length < 6) {
      setError(true);
      setMessage('La contraseña debe tener más de 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError(true);
      setMessage('Las contraseñas no coinciden');
      return;
    }

    setError(false);
    setMessage('');
    startRegister({ first_name, last_name, email, password });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="absolute">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="open drawer" component={RouterLink} to="/">
              <ArrowBackIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              Register
            </Typography>
          </Toolbar>
        </AppBar>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flexGrow: 1, // Ensure the box takes available vertical space
            justifyContent: 'center', // Center contents vertically
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{
              mt: 1,
              width: '100%', // Ensures the form takes the full width
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={error}
                  margin="normal"
                  required
                  fullWidth
                  id="first_name"
                  label="Nombre"
                  name="first_name"
                  value={first_name}
                  onChange={onInputChange}
                  autoComplete="first_name"
                  helperText={message}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={error}
                  margin="normal"
                  required
                  fullWidth
                  id="last_name"
                  label="Apellido"
                  name="last_name"
                  value={last_name}
                  onChange={onInputChange}
                  autoComplete="last_name"
                  helperText={message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  error={error}
                  required
                  fullWidth
                  id="phone"
                  label="Teléfono"
                  name="phone"
                  value={phone}
                  onChange={onInputChange}
                  helperText={message}
                  autoComplete="phone"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  error={error}
                  required
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  name="email"
                  value={email}
                  onChange={onInputChange}
                  helperText={message}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={error}
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  value={password}
                  onChange={onInputChange}
                  helperText={message}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={error}
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirmar Contraseña"
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={onInputChange}
                  autoComplete="new-password"
                  helperText={message}
                />
              </Grid>
            </Grid>
            <Button
              onClick={handleRegister}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/auth/login" variant="body2">
                  {"¿Ya tienes una cuenta? Inicia sesión"}
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Box>
        
      </Container>
    </ThemeProvider>
  );
};
