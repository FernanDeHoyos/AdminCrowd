import * as turf from '@turf/turf';

export const puntoEnPoligono = (punto, poligono) => {
    let x = punto.lat, y = punto.lng;
    let dentro = false;
  
    for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
      let xi = poligono[i].lat, yi = poligono[i].lng;
      let xj = poligono[j].lat, yj = poligono[j].lng;
  
      let intersect = ((yi > y) !== (yj > y)) && 
                      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) dentro = !dentro;
    }
  
    return dentro;
  }


  export const isIncidentInComuna = (incident, comunaPolygons) => {
    const incidentPoint = turf.point([incident.ubication.lng, incident.ubication.lat]);
  
    // Función para cerrar el polígono si el primer y último punto no coinciden
    const closePolygon = (polygon) => {
      if (!Array.isArray(polygon) || polygon.length === 0) {
        console.error("Polígono inválido:", polygon);
        return [];
      }
  
      const firstPoint = polygon[0];
      const lastPoint = polygon[polygon.length - 1];
  
      // Si el primer y último punto no son iguales, cerramos el polígono
      if (firstPoint.lat !== lastPoint.lat || firstPoint.lng !== lastPoint.lng) {
        return [...polygon, { lat: firstPoint.lat, lng: firstPoint.lng }];
      }
      return polygon;
    };
  
    // Crear un multipolígono, asegurándose de que los polígonos estén cerrados
    const comunaMultiPolygon = turf.multiPolygon(
      Array.isArray(comunaPolygons[0]) // Si el primer elemento es un arreglo, es un multipolígono
        ? comunaPolygons.map((polygon) => {
            const closedPolygon = closePolygon(polygon);
            return closedPolygon.length > 0 ? [closedPolygon.map(({ lat, lng }) => [lng, lat])] : [];
          }).filter(Boolean) // Filtrar polígonos vacíos
        : [[closePolygon(comunaPolygons).map(({ lat, lng }) => [lng, lat])]] // Un solo polígono
    );
  
    // Verificar si el punto del incidente está dentro del multipolígono
    return turf.booleanPointInPolygon(incidentPoint, comunaMultiPolygon);
  };