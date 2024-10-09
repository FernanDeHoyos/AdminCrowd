import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { BarChart } from '@mui/x-charts/BarChart';
import Title from './Title';
import { FormControl, InputLabel, MenuItem, Select, Box, Grid } from '@mui/material';
import { axisClasses } from '@mui/x-charts';
import { comuna_cinco, comuna_cuatro, comuna_dos, comuna_nueve_dos, comuna_nueve_uno, comuna_ocho, comuna_ocho_dos, comuna_seis, comuna_siete, comuna_tres, comuna_uno } from '../../Helpers/Coordenadas';
import { isIncidentInComuna } from '../../Helpers/PuntoEnPligono';

// Function to group incidents by date, risk type, and commune
function groupIncidentsByDateAndRisk(incidents, groupBy, selectedComuna) {
  const groupedData = {};

  incidents.forEach((incident) => {
    const date = new Date(incident.created_at);
    const formattedDate = groupBy === 'day' 
      ? date.toLocaleDateString() 
      : `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // Format "YYYY-MM"

    const type = incident.type_risk;

    if (!selectedComuna || isIncidentInComuna(incident, selectedComuna)) {
      if (!groupedData[formattedDate]) {
        groupedData[formattedDate] = {};
      }
      if (!groupedData[formattedDate][type]) {
        groupedData[formattedDate][type] = 0;
      }
      groupedData[formattedDate][type]++;
    }
  });

  const data = Object.keys(groupedData).map(date => ({
    date,
    ...groupedData[date],
  }));

  return data.sort((a, b) => new Date(a.date) - new Date(b.date));
}

export default function IncidentBarChart() {
  const theme = useTheme();
  const { incidents } = useSelector((state) => state.incident);
  const [groupedIncidents, setGroupedIncidents] = useState([]);
  const [selectedRiskType, setSelectedRiskType] = useState('All');
  const [groupBy, setGroupBy] = useState('day'); // Grouping state
  const [selectedComuna, setSelectedComuna] = useState('');
  const [comunas, setComunas] = useState([
    { id: 1, name: 'Comuna 1', polygon: comuna_uno },
    { id: 2, name: 'Comuna 2', polygon: comuna_dos }, 
    { id: 3, name: 'Comuna 3', polygon: comuna_tres }, 
    { id: 4, name: 'Comuna 4', polygon: comuna_cuatro },
    { id: 5, name: 'Comuna 5', polygon: comuna_cinco }, 
    { id: 6, name: 'Comuna 6', polygon: comuna_seis }, 
    { id: 7, name: 'Comuna 7', polygon: comuna_siete },
    { id: 8, name: 'Comuna 8', polygon: [comuna_ocho, comuna_ocho_dos] }, 
    { id: 9, name: 'Comuna 9', polygon: [comuna_nueve_uno, comuna_nueve_dos] }, 
  ]);

  useEffect(() => {
    if (incidents.length > 0) {
      const filteredIncidents = selectedRiskType === 'All'
        ? incidents
        : incidents.filter(incident => incident.type_risk === selectedRiskType);

      const updatedGroupedIncidents = groupIncidentsByDateAndRisk(filteredIncidents, groupBy, selectedComuna);
      setGroupedIncidents(updatedGroupedIncidents);
    }
  }, [incidents, selectedRiskType, groupBy, selectedComuna]); // Add selectedComuna to dependencies

  const riskTypes = [...new Set(incidents.map(incident => incident.type_risk))];

  return (
    <React.Fragment>
      <Title>Incidentes por Fecha</Title>
      <Box sx={{ width: '100%', marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de Riesgo</InputLabel>
              <Select
                value={selectedRiskType}
                onChange={(e) => setSelectedRiskType(e.target.value)}
                label="Tipo de Riesgo"
              >
                <MenuItem value="All">Todos</MenuItem>
                {riskTypes.map((type, index) => (
                  <MenuItem key={index} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Agrupar Por</InputLabel>
              <Select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                label="Agrupar Por"
              >
                <MenuItem value="day">Día</MenuItem>
                <MenuItem value="month">Mes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Seleccionar Comuna</InputLabel>
              <Select
                label="Seleccionar Comuna"
                value={selectedComuna}
                onChange={(e) => setSelectedComuna(e.target.value)}
              >
                <MenuItem value="">Todas las Comunas</MenuItem>
                {comunas.map((comuna) => (
                  <MenuItem key={comuna.id} value={comuna.polygon}>
                    {comuna.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: '100%', height: '60%', flexGrow: 1, overflow: 'hidden' }}>
        <BarChart
          dataset={groupedIncidents}
          xAxis={[{ scaleType: 'band', dataKey: 'date' }]}
          series={[
            { dataKey: 'Alto riesgo con apoyo', label: 'Alto riesgo con apoyo', color: theme.palette.error.main },
            { dataKey: 'Mediano riesgo', label: 'Mediano riesgo', color: theme.palette.warning.main },
            { dataKey: 'Bajo riesgo', label: 'Bajo riesgo', color: theme.palette.success.main },
          ]}
          yAxis={[{ label: 'Número de Incidentes' }]}
          sx={{
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translate(0px, 0)',
            },
          }}
        />
      </Box>
    </React.Fragment>
  );
}
