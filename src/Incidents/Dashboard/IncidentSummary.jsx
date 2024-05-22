import React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { useIncidentStore } from '../../Hooks/useIncidentStore';

function preventDefault(event) {
  event.preventDefault();
}

export default function IncidentSummary() {
  const { incidents } = useIncidentStore();

  const totalIncidents = incidents.length;
  const confirmedIncidents = incidents.filter(incident => incident.confirm).length;
  const recentIncident = incidents.reduce((latest, incident) => {
    const incidentDate = new Date(incident.created_at);
    return incidentDate > latest ? incidentDate : latest;
  }, new Date(0));

  return (
    <React.Fragment>
      <Title>Incident Summary</Title>
      <Typography component="p" variant="h6">
        {totalIncidents} Total Incidents
      </Typography>
      <Typography component="p" variant="h6">
        {confirmedIncidents} Confirmed Incidents
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        Last Incident on {recentIncident.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View details
        </Link>
      </div>
    </React.Fragment>
  );
}
