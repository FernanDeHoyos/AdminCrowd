import React from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';

export const TopSubZones = ({ subzones }) => {
  // Ordena las subzonas por la cantidad de incidentes de manera descendente
  const sortedSubzones = [...subzones].sort((a, b) => b.count - a.count);
  // Toma solo las cinco primeras subzonas
  const topSubzones = sortedSubzones.slice(0, 5);

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Button onClick={handleOpen} variant="contained" size="small">
        Ver Top 5 Subzonas
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: 400 }}>
          <Typography variant="h6">Top 5 Subzonas con Más Incidentes</Typography>
          {topSubzones.map((subzone, index) => (
            <Box key={index} sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Subzona {index + 1}</Typography>
              <Typography>Incidentes: {subzone.count}</Typography>
            </Box>
          ))}
          <Button onClick={handleClose} variant="contained" size="small" sx={{ mt: 2 }}>
            Cerrar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

