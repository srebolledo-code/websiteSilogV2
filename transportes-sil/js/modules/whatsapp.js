/**
 * Transportes SIL - Módulo de Integración WhatsApp & Chatbot Widget
 * 
 * Gestiona la cotización directa por WhatsApp y la ventana flotante
 * interactiva estilo Chatbot con opciones predefinidas.
 */

export const WHATSAPP_CONFIG = {
  phone: "+56912345678", // Número comercial de atención (Configurable)
  companyName: "Servicios Integrales Logísticos",
  subTitle: "En línea • Respuesta habitual en < 5 min",
  welcomeMessage: "¡Hola! 👋 Bienvenido a **Transportes SIL / Servicios Integrales Logísticos**.\nLlevamos 20 años realizando despachos diarios entre Santiago y la V Región.\n\n¿En qué podemos ayudarte hoy?"
};

/**
 * Inicializa el Widget Chatbot de WhatsApp flotante.
 */
export function initWhatsAppChatbot() {
  const floatingBtn = document.getElementById('floating-whatsapp');
  const chatbotModal = document.getElementById('whatsapp-chatbot-modal');
  const closeBtn = document.getElementById('chatbot-close-btn');

  if (!floatingBtn || !chatbotModal) return;

  // 1. Toggle Abrir / Cerrar Chatbot
  floatingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    chatbotModal.classList.toggle('active');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatbotModal.classList.remove('active');
    });
  }

  // 2. Escuchar clicks en opciones del Chatbot
  chatbotModal.querySelectorAll('.chatbot-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      handleChatbotAction(action);
      chatbotModal.classList.remove('active');
    });
  });
}

/**
 * Procesa la acción seleccionada en el Chatbot y redirige a WhatsApp.
 */
function handleChatbotAction(action) {
  let message = "";

  switch (action) {
    case 'ejecutivo':
      message = "Hola, quisiera comunicarme con un ejecutivo de Transportes SIL para recibir atención directa.";
      break;
    case 'especial':
      message = "Hola, quisiera cotizar un servicio especial (fabricación de parrillas, despacho en feriados / fines de semana o carga fuera de medida).";
      break;
    case 'consulta':
      message = "Hola, quisiera realizar una consulta general sobre la cobertura y servicios de Transportes SIL.";
      break;
    default:
      message = "Hola, quisiera solicitar información sobre los servicios de despacho de Transportes SIL.";
  }

  const url = `https://wa.me/${WHATSAPP_CONFIG.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  openWhatsApp(url);
}

/**
 * Genera el enlace wa.me para cotización de envío desde la calculadora.
 */
export function buildQuoteWhatsAppUrl(data) {
  const unitLabel = data.unit || 'm';

  const text = `Hola, quiero cotizar un envío con Transportes SIL.

*Detalles de la carga:*
• Origen: ${data.origin || 'Santiago'}
• Destino: ${data.destinationName}
• Cantidad de pallets: ${data.pallets} ${data.pallets === 1 ? 'pallet' : 'pallets'}
• Peso total aprox.: ${data.weightKg} kg
• Dimensiones (${unitLabel}): ${data.length}${unitLabel} × ${data.width}${unitLabel} × ${data.height}${unitLabel}
• Valor estimado: ${data.formattedNet} CLP (+ IVA)

Quisiera coordinar los detalles de este despacho.`;

  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${WHATSAPP_CONFIG.phone.replace(/[^0-9]/g, '')}?text=${encodedText}`;
}

/**
 * Abre el enlace de WhatsApp en una pestaña nueva.
 */
export function openWhatsApp(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
