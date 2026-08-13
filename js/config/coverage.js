/**
 * Transportes SIL - Configuración de Cobertura V Región de Valparaíso
 * 
 * Este archivo centraliza la lista de comunas habilitadas, días de atención,
 * zonas geográficas y estado. Puede ser modificado por el administrador
 * sin alterar los componentes visuales de la aplicación.
 */

export const COVERAGE_DATA = {
  region: "V Región de Valparaíso",
  originDefault: "Santiago",
  
  // Días de despacho general
  generalSchedule: "Lunes a Viernes (Salidas Diarias)",

  // Comunas configuradas
  comunas: [
    {
      id: "valparaiso",
      name: "Valparaíso",
      zone: "Costa Centro",
      days: "Lunes a Viernes",
      scheduleNote: "Despachos diarios AM / PM",
      enabled: true,
      popular: true,
      svgId: "path-valparaiso"
    },
    {
      id: "vina-del-mar",
      name: "Viña del Mar",
      zone: "Costa Centro",
      days: "Lunes a Viernes",
      scheduleNote: "Despachos diarios AM / PM",
      enabled: true,
      popular: true,
      svgId: "path-vina"
    },
    {
      id: "quilpue",
      name: "Quilpué",
      zone: "Marga Marga",
      days: "Lunes a Viernes",
      scheduleNote: "Frecuencia diaria garantizada",
      enabled: true,
      popular: true,
      svgId: "path-quilpue"
    },
    {
      id: "villa-alemana",
      name: "Villa Alemana",
      zone: "Marga Marga",
      days: "Lunes a Viernes",
      scheduleNote: "Frecuencia diaria garantizada",
      enabled: true,
      popular: true,
      svgId: "path-villa-alemana"
    },
    {
      id: "concon",
      name: "Concón",
      zone: "Costa Norte",
      days: "Lunes a Viernes",
      scheduleNote: "Ruta diaria sector industrial y comercial",
      enabled: true,
      popular: true,
      svgId: "path-concon"
    },
    {
      id: "quillota",
      name: "Quillota",
      zone: "Interior Norte",
      days: "Lunes a Viernes",
      scheduleNote: "Despachos diarios a bodegas y locales",
      enabled: true,
      popular: false,
      svgId: "path-quillota"
    },
    {
      id: "limache",
      name: "Limache",
      zone: "Marga Marga",
      days: "Lunes a Viernes",
      scheduleNote: "Despachos coordinados",
      enabled: true,
      popular: false,
      svgId: "path-limache"
    },
    {
      id: "la-calera",
      name: "La Calera",
      zone: "Interior Norte",
      days: "Lunes a Viernes",
      scheduleNote: "Frecuencia regular de transporte",
      enabled: true,
      popular: false,
      svgId: "path-la-calera"
    },
    {
      id: "san-antonio",
      name: "San Antonio",
      zone: "Costa Sur",
      days: "Lunes a Viernes",
      scheduleNote: "Conexión directa puerto y zona industrial",
      enabled: true,
      popular: true,
      svgId: "path-san-antonio"
    },
    {
      id: "los-andes",
      name: "Los Andes",
      zone: "Cordillera",
      days: "Lunes, Miércoles y Viernes",
      scheduleNote: "Ruta cordillerana programada",
      enabled: true,
      popular: false,
      svgId: "path-los-andes"
    },
    {
      id: "san-felipe",
      name: "San Felipe",
      zone: "Cordillera",
      days: "Lunes, Miércoles y Viernes",
      scheduleNote: "Ruta cordillerana programada",
      enabled: true,
      popular: false,
      svgId: "path-san-felipe"
    },
    {
      id: "casablanca",
      name: "Casablanca",
      zone: "Ruta 68",
      days: "Lunes a Viernes",
      scheduleNote: "Paso directo en Ruta 68",
      enabled: true,
      popular: false,
      svgId: "path-casablanca"
    }
  ]
};

/**
 * Obtiene la lista de comunas habilitadas para el selector de la calculadora.
 */
export function getEnabledComunas() {
  return COVERAGE_DATA.comunas.filter(c => c.enabled);
}

/**
 * Obtiene la información completa de una comuna por su ID o nombre.
 */
export function getComunaInfo(idOrName) {
  if (!idOrName) return null;
  const search = idOrName.toLowerCase().trim();
  return COVERAGE_DATA.comunas.find(
    c => c.id === search || c.name.toLowerCase() === search
  ) || null;
}
