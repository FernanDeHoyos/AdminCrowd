import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';
import { Legend } from './Legends';

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

export const Maps = ({ incidents }) => {
  const [filterOption, setFilterOption] = useState('all'); // Estado para almacenar la opción de filtro seleccionada

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value); // Actualizar el estado cuando cambie la opción de filtro
  };

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer 
        center={[8.742430770082228, -75.88651008818086]} // Asegúrate de que este centro tenga sentido para tus datos
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {Array.isArray(incidents) && incidents.length > 0 && incidents.map((incident) => {
          // Si la opción de filtro es "todos" o el incidente coincide con la opción de filtro, mostrar el marcador
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
                </Popup>
              </Marker>
            );
          }
          return null; // No mostrar el marcador si no coincide con la opción de filtro
        })}
        
      </MapContainer>
      <Box sx={{ position: 'absolute', top: 5, right: 30, zIndex: 1000 }}>
        <select value={filterOption} onChange={handleFilterChange}>
          <option value="all">Todos</option>
          <option value="true">Confirmados</option>
          <option value="false">No confirmados</option>
        </select>
      </Box>

      <Box  sx={{ position: 'absolute', top: 30, right: 16, zIndex: 1000 }}>
        <Legend incidents={incidents}/>
      </Box>
    </Box>
  );
};
