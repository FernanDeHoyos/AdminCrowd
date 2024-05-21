import { useDispatch, useSelector } from "react-redux"
import { supabase } from "../lib/supabase"
import { AES } from 'crypto-js';
import { onLoadIncidents, onSetActiveIncident, onUpdateIncident } from "../Store/Incident/IncidentSlice"
import { Encrypt } from "../Helpers/Encrypt";

export const useIncidentStore = () => {
    const dispatch = useDispatch()
    const {encryptData} = Encrypt()
    const { incidents, images_url, activeIncident } = useSelector((state) => state.incident)

    const UpdateIncident = async ({ id, severity, additionalOption, description, coordenadas, uid, images_url, confirm }) => {
        try {
            const { data, error } = await supabase
                .from('Incident')
                .update({
                    type_risk: severity,
                    type_incident: additionalOption,
                    description: description,
                    ubication: coordenadas,
                    id_user: uid,
                    images_url: images_url,
                    confirm: confirm
                })
                .eq('id', id)
                .select();

            // Despachar la acción onUpdateIncident para actualizar el store
            dispatch(onUpdateIncident({ id, severity, additionalOption, description, coordenadas, uid, images_url, confirm }));

            if (error) {
                throw new Error(error.message);
            } else {
                console.log('Incident updated successfully:', data);
            }
        } catch (error) {
            console.log('Error updating incident:', error);
        }
    };

    const RejectIncident = async(id) => {
        try {
            const { error } = await supabase
                .from('Incident')
                .delete()
                .eq('id', id)

                if(error) return  console.log('Error deleting incident:', error);
        } catch (error) {
            console.log('Error deleting incident:', error);
        }
    }

    const ActiveIncident = (incident) => {
        const cipherText = encryptData(incident, import.meta.env.VITE_SECRET_KEY)
        localStorage.setItem('activeIncident', cipherText);
        dispatch(onSetActiveIncident(incident))
    }

    // Función para cargar todos los incidentes
    const loadAllIncidents = async () => {
        try {
            let { data: Incident } = await supabase
                .from('Incident')
                .select('*')
            // Despachar la acción onLoadIncidents para actualizar el store con los datos recibidos
            dispatch(onLoadIncidents(Incident))
        } catch (error) {
            console.log(error);
        }
    }


    // Función para filtrar incidentes por ID de usuario
    const FilterIncidentById = async (id_user) => {
        try {
            let { data: Incident } = await supabase
                .from('Incident')
                .select('*').eq('id_user', id_user)
            // Despachar la acción onLoadIncidents para actualizar el store con los datos recibidos
            dispatch(onLoadIncidents(Incident))
            console.log('filtro:', Incident);
        } catch (error) {
            console.log(error);
        }
    }

    // Función para filtrar incidentes por tipo de riesgo
    const FilterIncidentByRisk = async (type_risk) => {
        try {
            let { data: Incident } = await supabase
                .from('Incident')
                .select('*').eq('type_risk', type_risk)
            // Despachar la acción onLoadIncidents para actualizar el store con los datos recibidos
            dispatch(onLoadIncidents(Incident))
            console.log('filtro:', Incident);
        } catch (error) {
            console.log(error);
        }
    }

    return {
        incidents,
        images_url,
        activeIncident,
        UpdateIncident,
        RejectIncident,
        loadAllIncidents,
        ActiveIncident,
        FilterIncidentById,
        FilterIncidentByRisk
    }
}