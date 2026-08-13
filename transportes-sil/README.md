# 🚛 Transportes SIL — Sitio Web Oficial Comercial

Sitio web comercial, público y moderno para **Transportes SIL**, empresa chilena de transporte especializada en carga fraccionada palletizada entre **Santiago y la V Región de Valparaíso** con 20 años de experiencia.

---

## 🚀 Características Principales

1. **Identidad Visual Corporativa Logística**:
   - Integración del logo oficial de Transportes SIL (`assets/logo.png`).
   - Diseño moderno, limpio, robusto con paleta corporativa (Navy, Azul Eléctrico, Verde Esmeralda, Rojo Carmesí).
   - Tipografía profesional (*Inter* y *Outfit* via Google Fonts).
   - Componentes responsivos con estética glassmorphism y microinteracciones.

2. **Calculadora Comercial con Motor de Tarifas (`js/config/tariffs.js`)**:
   - Origen bloqueado en **Santiago**.
   - Destino dinámico con comunas de la V Región (impide combinaciones Santiago -> Santiago).
   - Solicitud exacta de campos: Pallets, Peso total (kg), Largo (m), Ancho (m), Alto (m).
   - **Distinción entre Carga Fraccionada y Camión Completo**: Si la cantidad de pallets alcanza el umbral de camión completo ($\ge 10$ pallets), el motor aplica automáticamente tarifas planas de camión completo en lugar de multiplicar linealmente la tarifa por pallet.
   - **Privacidad Comercial**: Muestra **únicamente el precio final estimado en CLP + IVA** sin revelar fórmulas, multiplicadores o valores internos.
   - **Integración con WhatsApp**: Genera automáticamente un mensaje natural y estructurado listo para enviar por WhatsApp.

3. **Mapa de Cobertura Vectorial Interactivo (`js/modules/map.js`)**:
   - Representación SVG interactiva por comunas de la V Región (Valparaíso, Viña del Mar, Quilpué, Villa Alemana, Concón, Quillota, San Antonio, Los Andes, San Felipe, etc.).
   - Hover contextual con información básica.
   - Clic en comuna despliega los días de atención configurados y un botón *"Cotizar mi envío"*.
   - El botón *"Cotizar mi envío"* realiza scroll suave hacia la calculadora y precarga automáticamente la comuna seleccionada.

4. **Sección Instagram Resiliente**:
   - Módulo independiente de costo cero.
   - Muestra novedades de flota y operaciones reales de Transportes SIL sin depender de APIs pagadas ni romper la carga del sitio.

5. **Contacto & Widget Flotante de WhatsApp**:
   - Formulario comercial B2B con validaciones en cliente.
   - Botón flotante permanente de WhatsApp con insignia interactiva.

---

## 🛠️ Estructura del Proyecto

```
transportes-sil/
├── index.html                  # Estructura principal y marcado semántico SEO
├── css/
│   ├── main.css                # Tokens de diseño, variables CSS y reset base
│   ├── components.css          # Estilos de Header, Hero, Calculadora, Mapa, Cards y Footer
│   └── utilities.css           # Animaciones, insignias, alertas y utilidades
├── js/
│   ├── config/
│   │   ├── coverage.js         # Configuración editable de comunas y días de atención
│   │   └── tariffs.js          # Motor de reglas tarifarias y umbrales de camión completo
│   ├── modules/
│   │   ├── calculator.js       # Controlador del formulario de cotización y UI de resultados
│   │   ├── map.js              # Renderizado e interacción del mapa vectorial SVG
│   │   ├── whatsapp.js         # Constructor de mensajes de WhatsApp
│   │   ├── contactForm.js      # Formulario de contacto comercial
│   │   └── instagram.js        # Galería de operaciones e Instagram
│   └── app.js                  # Entry point principal e inicialización de módulos
├── assets/
│   ├── logo.png                # Logo oficial de Transportes SIL
│   └── images/
│       ├── hero-truck.jpg      # Fotografía de camión en ruta
│       └── warehouse.jpg       # Fotografía de bodega y carga palletizada
└── README.md                   # Manual de uso, configuración y despliegue
```

---

## 💻 Instrucciones para Ejecutar Localmente

### Opción 1: Servidor Local con Python (Recomendado)
Abre una terminal o consola de comandos en la carpeta del proyecto y ejecuta:

```bash
python -m http.server 3000
```
Luego abre tu navegador en: `http://localhost:3000`

### Opción 2: Apertura Directa
Puedes abrir directamente el archivo `index.html` en cualquier navegador moderno (Chrome, Edge, Firefox, Safari).

---

## ⚙️ Cómo Cambiar Datos y Configuración

### 1. Cambiar Tarifas y Reglas del Cotizador (`js/config/tariffs.js`)
Para ajustar los precios o umbrales, abre `js/config/tariffs.js`:
- Para cambiar la tarifa por comuna, edita el objeto `zoneTariffs`:
  ```javascript
  "valparaiso": { basePalletRate: 35000, extraKgRate: 35 }
  ```
- Para cambiar el umbral o tarifas de **Camión Completo**, ajusta la propiedad `fullTruckload`:
  ```javascript
  fullTruckload: {
    minPallets: 10,
    tiers: [
      { maxPallets: 10, basePriceMultiplier: 4.8 },
      { maxPallets: 12, basePriceMultiplier: 5.5 }
    ]
  }
  ```

### 2. Cambiar Comunas y Días de Cobertura (`js/config/coverage.js`)
Para modificar los días de atención o habilitar/deshabilitar comunas, edita `js/config/coverage.js`:
```javascript
{
  id: "quilpue",
  name: "Quilpué",
  days: "Lunes a Viernes",
  scheduleNote: "Frecuencia diaria garantizada",
  enabled: true
}
```

### 3. Configurar Datos de Contacto y Teléfono de WhatsApp (`js/modules/whatsapp.js` e `index.html`)
- Para actualizar el número de WhatsApp oficial donde llegan los mensajes de cotización, edita `js/modules/whatsapp.js`:
  ```javascript
  export const WHATSAPP_CONFIG = {
    phone: "+56912345678", // Reemplazar por el número real con código de país
  };
  ```
- Para actualizar correos y teléfonos en pantalla, edita las líneas correspondientes en la sección `<section id="contacto">` de `index.html`.

### 4. Configurar el Logo Oficial (`assets/logo.png`)
Si deseas reemplazar el logo por una versión de mayor resolución o variaciones blanco/negro:
- Reemplaza el archivo en `assets/logo.png`.

---

## 🌐 Instrucciones de Despliegue (Costo $0)

El sitio es estático, rápido y compatible con cualquier hosting. Se recomiendan las siguientes plataformas gratuitas de alto rendimiento:

### Opción A: Cloudflare Pages (Recomendada para Chile)
1. Crea una cuenta gratuita en [Cloudflare](https://dash.cloudflare.com).
2. Ve a **Workers & Pages** -> **Create application** -> **Pages**.
3. Conecta tu repositorio de GitHub o arrastra directamente la carpeta `transportes-sil`.
4. En la configuración de build: **Build command**: (vacío), **Output directory**: `./`.
5. Haz clic en **Save and Deploy**. Cloudflare te entregará un dominio SSL gratuito e instantáneo.

### Opción B: Netlify o Vercel
- Arrastra la carpeta `transportes-sil` directamente en el panel de Netlify Drop (`app.netlify.com/drop`) o en Vercel Dashboard.

---

## 🔮 Recomendaciones para la Futura Integración del ERP / Sistema de Gestión

Este sitio web comercial público fue diseñado con una **arquitectura desacoplada**:
1. El sitio comercial público permanece independiente y ultrarrápido en el frontend.
2. Para conectar el futuro **sistema de gestión interna / tracking / autenticación**:
   - El formulario de contacto en `js/modules/contactForm.js` ya dispone de la función `submitHandler` preparada para enviar peticiones `fetch()` a la API del backend (Supabase / Next.js / Node).
   - Las cotizaciones generadas en `js/modules/calculator.js` pueden registrarse en la base de datos de solicitudes agregando un `fetch('https://api.transportessil.cl/quotes', { method: 'POST', body: ... })` antes de redirigir a WhatsApp.
   - Se puede agregar un enlace `"Acceso Clientes / Operaciones"` en el menú superior o footer que redirija a `app.transportessil.cl` o `/login`.
