import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { LineChart, axisClasses } from '@mui/x-charts';
import Title from './Title';

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

export default function Chart() {
  const theme = useTheme();
  const {incidents} = useSelector((state) => state.incident);
  const [groupedIncidents, setGroupedIncidents] = useState([]);

  useEffect(() => {
    if (incidents.length > 0) {
      setGroupedIncidents(groupIncidentsByDate(incidents));
    }
  }, [incidents]);

  return (
    <React.Fragment>
      <Title>Incidentes por Fecha</Title>
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
              color: theme.palette.primary.light,
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
