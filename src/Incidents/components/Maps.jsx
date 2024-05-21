import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const Maps = ({ incidents }) => {
  console.log(incidents);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer 
        center={[8.742430770082228, -75.88651008818086]} // Asegúrate de que este centro tenga sentido para tus datos
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {Array.isArray(incidents) && incidents.length > 0 && incidents.map((incident) => (
          <Marker key={incident.id} position={incident.ubication}>
            <Popup>
              <strong>Tipo de Incidente:</strong> {incident.type_incident}<br />
              <strong>Riesgo:</strong> {incident.type_risk}<br />
              <strong>Descripción:</strong> {incident.description}<br />
              <strong>Creado en:</strong> {new Date(incident.created_at).toLocaleString()}<br />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
