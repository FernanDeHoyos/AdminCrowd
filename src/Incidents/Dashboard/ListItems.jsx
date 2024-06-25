import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';



export const mainListItems = (handleListItemClick) => (
  <React.Fragment>
    <ListItemButton onClick={() => handleListItemClick('Dashboard')}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton onClick={() => handleListItemClick('Incidentes')}>
      <ListItemIcon>
        <FmdGoodOutlinedIcon />
      </ListItemIcon>
      <ListItemText primary="Incidentes" />
    </ListItemButton>
    <ListItemButton onClick={() => handleListItemClick('Detalles')}>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Detalles" />
    </ListItemButton>
    <ListItemButton onClick={() => handleListItemClick('Integrations')}>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Zonas" />
    </ListItemButton>
    <ListItemButton onClick={() => handleListItemClick('user')}>
      <ListItemIcon>
        <PersonAddIcon />
      </ListItemIcon>
      <ListItemText primary="Agregar usuario" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (handleListItemClick) => (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Reportes
    </ListSubheader>
    <ListItemButton onClick={() => handleListItemClick('Current month')}>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Reporte 1" />
    </ListItemButton>
    <ListItemButton onClick={() => handleListItemClick('Last quarter')}>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Reporte 2" />
    </ListItemButton>
    <ListItemButton onClick={() => handleListItemClick('Year-end sale')}>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Reporte 3" />
    </ListItemButton>
  </React.Fragment>
);



const handleListItemClick = (item) => {
  
  // Aquí puedes definir la lógica para cambiar el componente renderizado
  // Por ejemplo, podrías usar un estado para controlar qué componente renderizar y actualizarlo aquí
  if (item === 'Incidentes') {
    console.log('fernan');
    return (
      <div>
        <p>fernan</p>
      </div>
    )
  }
};
