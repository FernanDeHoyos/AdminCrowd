import { Box, FormControl, Grid, MenuItem, Select, Tooltip } from "@mui/material";
import { Encrypt } from "../../Helpers/Encrypt";
import { MapContainer, Marker, Polygon, Popup, TileLayer } from "react-leaflet";
import { PieCharts } from "../Dashboard/PieChart";
import { comuna_cinco, comuna_cuatro, comuna_dos, comuna_nueve_dos, comuna_nueve_uno, comuna_ocho, comuna_ocho_dos, comuna_seis, comuna_siete, comuna_tres, comuna_uno } from "../../Helpers/Coordenadas";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { puntoEnPoligono } from "../../Helpers/PuntoEnPligono";
import { useIncidentStore } from "../../Hooks/useIncidentStore";

// Define los iconos personalizados para cada nivel de riesgo
const iconos = {
    'Alto riesgo con apoyo': new L.Icon({
        iconUrl: '/marker-red.svg',
        iconSize: [32, 32],
    }),
    'Mediano riesgo': new L.Icon({
        iconUrl: '/marker-orange.png',
        iconSize: [32, 32],
    }),
    'Bajo riesgo': new L.Icon({
        iconUrl: '/marker-yellow.png',
        iconSize: [32, 32],
    }),
};

const comunas = [
    { nombre: 'comuna 1', positions: comuna_uno, color: 'lime' },
    { nombre: 'comuna 2', positions: comuna_dos, color: 'blue' },
    { nombre: 'comuna 3', positions: comuna_tres, color: 'red' },
    { nombre: 'comuna 4', positions: comuna_cuatro, color: 'green' },
    { nombre: 'comuna 5', positions: comuna_cinco, color: 'yellow' },
    { nombre: 'comuna 6', positions: comuna_seis, color: 'orange' },
    { nombre: 'comuna 7', positions: comuna_siete, color: 'purple' },
    { nombre: 'comuna 8', positions: comuna_ocho, color: 'cyan' },
    { nombre: 'comuna 8', positions: comuna_ocho_dos, color: 'cyan' },
    { nombre: 'comuna 9', positions: comuna_nueve_uno, color: 'brown' },
    { nombre: 'comuna 9', positions: comuna_nueve_dos, color: 'brown' },
];

export const InformationComunas = () => {
    const { comuna } = useParams();
    const { decryptData } = Encrypt();
    const { incidents } = useIncidentStore();
    const [polygonComuna, setPolygonComuna] = useState(null);
    const [selectedComunac, setSelectedComuna] = useState(comuna || ''); // Inicializar con el parámetro de la URL.
    const [filteredIncidents, setFilteredIncidents] = useState([]);

    const cipherText = localStorage.getItem('activeIncident');
    const data = decryptData(cipherText, import.meta.env.VITE_SECRET_KEY);
    const storedIncident = data ? JSON.parse(data) : null;

    console.log(storedIncident);

    // Función para filtrar incidentes por comuna
    const handleComunaClick = (comuna) => {
        const incidentesDentroDeLaComuna = incidents.filter(incident =>
            puntoEnPoligono(incident.ubication, comuna.positions)
        );

        setFilteredIncidents(incidentesDentroDeLaComuna);
        setPolygonComuna(comuna);
    };

    useEffect(() => {
        // Buscar la comuna en función del parámetro de la URL.
        const selectedComuna = comunas.find(c => c.nombre.toLowerCase() === comuna?.toLowerCase());
        if (selectedComuna) {
            handleComunaClick(selectedComuna);
        }
    }, [comuna]);

    useEffect(() => {
        // Buscar la comuna seleccionada por el select.
        const selectedComuna = comunas.find(c => c.nombre.toLowerCase() === selectedComunac?.toLowerCase());
        if (selectedComuna) {
            handleComunaClick(selectedComuna);
        }
    }, [selectedComunac]);

    return (
        <Grid container>
            <Grid item md={6}>
                <Box sx={{ position: 'relative', height: 550, width: '100%' }}>
                    <MapContainer
                        center={[8.742430770082228, -75.88651008818086]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {polygonComuna && (
                            <Polygon
                                pathOptions={{ color: polygonComuna.color }}
                                positions={polygonComuna.positions}
                            >
                                <Tooltip direction="center" permanent className="custom-tooltip">
                                    {polygonComuna.nombre}
                                </Tooltip>
                            </Polygon>
                        )}

                        {filteredIncidents.map((incident) => {
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
                        })}

                        <FormControl fullWidth size="small" sx={{
                            position: 'absolute',
                            width: '50%',
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            zIndex: 1000,
                            overflowY: 'auto',
                        }}>
                            <Select
                                value={selectedComunac}
                                onChange={(e) => setSelectedComuna(e.target.value)}
                                label="Tipo de Riesgo"
                            >
                                <MenuItem value="">Seleccione una comuna</MenuItem>
                                {comunas.map((type, index) => (
                                    <MenuItem key={index} value={type.nombre}>{type.nombre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </MapContainer>
                </Box>
            </Grid>

            <Grid item md={6}>
                <PieCharts incidents={storedIncident} />
            </Grid>
        </Grid>
    );
};
