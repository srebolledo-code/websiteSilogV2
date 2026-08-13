/**
 * Transportes SIL - Motor de Cálculo Comercial y Tarifario
 * 
 * REGLAS DE NEGOCIO Y PRIVACIDAD DE DATOS (REVISADAS Y CORREGIDAS):
 * 1. Tarifa por Kilo: $77.78 / kg
 * 2. Tarifa por Volumen: $48.611 / m3
 * 3. Conversión de Unidades de Dimensión:
 *    - Metros (m): factor 1
 *    - Centímetros (cm): factor 0.01 (divide por 100)
 *    - Pulgadas (in): factor 0.0254 (multiplica por 0.0254)
 * 4. Volumen Total de Carga = (Largo x Ancho x Alto en metros) x Cantidad de Pallets
 * 5. Carga Fraccionada = MAX(Peso Total x $77.78, Volumen Total x $48.611)
 *    (NO se vuelve a multiplicar por cantidad de pallets, ya que el peso/volumen total lo contempla).
 * 6. Camión Completo (>= 10 Pallets):
 *    - 10 Pallets: $200.000 CLP (Tarifa plana de camión completo)
 *    - 12 Pallets: $350.000 CLP (Tarifa plana de camión completo)
 */

export const TARIFF_CONFIG = {
  currency: "CLP",
  ivaRate: 0.19, // 19% IVA en Chile

  fractionalRates: {
    ratePerKg: 77.78,
    ratePerM3: 48611
  },

  fullTruckload: {
    minPallets: 10,
    rates: [
      { maxPallets: 10, flatPrice: 200000 },
      { maxPallets: 12, flatPrice: 350000 },
      { maxPallets: 28, flatPrice: 550000 }
    ]
  }
};

/**
 * Convierte cualquier medida a Metros según la unidad seleccionada.
 */
export function convertToMeters(value, unit = 'm') {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;

  switch (unit.toLowerCase()) {
    case 'cm':
      return num / 100;
    case 'in':
    case 'pulgadas':
      return num * 0.0254;
    case 'm':
    default:
      return num;
  }
}

/**
 * Calcula el valor comercial estimado de un envío.
 * 
 * @param {Object} input
 * @param {string} input.origin - Siempre "Santiago"
 * @param {string} input.destination - ID de comuna destino
 * @param {number} input.pallets - Cantidad de pallets
 * @param {number} input.weightKg - Peso total en kg
 * @param {number} input.length - Largo
 * @param {number} input.width - Ancho
 * @param {number} input.height - Alto
 * @param {string} input.unit - Unidad de dimensión ('m', 'cm', 'in')
 * 
 * @returns {Object} Resultado del cálculo o error estructurado
 */
export function calculateQuote(input) {
  // 1. Validaciones básicas de entrada
  const origin = (input.origin || "").trim().toLowerCase();
  const destination = (input.destination || "").trim().toLowerCase();
  
  if (origin !== "santiago" && origin !== "") {
    return { success: false, error: "El origen de todos los despachos debe ser Santiago." };
  }

  if (!destination || destination === "santiago") {
    return { success: false, error: "Selecciona una comuna válida de destino en la V Región." };
  }

  const pallets = parseInt(input.pallets, 10);
  const totalWeightKg = parseFloat(input.weightKg);
  const unit = (input.unit || 'm').toLowerCase();

  const lengthM = convertToMeters(input.length, unit);
  const widthM = convertToMeters(input.width, unit);
  const heightM = convertToMeters(input.height, unit);

  if (isNaN(pallets) || pallets <= 0) {
    return { success: false, error: "Ingresa una cantidad válida de pallets (mínimo 1)." };
  }

  if (isNaN(totalWeightKg) || totalWeightKg <= 0) {
    return { success: false, error: "Ingresa el peso total aproximado de la carga (en kg)." };
  }

  if (lengthM <= 0 || widthM <= 0 || heightM <= 0) {
    return { success: false, error: "Completa dimensiones válidas (Largo, Ancho y Alto)." };
  }

  let estimatedPriceNet = 0;
  let serviceType = "fraccionada";

  // 2. Evaluar: ¿Camión Completo (>= 10 pallets) o Carga Fraccionada?
  if (pallets >= TARIFF_CONFIG.fullTruckload.minPallets) {
    // CAMIÓN COMPLETO: Tarifa plana por camión completo
    serviceType = "camion_completo";

    const truckTier = TARIFF_CONFIG.fullTruckload.rates.find(t => pallets <= t.maxPallets)
      || TARIFF_CONFIG.fullTruckload.rates[TARIFF_CONFIG.fullTruckload.rates.length - 1];

    estimatedPriceNet = truckTier.flatPrice;

  } else {
    // CARGA FRACCIONADA: MAX(Peso Total x $77.78, Volumen Total x $48.611)
    serviceType = "fraccionada";

    // Volumen por pallet en m3
    const unitVolumeM3 = lengthM * widthM * heightM;
    
    // Volumen TOTAL acumulado según la cantidad de pallets
    const totalVolumeM3 = unitVolumeM3 * pallets;

    // Cobro por Peso Total vs Cobro por Volumen Total
    const priceByWeight = totalWeightKg * TARIFF_CONFIG.fractionalRates.ratePerKg;
    const priceByVolume = totalVolumeM3 * TARIFF_CONFIG.fractionalRates.ratePerM3;

    // Se cobra el mayor entre el total por peso y el total por volumen
    estimatedPriceNet = Math.max(priceByWeight, priceByVolume);
  }

  // Redondeo comercial limpio en CLP
  const finalNetCLP = Math.round(estimatedPriceNet / 1000) * 1000;
  const finalIvaCLP = Math.round(finalNetCLP * TARIFF_CONFIG.ivaRate);
  const finalTotalCLP = finalNetCLP + finalIvaCLP;

  return {
    success: true,
    serviceType,
    estimatedPriceNet: finalNetCLP,
    estimatedIva: finalIvaCLP,
    estimatedTotal: finalTotalCLP,
    currency: TARIFF_CONFIG.currency,
    formattedNet: formatCLP(finalNetCLP),
    formattedIva: formatCLP(finalIvaCLP),
    formattedTotal: formatCLP(finalTotalCLP)
  };
}

/**
 * Formatea un número como divisa CLP limpia ($70.000)
 */
export function formatCLP(amount) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(amount);
}
