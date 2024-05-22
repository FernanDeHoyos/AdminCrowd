import React, { Fragment, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Grid, IconButton, ImageList, ImageListItem, TextField, Toolbar, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useIncidentStore } from "../../Hooks/useIncidentStore";
import { DialogConfirm } from "../components/DialogConfirm";
import { Maps } from "../components/Maps";
import { Encrypt } from '../../Helpers/Encrypt';
import { MapIndice } from '../components/MapIndice';

export const IncidentDialog = () => {
  const { UpdateIncident, RejectIncident } = useIncidentStore(); 
  const {decryptData} = Encrypt()
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [action, setAction] = useState(null);
  const navigate = useNavigate()

  const cipherText = localStorage.getItem('activeIncident');
  const data = decryptData(cipherText, import.meta.env.VITE_SECRET_KEY);
  const storedIncident = data ? JSON.parse(data) : null;

  const handleConfirm = () => {
    setMessage('¿Estás seguro de que deseas confirmar este incidente? Una vez confirmado, será mostrado al público.');
    setTitle("Confirmar Incidente");
    setAction('confirm');
    setOpen(true);
  };

  const handleReject = () => {
    setMessage('¿Estás seguro de que deseas rechazar este incidente? Será eliminado.');
    setTitle("Rechazar Incidente");
    setAction('reject');
    setOpen(true);
  };

  const handleDialogClose = (confirm) => {
    setOpen(false);
    if (confirm) {
      if (action === 'confirm') {
        UpdateIncident({
          id: storedIncident.id,
          type_risk: storedIncident.type_risk,
          type_incident: storedIncident.type_incident,
          description: storedIncident.description,
          ubication: storedIncident.ubication,
          id_user: storedIncident.id_user,
          images_url: storedIncident.images_url,
          confirm: true
        });
        navigate(-1)
      } else if (action === 'reject') {
        RejectIncident(storedIncident.id);
        
      }
    }
  };

  if (!storedIncident) {
    return <Typography variant="h6">No hay incidentes almacenados.</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="absolute">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="open drawer" component={RouterLink} to="/">
            <ArrowBackIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Información de incidente
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} sx={{ marginTop: 5 }}>
        <Grid item xs={12} md={8}>
          <Box sx={{ padding: '16px' }}>
            <TextField
              fullWidth
              disabled
              id="created_at"
              label="Fecha"
              variant="outlined"
              margin="normal"
              value={storedIncident.created_at}
            />
            <TextField
              fullWidth
              disabled
              id="description"
              label="Descripción"
              variant="outlined"
              margin="normal"
              value={storedIncident.description}
            />
            <TextField
              fullWidth
              disabled
              id="type_incident"
              label="Tipo de Incidente"
              variant="outlined"
              margin="normal"
              value={storedIncident.type_incident}
            />
            <TextField
              fullWidth
              disabled
              id="type_risk"
              label="Nivel de Riesgo"
              variant="outlined"
              margin="normal"
              value={storedIncident.type_risk}
            />

          <Box sx={{ padding: '5px' }}>
            <ImageList sx={{ width: '100%', height: 400 }} cols={1} rowHeight={164}>
              {storedIncident.images_url && storedIncident.images_url.map((image, index) => (
                <ImageListItem key={index}>
                  <img src={image} alt={`Imagen de incidente ${index + 1}`} loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>
            
          </Box>
            
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
        <Box sx={{ height: '450px', marginTop: 2 }}>
              <MapIndice incidents={storedIncident} />
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
              <Button variant="contained" color="primary" sx={{ marginRight: 2 }} onClick={handleConfirm}>
                Confirmar
              </Button>
              <Button variant="contained" color="secondary" onClick={handleReject}>
                No aceptar
              </Button>
            </Box>
            </Box>
        </Grid>
      </Grid>
      <DialogConfirm
        open={open}
        onClose={handleDialogClose}
        title={title}
        contentText={message}
      />
    </Box>
  );
};
