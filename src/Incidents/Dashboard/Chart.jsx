import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { LineChart, axisClasses } from '@mui/x-charts';
import { Box, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import Title from './Title';

// Función para crear datos agrupados por fecha
function createData(date, count) {
  return { date, count: count ?? null };
}

// Función para agrupar incidentes por día
function groupIncidentsByDay(incidents, selectedRiskType) {
  const groupedData = {};
  
  incidents.forEach((incident) => {
    if (selectedRiskType !== 'All' && incident.type_risk !== selectedRiskType) return;

    const date = new Date(incident.created_at).toLocaleDateString(); // Obtener solo la fecha en formato "MM/DD/YYYY"
    
    if (!groupedData[date]) {
      groupedData[date] = 0;
    }
    groupedData[date]++;
  });

  return Object.keys(groupedData).map(date => createData(date, groupedData[date])).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Función para agrupar incidentes por mes
function groupIncidentsByMonth(incidents, selectedRiskType) {
  const groupedData = {};
  
  incidents.forEach((incident) => {
    if (selectedRiskType !== 'All' && incident.type_risk !== selectedRiskType) return;

    const date = new Date(incident.created_at);
    const month = date.getMonth() + 1; // Obtener el mes (0-indexed)
    const year = date.getFullYear();
    const monthYear = `${month.toString().padStart(2, '0')}/${year}`; // Formato "MM/YYYY"
    
    if (!groupedData[monthYear]) {
      groupedData[monthYear] = 0;
    }
    groupedData[monthYear]++;
  });

  return Object.keys(groupedData).map(date => createData(date, groupedData[date])).sort((a, b) => new Date(a.date.split('/')[1], a.date.split('/')[0] - 1) - new Date(b.date.split('/')[1], b.date.split('/')[0] - 1));
}

export default function Chart() {
  const theme = useTheme();
  const { incidents } = useSelector((state) => state.incident);
  const [groupedIncidents, setGroupedIncidents] = useState([]);
  const [timeFrame, setTimeFrame] = useState('day'); // Estado para el filtro de agrupación
  const [selectedRiskType, setSelectedRiskType] = useState('All'); // Estado para el filtro de tipo de riesgo

  // Mapa de colores para cada tipo de riesgo
  const riskTypeColors = {
    'Alto riesgo con apoyo': theme.palette.error.main,
    'Mediano riesgo': theme.palette.warning.main,
    'Bajo riesgo': theme.palette.success.main,
    'All': theme.palette.primary.light,
  };

  // Maneja el cambio en el filtro de agrupación
  const handleTimeFrameChange = (event) => {
    setTimeFrame(event.target.value);
  };

  // Maneja el cambio en el filtro de tipo de riesgo
  const handleRiskTypeChange = (event) => {
    setSelectedRiskType(event.target.value);
  };

  useEffect(() => {
    if (incidents.length > 0) {
      if (timeFrame === 'day') {
        setGroupedIncidents(groupIncidentsByDay(incidents, selectedRiskType));
      } else {
        setGroupedIncidents(groupIncidentsByMonth(incidents, selectedRiskType));
      }
    }
  }, [incidents, timeFrame, selectedRiskType]);

  const riskTypes = [...new Set(incidents.map(incident => incident.type_risk))];

  return (
    <React.Fragment>
      <Title>Incidentes por {timeFrame === 'day' ? 'Día' : 'Mes'}</Title>
      <Box sx={{ width: '100%', marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de Riesgo</InputLabel>
              <Select
                value={selectedRiskType}
                onChange={handleRiskTypeChange}
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
              <InputLabel>Agrupar por</InputLabel>
              <Select
                value={timeFrame}
                onChange={handleTimeFrameChange}
                label="Agrupar por"
              >
                <MenuItem value="day">Día</MenuItem>
                <MenuItem value="month">Mes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <LineChart
          dataset={groupedIncidents}
          margin={{
            top: 16,
            right: 20,
            left: 70,
            bottom: 30,
          }}
          xAxis={[
            {
              scaleType: 'point',
              dataKey: 'date',
              tickNumber: 8,
              tickLabelStyle: theme.typography.body2,
            },
          ]}
          yAxis={[
            {
              label: 'Número de Incidentes',
              labelStyle: {
                ...theme.typography.body1,
                fill: theme.palette.text.primary,
              },
              tickLabelStyle: theme.typography.body2,
              max: Math.max(...groupedIncidents.map(data => data.count)) + 1,
              tickNumber: 5,
            },
          ]}
          series={[
            {
              dataKey: 'count',
              showMark: false,
              color: riskTypeColors[selectedRiskType] || theme.palette.primary.light,
            },
          ]}
          sx={{
            [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
            [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translateX(-25px)',
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}
