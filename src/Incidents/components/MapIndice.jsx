import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';



export const MapIndice = ({ incidents }) => {

  
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
              <Marker 
                key={incidents.id} 
                position={incidents.ubication} 
              >
                <Popup>
                  <strong>Tipo de Incidente:</strong> {incidents.type_incident}<br />
                  <strong>Riesgo:</strong> {incidents.type_risk}<br />
                  <strong>Descripción:</strong> {incidents.description}<br />
                  <strong>Creado en:</strong> {new Date(incidents.created_at).toLocaleString()}<br />
                </Popup>
              </Marker>
      </MapContainer>
    </Box>
  );
};
