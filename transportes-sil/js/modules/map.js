/**
 * Transportes SIL - Módulo de Mapa Interactivo de Cobertura V Región
 * 
 * Renderiza la visualización cartográfica realista por comunas de la V Región de Valparaíso,
 * con relieve topográfico, mapa de costa y nodos interactivos por comuna.
 */

import { COVERAGE_DATA, getComunaInfo } from '../config/coverage.js';
import { preselectDestination } from './calculator.js';

export function initInteractiveMap() {
  const mapContainer = document.getElementById('map-vector-container');
  const tooltip = document.getElementById('map-tooltip');

  if (!mapContainer) return;

  // Generar Mapa Cartográfico Realista de la V Región
  mapContainer.innerHTML = createVectorSVGMap();

  // Escuchar interacciones con las comunas del mapa
  const comunaNodes = mapContainer.querySelectorAll('.map-comuna-path');
  const comunaCards = document.querySelectorAll('.comuna-grid-card');

  comunaNodes.forEach(node => {
    const comunaId = node.getAttribute('data-comuna-id');
    const info = getComunaInfo(comunaId);

    if (!info) return;

    // 1. Mouseover / Hover
    node.addEventListener('mouseenter', (e) => {
      if (tooltip && info) {
        tooltip.innerHTML = `<strong>${info.name}</strong><br/><small>Días: ${info.days}</small>`;
        tooltip.classList.remove('hidden');
      }
    });

    node.addEventListener('mousemove', (e) => {
      if (tooltip) {
        const rect = mapContainer.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - rect.left + 15}px`;
        tooltip.style.top = `${e.clientY - rect.top - 10}px`;
      }
    });

    node.addEventListener('mouseleave', () => {
      if (tooltip) tooltip.classList.add('hidden');
    });

    // 2. Click en Comuna del Mapa
    node.addEventListener('click', () => {
      comunaNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      showComunaDetail(info);
    });
  });

  // Escuchar clicks en tarjetas externas si existen
  comunaCards.forEach(card => {
    card.addEventListener('click', () => {
      const comunaId = card.getAttribute('data-comuna-id');
      const info = getComunaInfo(comunaId);
      if (info) showComunaDetail(info);
    });
  });

  // 3. Manejo de botones "Cotizar mi envío"
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('btn-quote-comuna')) {
      const comunaId = e.target.getAttribute('data-comuna-id');
      if (comunaId) {
        preselectDestination(comunaId);
      }
    }
  });
}

function showComunaDetail(info) {
  const infoCard = document.getElementById('map-info-card');
  if (!infoCard) return;

  infoCard.innerHTML = `
    <div class="comuna-detail-inner animate-fade-in">
      <div class="comuna-detail-header">
        <span class="comuna-zone-badge">${info.zone}</span>
        <h3>${info.name}</h3>
      </div>
      <div class="comuna-detail-body">
        <div class="detail-item">
          <span class="detail-label">🗓️ Días de atención:</span>
          <span class="detail-value highlight-text">${info.days}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">🚚 Frecuencia:</span>
          <span class="detail-value">${info.scheduleNote}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">📍 Cobertura:</span>
          <span class="detail-value">Habilitado para retiro en Santiago y entrega directa</span>
        </div>
      </div>
      <button class="btn btn-primary btn-block btn-quote-comuna mt-4" data-comuna-id="${info.id}">
        Cotizar mi envío a ${info.name} →
      </button>
    </div>
  `;

  infoCard.classList.remove('hidden');
}

/**
 * Genera el mapa cartográfico realista de la Región de Valparaíso (5ta Región).
 */
function createVectorSVGMap() {
  return `
    <svg viewBox="0 0 900 600" class="svg-map-element" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Gradiantes de Terreno y Mar -->
        <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#050a17" />
          <stop offset="100%" stop-color="#0a1329" />
        </linearGradient>

        <linearGradient id="valpoRegionLand" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>

        <linearGradient id="santiagoNodeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#d97706" />
        </linearGradient>

        <!-- Filtros de Sombra y Brillo Cartográfico -->
        <filter id="cartoGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#2563eb" flood-opacity="0.4"/>
        </filter>
      </defs>

      <!-- Fondo Mar (Océano Pacífico) -->
      <rect width="900" height="600" fill="url(#seaGradient)" rx="16" />

      <!-- Líneas de Coordenadas Cartográficas / Malla Geográfica Subtle -->
      <g stroke="#1e293b" stroke-width="0.75" stroke-dasharray="4,4" opacity="0.6">
        <line x1="150" y1="0" x2="150" y2="600" />
        <line x1="350" y1="0" x2="350" y2="600" />
        <line x1="550" y1="0" x2="550" y2="600" />
        <line x1="750" y1="0" x2="750" y2="600" />
        <line x1="0" y1="150" x2="900" y2="150" />
        <line x1="0" y1="350" x2="900" y2="350" />
        <line x1="0" y1="500" x2="900" y2="500" />
      </g>

      <!-- Texto Océano Pacífico -->
      <text x="40" y="300" fill="#334155" font-size="14" font-weight="800" transform="rotate(-90 40 300)" letter-spacing="6">OCÉANO PACÍFICO</text>

      <!-- Rosa de los Vientos / Brújula Cartográfica -->
      <g transform="translate(70, 70)" opacity="0.5">
        <circle cx="0" cy="0" r="22" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="3,3"/>
        <polygon points="0,-28 5,-8 0,0 -5,-8" fill="#38bdf8"/>
        <polygon points="0,28 5,8 0,0 -5,8" fill="#64748b"/>
        <text x="-4" y="-32" fill="#38bdf8" font-size="10" font-weight="800">N</text>
      </g>

      <!-- SILUETA GEOGRÁFICA REAL DE LA 5TA REGIÓN DE VALPARAÍSO -->
      <g filter="url(#cartoGlow)">
        <!-- Masa Terrestre de la Región de Valparaíso -->
        <path d="M 220,0 
                 C 210,50 190,110 180,160 
                 C 170,210 160,240 185,250 
                 C 195,255 205,270 200,285 
                 C 195,300 180,315 170,335 
                 C 160,355 145,390 140,430 
                 C 135,470 120,520 110,600 
                 L 900,600 L 900,0 Z" 
              fill="url(#valpoRegionLand)" stroke="#334155" stroke-width="2" />

        <!-- Líneas de Relieve Topográfico y Valles de la Región -->
        <!-- Valle del Aconcagua -->
        <path d="M 880,180 Q 650,190 450,210 Q 300,220 220,180" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.3" stroke-dasharray="3,3"/>
        <!-- Valle de Marga Marga -->
        <path d="M 500,290 Q 400,280 270,270" fill="none" stroke="#10b981" stroke-width="1" opacity="0.3" stroke-dasharray="3,3"/>
        <!-- Valle de Casablanca / Ruta 68 -->
        <path d="M 600,480 Q 450,440 260,380" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.4" stroke-dasharray="4,4"/>
      </g>

      <!-- DELIMITACIONES Y NODOS REALS DE LAS COMUNAS (V REGIÓN) -->
      <g class="comunas-group">

        <!-- 1. Concón (Costa Norte) -->
        <g class="map-comuna-path" data-comuna-id="concon">
          <path d="M 210,160 C 230,150 270,155 290,170 C 280,195 240,200 205,190 Z" 
                fill="#06b6d4" fill-opacity="0.3" stroke="#22d3ee" stroke-width="2" />
          <text x="245" y="180" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">Concón</text>
        </g>

        <!-- 2. Viña del Mar (Costa Centro Norte) -->
        <g class="map-comuna-path" data-comuna-id="vina-del-mar">
          <path d="M 185,250 C 195,210 205,190 290,170 C 310,210 280,240 240,255 Z" 
                fill="#06b6d4" fill-opacity="0.4" stroke="#22d3ee" stroke-width="2.5" />
          <text x="235" y="225" fill="#ffffff" font-size="13" font-weight="800" text-anchor="middle">Viña del Mar</text>
        </g>

        <!-- 3. Valparaíso (Puerto Capital) -->
        <g class="map-comuna-path" data-comuna-id="valparaiso">
          <path d="M 170,335 C 180,315 195,300 200,285 C 205,270 195,255 185,250 C 240,255 270,290 240,340 C 200,355 180,350 170,335 Z" 
                fill="#dc2626" fill-opacity="0.45" stroke="#ef4444" stroke-width="2.5" />
          <text x="205" y="305" fill="#ffffff" font-size="13" font-weight="800" text-anchor="middle">Valparaíso</text>
        </g>

        <!-- 4. Quilpué (Marga Marga) -->
        <g class="map-comuna-path" data-comuna-id="quilpue">
          <path d="M 290,170 C 340,180 390,190 410,220 C 400,260 350,270 270,260 C 280,240 310,210 290,170 Z" 
                fill="#10b981" fill-opacity="0.4" stroke="#34d399" stroke-width="2" />
          <text x="340" y="225" fill="#ffffff" font-size="13" font-weight="800" text-anchor="middle">Quilpué</text>
        </g>

        <!-- 5. Villa Alemana (Marga Marga) -->
        <g class="map-comuna-path" data-comuna-id="villa-alemana">
          <path d="M 410,220 C 440,210 470,215 485,235 C 475,265 440,270 400,260 Z" 
                fill="#10b981" fill-opacity="0.4" stroke="#34d399" stroke-width="2" />
          <text x="440" y="245" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">Villa Alemana</text>
        </g>

        <!-- 6. Limache (Valle Interior) -->
        <g class="map-comuna-path" data-comuna-id="limache">
          <path d="M 485,235 C 520,220 560,225 575,245 C 565,280 520,285 475,265 Z" 
                fill="#3b82f6" fill-opacity="0.4" stroke="#60a5fa" stroke-width="2" />
          <text x="525" y="255" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">Limache</text>
        </g>

        <!-- 7. Quillota (Valle del Aconcagua) -->
        <g class="map-comuna-path" data-comuna-id="quillota">
          <path d="M 290,170 C 330,130 420,120 470,135 C 490,170 440,210 410,220 Z" 
                fill="#3b82f6" fill-opacity="0.4" stroke="#60a5fa" stroke-width="2" />
          <text x="395" y="165" fill="#ffffff" font-size="13" font-weight="800" text-anchor="middle">Quillota</text>
        </g>

        <!-- 8. La Calera (Norte Interior) -->
        <g class="map-comuna-path" data-comuna-id="la-calera">
          <path d="M 470,135 C 520,120 580,125 600,145 C 580,185 520,220 485,235 Z" 
                fill="#3b82f6" fill-opacity="0.4" stroke="#60a5fa" stroke-width="2" />
          <text x="535" y="170" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">La Calera</text>
        </g>

        <!-- 9. Casablanca (Valle Central / Ruta 68) -->
        <g class="map-comuna-path" data-comuna-id="casablanca">
          <path d="M 240,340 C 270,290 350,270 475,265 C 500,320 460,420 380,450 C 280,455 200,420 170,335 Z" 
                fill="#10b981" fill-opacity="0.4" stroke="#34d399" stroke-width="2.5" />
          <text x="330" y="370" fill="#ffffff" font-size="14" font-weight="800" text-anchor="middle">Casablanca</text>
        </g>

        <!-- 10. San Antonio (Puerto Sur) -->
        <g class="map-comuna-path" data-comuna-id="san-antonio">
          <path d="M 170,335 C 200,420 280,455 240,530 C 180,535 120,490 140,430 Z" 
                fill="#06b6d4" fill-opacity="0.4" stroke="#22d3ee" stroke-width="2.5" />
          <text x="180" y="445" fill="#ffffff" font-size="13" font-weight="800" text-anchor="middle">San Antonio</text>
        </g>

        <!-- 11. San Felipe (Aconcagua Cordillera) -->
        <g class="map-comuna-path" data-comuna-id="san-felipe">
          <path d="M 600,145 C 660,130 730,135 750,155 C 740,195 670,205 575,245 Z" 
                fill="#dc2626" fill-opacity="0.35" stroke="#ef4444" stroke-width="2" />
          <text x="660" y="170" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">San Felipe</text>
        </g>

        <!-- 12. Los Andes (Cordillera Oriental) -->
        <g class="map-comuna-path" data-comuna-id="los-andes">
          <path d="M 750,155 C 800,140 860,145 880,165 C 880,225 820,235 740,195 Z" 
                fill="#dc2626" fill-opacity="0.35" stroke="#ef4444" stroke-width="2" />
          <text x="810" y="185" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">Los Andes</text>
        </g>

        <!-- Origen Santiago Badge (Conexión Ruta 68) -->
        <g class="santiago-origin-node" transform="translate(640, 480)">
          <rect x="-100" y="-18" width="200" height="36" rx="18" fill="url(#santiagoNodeGrad)" stroke="#f59e0b" stroke-width="1.5" />
          <text x="0" y="5" fill="#ffffff" font-size="12" font-weight="800" text-anchor="middle">📍 SANTIAGO (ORIGEN)</text>
        </g>
      </g>
    </svg>
  `;
}
