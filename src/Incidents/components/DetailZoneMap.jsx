
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Link, Typography } from '@mui/material';
import { TopSubZones } from './TopSubZones';
import { useIncidentStore } from '../../Hooks/useIncidentStore';

// Define los iconos personalizados para cada nivel de riesgo
const iconos = {
  'Alto riesgo con apoyo': new L.Icon({
    iconUrl: './marker-red.svg',
    iconSize: [32, 32],
  }),
  'Mediano riesgo': new L.Icon({
    iconUrl: './marker-orange.png',
    iconSize: [32, 32],
  }),
  'Bajo riesgo': new L.Icon({
    iconUrl: './marker-yellow.png',
    iconSize: [32, 32],
  }),
};

// Define las opciones de estilo para la zona
const zoneOptions = { color: 'blue' };

// Define la zona que abarca toda la ciudad de Montería
const monteriaZone = {
  name: 'Montería',
  bounds: [[8.7100, -75.9300], [8.8300, -75.8000]], // Ajusta estos límites según tus necesidades
};

// Función para dividir la zona grande en una cuadrícula de 10x10
const generateSubzones = (bounds, rows, cols) => {
  const [sw, ne] = bounds;
  const latStep = (ne[0] - sw[0]) / rows;
  const lngStep = (ne[1] - sw[1]) / cols;
  const subzones = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const subzone = {
        bounds: [
          [sw[0] + i * latStep, sw[1] + j * lngStep],
          [sw[0] + (i + 1) * latStep, sw[1] + (j + 1) * lngStep],
        ],
      };
      subzones.push(subzone);
    }
  }
  return subzones;
};

const subzones = generateSubzones(monteriaZone.bounds, 10, 10);

// Función para verificar si un punto está dentro de un rectángulo
const isPointInRectangle = (point, bounds) => {
  if (!point || typeof point.lat !== 'number' || typeof point.lng !== 'number') {
    return false;
  }
  const [sw, ne] = bounds;
  const { lat, lng } = point;
  return lat >= sw[0] && lat <= ne[0] && lng >= sw[1] && lng <= ne[1];
};

export const DetailZoneMap = ({ incidents }) => {
  const [filterOption, setFilterOption] = useState('all'); // Estado para almacenar la opción de filtro seleccionada
  const {ActiveIncident} = useIncidentStore()
  const [selectedIncident, setSelectedIncident] = useState(null);

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value); // Actualizar el estado cuando cambie la opción de filtro
  };

  const handleIncidentClick = (incident) => {
    ActiveIncident(incident);
    setSelectedIncident(incident);
  };

  // Contar incidentes dentro de cada subzona
  const subzoneIncidentCounts = subzones.map((subzone, index) => {
    const count = incidents.filter(incident => {
      const { ubication } = incident;
      const inRectangle = isPointInRectangle(ubication, subzone.bounds);
      return inRectangle;
    }).length;
    return { ...subzone, count };
  });

  // Ordenar las subzonas por cantidad de incidentes y obtener el top 5
  const topSubzones = [...subzoneIncidentCounts].sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={[8.7400, -75.8900]} // Centro de Montería
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {subzoneIncidentCounts.map((subzone, index) => {
          // Verificar si la subzona está en el top 5 y aplicar un color rojo si es así
          const isTopSubzone = topSubzones.some(topSubzone => topSubzone.bounds === subzone.bounds);
          return (
            <Rectangle
              key={index}
              bounds={subzone.bounds}
              pathOptions={isTopSubzone ? { color: 'red' } : zoneOptions}
            >
              <Popup>
                <Typography variant="h6">Subzona {index + 1}</Typography>
                <Typography>Incidentes: {subzone.count}</Typography>
              </Popup>
            </Rectangle>
          );
        })}
        {Array.isArray(incidents) && incidents.length > 0 && incidents.map((incident) => {
          if (filterOption === 'all' || String(incident.confirm) === filterOption) {
            const icono = iconos[incident.type_risk] || new L.Icon.Default();
            return (
              <Marker
                key={incident.id}
                position={incident.ubication}
                icon={icono}
              >
                <Popup>
                  <strong>Tipo de Incidente:</strong> {incident.type_incident}<br />
                  <strong>Riesgo:</strong> {incident.type_risk}<br />
                  <strong>Descripción:</strong> {incident.description}<br />
                  <strong>Creado en:</strong> {new Date(incident.created_at).toLocaleString()}<br />
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
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
      <Box sx={{ position: 'absolute', top: 5, right: 30, zIndex: 1000 }}>
        <select value={filterOption} onChange={handleFilterChange}>
          <option value="all">Todos</option>
          <option value="true">Confirmados</option>
          <option value="false">No confirmados</option>
        </select>
      </Box>
      <Box sx={{ position: 'absolute', top: 30, left: 80, zIndex: 1000 }}>
        <TopSubZones subzones={subzoneIncidentCounts} />
      </Box>
    </Box>
  );
};