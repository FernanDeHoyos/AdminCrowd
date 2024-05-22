import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { BarChart } from '@mui/x-charts/BarChart';
import Title from './Title';
import { FormControl, InputLabel, MenuItem, Select, Box } from '@mui/material';

// Función para crear datos agrupados por fecha
function createData(date, count) {
  return { date, count: count ?? null };
}

// Función para agrupar incidentes por fecha
function groupIncidentsByDate(incidents) {
  const groupedData = {};

  incidents.forEach((incident) => {
    const date = new Date(incident.created_at).toLocaleDateString(); // Obtener solo la fecha en formato "MM/DD/YYYY"

    if (!groupedData[date]) {
      groupedData[date] = 0;
    }
    groupedData[date]++;
  });

  return Object.keys(groupedData).map(date => createData(date, groupedData[date])).sort((a, b) => new Date(a.date) - new Date(b.date));
}

export default function IncidentBarChart() {
  const theme = useTheme();
  const { incidents } = useSelector((state) => state.incident);
  const [groupedIncidents, setGroupedIncidents] = useState([]);
  const [selectedRiskType, setSelectedRiskType] = useState('All');

  useEffect(() => {
    if (incidents.length > 0) {
      const filteredIncidents = selectedRiskType === 'All' 
        ? incidents 
        : incidents.filter(incident => incident.type_risk === selectedRiskType);
      setGroupedIncidents(groupIncidentsByDate(filteredIncidents));
    }
  }, [incidents, selectedRiskType]);

  const xLabels = groupedIncidents.map(data => data.date);
  const yData = groupedIncidents.map(data => data.count);

  const riskTypes = [...new Set(incidents.map(incident => incident.type_risk))];

  return (
    <React.Fragment>
      <Title>Incidentes por Fecha</Title>
      <Box sx={{ width: '100%', marginBottom: 2 }}>
        <FormControl fullWidth sx={{ minWidth: 120 }}>
          <InputLabel shrink>Tipo de Riesgo</InputLabel>
          <Select
            value={selectedRiskType}
            onChange={(e) => setSelectedRiskType(e.target.value)}
            label="Tipo de Riesgo"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="All">Todos</MenuItem>
            {riskTypes.map((type, index) => (
              <MenuItem key={index} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ width: '100%', height: '60%', flexGrow: 1, overflow: 'hidden' }}>
        <BarChart
          series={[
            { data: yData, label: 'Número de Incidentes', id: 'incidentCount' },
          ]}
          xAxis={[{ data: xLabels, scaleType: 'band' }]}
          margin={{
            top: 50,
            right: 20,
            bottom: 40,
            left: 70,
          }}
          sx={{
            '& .MuiChart-axisLeft .MuiChart-tickLabel': {
              fill: theme.palette.text.secondary,
            },
            '& .MuiChart-axisBottom .MuiChart-tickLabel': {
              fill: theme.palette.text.secondary,
            },
            '& .MuiChart-axisLeft .MuiChart-label': {
              transform: 'translateX(-25px)',
              fill: theme.palette.text.primary,
            },
          }}
        />
      </Box>
    </React.Fragment>
  );
}
