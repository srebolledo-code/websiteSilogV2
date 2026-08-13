/**
 * Transportes SIL - Controlador de la Calculadora de Cotización
 * 
 * Gestiona los eventos de la calculadora, validaciones de unidades de medida
 * mediante control segmentado en la esquina superior derecha del cotizador,
 * e invocación del motor tarifario.
 */

import { getEnabledComunas, getComunaInfo } from '../config/coverage.js';
import { calculateQuote } from '../config/tariffs.js';
import { buildQuoteWhatsAppUrl, openWhatsApp } from './whatsapp.js';

let currentQuoteResult = null;
let currentUnit = 'm'; // Unidad por defecto: Metros

export function initCalculator() {
  const selectDestination = document.getElementById('calc-destination');
  const calcForm = document.getElementById('calculator-form');
  const resultCard = document.getElementById('calc-result-card');
  const btnWhatsApp = document.getElementById('btn-quote-whatsapp');
  const unitSegmented = document.getElementById('unit-segmented-control');

  if (!selectDestination || !calcForm) return;

  // 1. Poblar selector de comunas con las habilitadas en V Región
  const enabledComunas = getEnabledComunas();
  selectDestination.innerHTML = '<option value="" disabled selected>Selecciona comuna de destino...</option>';
  
  enabledComunas.forEach(comuna => {
    const opt = document.createElement('option');
    opt.value = comuna.id;
    opt.textContent = `${comuna.name} (${comuna.days})`;
    selectDestination.appendChild(opt);
  });

  // 2. Control Segmentado de Unidad de Medida (m, cm, in) en Esquina Superior Derecha
  if (unitSegmented) {
    const unitButtons = unitSegmented.querySelectorAll('.unit-btn');
    unitButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        unitButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentUnit = btn.getAttribute('data-unit') || 'm';
        updateDimensionLabels(currentUnit);
      });
    });
  }

  // 3. Manejo de Envío del Formulario
  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideError();

    const inputData = {
      origin: "Santiago",
      destination: selectDestination.value,
      pallets: document.getElementById('calc-pallets').value,
      weightKg: document.getElementById('calc-weight').value,
      length: document.getElementById('calc-length').value,
      width: document.getElementById('calc-width').value,
      height: document.getElementById('calc-height').value,
      unit: currentUnit
    };

    const result = calculateQuote(inputData);

    if (!result.success) {
      showError(result.error);
      if (resultCard) resultCard.classList.add('hidden');
      return;
    }

    currentQuoteResult = {
      ...inputData,
      destinationName: getComunaInfo(inputData.destination)?.name || inputData.destination,
      formattedNet: result.formattedNet,
      formattedTotal: result.formattedTotal,
      serviceType: result.serviceType
    };

    // 4. Mostrar resultado comercial en la UI
    displayResult(result);
  });

  // 5. Click en Cotizar por WhatsApp
  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', () => {
      if (!currentQuoteResult) return;
      const waUrl = buildQuoteWhatsAppUrl(currentQuoteResult);
      openWhatsApp(waUrl);
    });
  }
}

function updateDimensionLabels(unit) {
  const labelLength = document.getElementById('label-length');
  const labelWidth = document.getElementById('label-width');
  const labelHeight = document.getElementById('label-height');

  const inputLength = document.getElementById('calc-length');
  const inputWidth = document.getElementById('calc-width');
  const inputHeight = document.getElementById('calc-height');

  let unitSuffix = '(m)';
  let placeholderSample = '1.20';

  if (unit === 'cm') {
    unitSuffix = '(cm)';
    placeholderSample = '120';
  } else if (unit === 'in') {
    unitSuffix = '(in)';
    placeholderSample = '47.2';
  }

  if (labelLength) labelLength.textContent = `Largo por pallet ${unitSuffix}:`;
  if (labelWidth) labelWidth.textContent = `Ancho por pallet ${unitSuffix}:`;
  if (labelHeight) labelHeight.textContent = `Alto por pallet ${unitSuffix}:`;

  if (inputLength) inputLength.placeholder = placeholderSample;
  if (inputWidth) inputWidth.placeholder = placeholderSample;
  if (inputHeight) inputHeight.placeholder = placeholderSample;
}

function displayResult(result) {
  const resultCard = document.getElementById('calc-result-card');
  const priceDisplay = document.getElementById('calc-price-display');
  const badgeType = document.getElementById('calc-service-badge');

  if (!resultCard || !priceDisplay) return;

  priceDisplay.textContent = `${result.formattedNet} CLP`;
  
  if (badgeType) {
    if (result.serviceType === 'camion_completo') {
      badgeType.textContent = 'Servicio: Camión Completo';
      badgeType.className = 'badge badge-primary';
    } else {
      badgeType.textContent = 'Servicio: Carga Fraccionada';
      badgeType.className = 'badge badge-secondary';
    }
  }

  resultCard.classList.remove('hidden');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showError(msg) {
  const errorElement = document.getElementById('calc-error-message');
  if (errorElement) {
    errorElement.textContent = msg;
    errorElement.classList.remove('hidden');
  }
}

function hideError() {
  const errorElement = document.getElementById('calc-error-message');
  if (errorElement) {
    errorElement.classList.add('hidden');
    errorElement.textContent = '';
  }
}

/**
 * Selecciona automáticamente la comuna en la calculadora y realiza scroll suave.
 */
export function preselectDestination(comunaId) {
  const selectDestination = document.getElementById('calc-destination');
  const calcSection = document.getElementById('cotizar');

  if (selectDestination) {
    selectDestination.value = comunaId;
    selectDestination.classList.add('highlight-pulse');
    setTimeout(() => selectDestination.classList.remove('highlight-pulse'), 1500);
  }

  if (calcSection) {
    calcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    setTimeout(() => {
      const palletInput = document.getElementById('calc-pallets');
      if (palletInput) palletInput.focus();
    }, 600);
  }
}
