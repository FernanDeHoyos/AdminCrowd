import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Button, Card, IconButton, Link, Typography } from '@mui/material';
import { Legend } from './Legends';
import { useIncidentStore } from '../../Hooks/useIncidentStore';
import { comuna_cinco, comuna_cuatro, comuna_dos, comuna_nueve_dos, comuna_nueve_uno, comuna_ocho, comuna_ocho_dos, comuna_seis, comuna_siete, comuna_tres, comuna_uno } from '../../Helpers/Coordenadas';
import { puntoEnPoligono } from '../../Helpers/PuntoEnPligono';
import CloseIcon from '@mui/icons-material/Close';


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

const comunas = [
  { nombre: 'Comuna 1', positions: comuna_uno, color: 'lime' },
  { nombre: 'Comuna 2', positions: comuna_dos, color: 'blue' },
  { nombre: 'Comuna 3', positions: comuna_tres, color: 'red' },
  { nombre: 'Comuna 4', positions: comuna_cuatro, color: 'green' },
  { nombre: 'Comuna 5', positions: comuna_cinco, color: 'yellow' },
  { nombre: 'Comuna 6', positions: comuna_seis, color: 'orange' },
  { nombre: 'Comuna 7', positions: comuna_siete, color: 'purple' },
  { nombre: 'Comuna 8', positions: comuna_ocho, color: 'cyan' },
  { nombre: 'Comuna 8', positions: comuna_ocho_dos, color: 'cyan' },
  { nombre: 'Comuna 9', positions: comuna_nueve_uno, color: 'brown' },
  { nombre: 'Comuna 9', positions: comuna_nueve_dos, color: 'brown' },
];

export const Maps = ({ incidents }) => {
  console.log(incidents);
  const ubicaciones = incidents?.map(incident => incident.ubication) ?? [];

  const incidentesDentroDeLaComuna = incidents.filter(incident =>
    puntoEnPoligono(incident.ubication, comuna_dos)
  );
  console.log(incidentesDentroDeLaComuna);

  const { ActiveIncident } = useIncidentStore()
  const [filterOption, setFilterOption] = useState('all'); // Estado para almacenar la opción de filtro seleccionada
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedComuna, setSelectedComuna] = useState(null);
  const [filteredIncidents, setFilteredIncidents] = useState([]);

  // Función para filtrar incidentes por comuna
  const handleComunaClick = (comuna) => {
    const incidentesDentroDeLaComuna = incidents.filter(incident =>
      puntoEnPoligono(incident.ubication, comuna.positions)
    );

    // Actualizar el estado con la comuna seleccionada y los incidentes correspondientes
    setSelectedComuna(comuna);
    setFilteredIncidents(incidentesDentroDeLaComuna);
  };

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value); // Actualizar el estado cuando cambie la opción de filtro
  };

  const handleComunaInfoClick = (incident) => {
    ActiveIncident(incident);
    setSelectedIncident(incident);
  };

  const handleIncidentClick = (incident) => {
    ActiveIncident(incident);
    setSelectedIncident(incident);
  };

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={[8.742430770082228, -75.88651008818086]} // Asegúrate de que este centro tenga sentido para tus datos
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {comunas.map((comuna, index) => (
          <Polygon
            key={index}
            pathOptions={{ color: comuna.color }}
            positions={comuna.positions}
            eventHandlers={{
              click: () => handleComunaClick(comuna) // Manejar el clic en la comuna
            }}
          >
            <Tooltip direction="center" permanent className="custom-tooltip">
              {comuna.nombre}
            </Tooltip>
          </Polygon>
        ))}

{selectedComuna && (
  <Card
    sx={{
      position: 'fixed',
      top: '18%',
      left: '25%',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      maxHeight: '80vh',
      overflowY: 'auto',
    }}
  >
     <IconButton sx={{
      position: 'absolute',
      right: '-1%',
      top: '-5%'
     }} onClick={() => setSelectedComuna(null)} aria-label="close">
        <CloseIcon />
      </IconButton>

    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h5">
        Incidentes en {selectedComuna.nombre}
      </Typography>
     
    </Box>
    

    {/* Mostrar total de incidentes */}
    <Typography variant="body1" sx={{ mt: 2 }}>
      <strong>Total de Incidentes:</strong> {filteredIncidents.length}
    </Typography>

    {/* Mostrar incidentes por tipo de riesgo */}
    {Object.entries(
      filteredIncidents.reduce((acc, incident) => {
        const { type_risk } = incident;
        acc[type_risk] = (acc[type_risk] || 0) + 1;
        return acc;
      }, {})
    ).map(([type_risk, count]) => (
      <Typography key={type_risk} variant="body2" sx={{ mt: 1 }}>
        <strong>{type_risk}:</strong> {count} incidentes
      </Typography>
    ))}

    {/* Enlace para ver detalles */}
    <Link
      component={RouterLink}
      to={`/Admin/data/${selectedComuna.nombre}`}
      onClick={() => handleComunaInfoClick(filteredIncidents)}
      sx={{
        mt: 2,
        display: 'inline-block',
        color: 'primary.main',
        '&:hover': {
          color: 'secondary.main',
          textDecoration: 'underline',
        },
      }}
    >
      Ver Detalles
    </Link>
  </Card>
)}


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

      <Box sx={{ position: 'absolute', top: 30, right: 16, zIndex: 1000 }}>
        <Legend incidents={incidents} />
      </Box>
    </Box>
  );
};



