import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { comuna_cinco, comuna_cuatro, comuna_dos, comuna_nueve_dos, comuna_nueve_uno, comuna_ocho, comuna_ocho_dos, comuna_seis, comuna_siete, comuna_tres, comuna_uno } from '../../Helpers/Coordenadas';
import { isIncidentInComuna } from '../../Helpers/PuntoEnPligono';



export const PieCharts = ({incidents}) => {
  /* const { incidents } = useSelector((state) => state.incident); */
  const [data, setData] = useState([]);
  const [selectedComuna, setSelectedComuna] = useState('');
  const [comunas, setComunas] = useState([
    { id: 1, name: 'Comuna 1', polygon: comuna_uno },
    { id: 2, name: 'Comuna 2', polygon: comuna_dos }, 
    { id: 3, name: 'Comuna 3', polygon: comuna_tres }, 
    { id: 1, name: 'Comuna 4', polygon: comuna_cuatro },
    { id: 2, name: 'Comuna 5', polygon: comuna_cinco }, 
    { id: 3, name: 'Comuna 6', polygon: comuna_seis }, 
    { id: 1, name: 'Comuna 7', polygon: comuna_siete},
    { id: 2, name: 'Comuna 8', polygon: [comuna_ocho, comuna_ocho_dos] }, 
    { id: 3, name: 'Comuna 9', polygon: [comuna_nueve_uno, comuna_nueve_dos] }, 
  ]);

  
  
  
  

  useEffect(() => {
    let filteredIncidents = incidents;

    if (selectedComuna) {
      // Obtener el polígono de la comuna seleccionada
      const comunaPolygon = comunas.find(comuna => comuna.name === selectedComuna)?.polygon;

      // Filtrar los incidentes que están dentro de la comuna
      filteredIncidents = incidents.filter((incident) =>
        isIncidentInComuna(incident, comunaPolygon)
      );
    }

    if (filteredIncidents.length > 0) {
      const riskTypeCounts = filteredIncidents.reduce((acc, incident) => {
        const { type_risk } = incident;
        acc[type_risk] = (acc[type_risk] || 0) + 1;
        return acc;
      }, {});

      const totalIncidents = filteredIncidents.length;

      const chartData = Object.keys(riskTypeCounts).map((riskType, index) => ({
        id: index,
        value: (riskTypeCounts[riskType] / totalIncidents) * 100,
        label: riskType,
      }));

      setData(chartData);
    } else {
      setData([]);
    }
  }, [incidents, selectedComuna, comunas]);

  return (
    <div>
      {/* Selector de comuna */}
      <FormControl  size="small">
        <InputLabel>Seleccionar Comuna</InputLabel>
        <Select
        label="Seleccionar Comuna"
          value={selectedComuna}
          onChange={(e) => setSelectedComuna(e.target.value)}
        >
          <MenuItem value="">Todas las Comunas</MenuItem>
          {comunas.map((comuna) => (
            <MenuItem key={comuna.id} value={comuna.name}>
              {comuna.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Gráfico de pastel */}
      <PieChart
        series={[
          {
            data,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            arcLabel: (item) => ` (${item.value.toFixed(1)}%)`,
            arcLabelMinAngle: 45,
          },
        ]}
        height={330}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: 'white',
            fontWeight: 'bold',
          },
        }}
      />
    </div>
  );
}
