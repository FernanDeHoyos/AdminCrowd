import { useEffect, useState } from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { useSelector } from 'react-redux';

export const PieCharts = () => {
  const { incidents } = useSelector((state) => state.incident);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (incidents.length > 0) {
      const riskTypeCounts = incidents.reduce((acc, incident) => {
        const { type_risk } = incident;
        acc[type_risk] = (acc[type_risk] || 0) + 1;
        return acc;
      }, {});

      const totalIncidents = incidents.length;

      const chartData = Object.keys(riskTypeCounts).map((riskType, index) => ({
        id: index,
        value: (riskTypeCounts[riskType] / totalIncidents) * 100,
        label: riskType,
      }));

      setData(chartData);
    }
  }, [incidents]);

  return (
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
      height={500}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'white',
          fontWeight: 'bold',
        },
      }}
    />
  );
}
