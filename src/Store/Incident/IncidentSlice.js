import { createSlice } from '@reduxjs/toolkit';

export const IncidentSlice = createSlice({
    name: 'incident',
    initialState: {
        isLoadIncidents: true,
        incidents: [],
        activeIncident: null,
        images_url: []
    },
    reducers: {
        onSetActiveIncident: (state, { payload }) => {
            state.activeIncident = payload
        },
        onAddNewIncident: (state, { payload }) => {
            state.incidents.push(payload);
            /* state.activeIncident = null; */
        },
        onUpdateIncident: (state, { payload }) => {
            state.incidents = state.incidents.map(incident => {
                if (incident.id === payload.id) {
                    return payload;
                }
                return incident;
            });
        },
        onDeleteIncident: (state) => {
            if (state.activeIncident) {
                state.incidents = state.incidents.filter(incident => incident._id !== state.activeIncident._id);
                /* state.activeIncident = null; */
            }
        },

        onLoadIncidents: (state, { payload }) => {
            state.isLoadIncidents = false;
            state.incidents = payload.map(incident => ({
                created_at: incident.created_at,
                description: incident.description,
                id: incident.id,
                id_user: incident.id_user,
                type_incident: incident.type_incident,
                type_risk: incident.type_risk,
                ubication: incident.ubication,
                // Agregar la URL de la imagen a cada incidente si está disponible
                images_url: incident.images_url || null,
                confirm: incident.confirm
            }));
        },
        // Nuevo reducer para actualizar la URL de la imagen en el incidente activo
        onUpdateImageURL: (state, { payload }) => {
            state.images_url.push(payload)
        },
        onLogoutIncident: (state) => {
            state.isLoadIncidents = true;
            state.incidents = [];
            state.activeIncident = null;
        }
    }
});

export const { 
    onSetActiveIncident,
    onAddNewIncident, 
    onUpdateIncident, 
    onDeleteIncident, 
    onLogoutIncident,
    onLoadIncidents,
    onUpdateImageURL // Agregar el nuevo reducer
} = IncidentSlice.actions;