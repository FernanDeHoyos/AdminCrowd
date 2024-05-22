import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

const riskLevels = ['Alto riesgo con apoyo', 'Mediano riesgo', 'Bajo riesgo'];
const colors = {
  'Alto riesgo con apoyo': 'red',
  'Mediano riesgo': 'orange',
  'Bajo riesgo': 'green',
};

const calculateStatistics = (incidents) => {
  const totalIncidents = incidents.length;
  const statistics = riskLevels.map(level => {
    const count = incidents.filter(incident => incident.type_risk === level).length;
    const percentage = ((count / totalIncidents) * 100).toFixed(2);
    return { level, count, percentage };
  });
  return statistics;
};

export const Legend = ({ incidents }) => {
  const statistics = calculateStatistics(incidents);

  return (
    <Box sx={{ 
        padding: 1, 
        backgroundColor: 'white', 
        borderRadius: 1, 
        boxShadow: 3, 
        width: 'auto', 
        height: 'auto' }}>
    <List dense>
      {statistics.map(stat => (
        <ListItem key={stat.level} sx={{ padding: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 24 }}>
            <CircleIcon fontSize={'8px'} style={{ color: colors[stat.level] }} />
          </ListItemIcon>
          <ListItemText 
            primaryTypographyProps={{ variant: 'body2' }}
            primary={`${stat.level}: ${stat.count} (${stat.percentage}%)`} 
          />
        </ListItem>
      ))}
    </List>
  </Box>
  );
};

