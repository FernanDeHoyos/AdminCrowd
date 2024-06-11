import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useSelector } from 'react-redux';

export const HorizontalBars = () => {
  const { incidents } = useSelector((state) => state.incident);
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    if (incidents.length > 0) {
      const incidentTypeCounts = incidents.reduce((acc, incident) => {
        const { type_incident } = incident;
        acc[type_incident] = (acc[type_incident] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.keys(incidentTypeCounts).map((type, index) => ({
        id: index,
        type_incident: type,
        frequency: incidentTypeCounts[type],
      }));

      setDataset(chartData);
    }
  }, [incidents]);

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <BarChart
          dataset={dataset}
          yAxis={[{ scaleType: 'band', dataKey: 'type_incident' }]}
          series={[{ dataKey: 'frequency', }]}
          layout="horizontal"
          width={800}
          height={380}
          margin={{ left: 250, right: 20,  bottom: 20 }}
        />
      </div>
    </div>
  );
}

