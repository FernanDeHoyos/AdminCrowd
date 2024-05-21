import React, { Fragment, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Link, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import Title from './Title';
import { useIncidentStore } from '../../Hooks/useIncidentStore';

function preventDefault(event) {
  event.preventDefault();
}

export const Orders = () => {
  const { loadAllIncidents, incidents, ActiveIncident } = useIncidentStore();
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    loadAllIncidents();
  }, []);

  console.log(incidents);

  const handleIncidentClick = (incident) => {
    ActiveIncident(incident);
    setSelectedIncident(incident);
  };

  return (
    <Fragment>
      <Title>Recent Incidents</Title>
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Descripcion</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Nivel de riesgo</TableCell>
                <TableCell>Ubicacion</TableCell>
                <TableCell>Confirmado</TableCell>
                <TableCell>Revisar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents
                .filter((incident) => incident.confirm === false)
                .map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell>{incident.created_at}</TableCell>
                    <TableCell>{incident.description}</TableCell>
                    <TableCell>{incident.type_incident}</TableCell>
                    <TableCell>{incident.type_risk}</TableCell>
                    <TableCell>{`Lat: ${incident.ubication.lat}, Lng: ${incident.ubication.lng}`}</TableCell>
                    <TableCell>{incident.confirm ? 'Confirmado' : 'No confirmado'}</TableCell>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        color="inherit"
                        to="/Admin/Incident"
                        onClick={() => handleIncidentClick(incident)}
                        sx={{
                          textDecoration: 'none',
                          color: 'primary.main',
                          '&:hover': {
                            color: 'secondary.main',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Ver Detalles
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more incidents
      </Link>
    </Fragment>
  );
};
