import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from '@mui/material';
import PersonAddAltSharpIcon from '@mui/icons-material/PersonAddAltSharp';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../../Hooks/useAuth';
import { useForm } from '../../Hooks/useForm';

const Copyright = (props) => (
  <Typography variant="body2" color="text.secondary" align="center" {...props}>
    {'Copyright © '}
    <Link color="inherit" href="https://mui.com/">
      Your Website
    </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
);

const defaultTheme = createTheme();

const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const AddUser = () => {
  const { startRegister } = useAuth();

  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { formState, onInputChange } = useForm({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { first_name, last_name, phone, email, password, confirmPassword } = formState;

  const handleRegister = async () => {
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

    // Llamar a startRegister y verificar si el correo ya está registrado
    const emailAlreadyRegistered = await startRegister({ first_name, last_name, phone, email, password });
    if (emailAlreadyRegistered) {
      setError(true);
      return;
    }

    setOpenDialog(true); // Abrir el diálogo de confirmación
  };

  const handleConfirm = () => {
    setOpenDialog(false);
    startRegister({ first_name, last_name, email, password });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Container component="main" maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <CssBaseline />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexGrow: 1
            }}
          >
            <Grid item xs={12} sm={6} sx={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
            }}>
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <PersonAddAltSharpIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Agregar usuario
              </Typography>
            </Grid>
            <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Correo ya registrado
                </Alert>
              )}
              <Grid container spacing={2}>
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
              <Button onClick={handleRegister} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Agregar usuario
              </Button>
            </Box>
          </Box>
        </Container>
        {message === '' && (
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
          >
            <DialogTitle>Confirmar</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¿Estás seguro de que deseas agregar este usuario?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                No
              </Button>
              <Button onClick={handleConfirm} color="primary">
                Sí
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Paper>
    </ThemeProvider>
  );
};
