/**
 * Transportes SIL - Aplicación Principal (Entry Point)
 * 
 * Inicializa todos los módulos, la navegación responsive, el chatbot flotante
 * de WhatsApp y los comportamientos de scroll suave.
 */

import { initCalculator } from './modules/calculator.js';
import { initInteractiveMap } from './modules/map.js';
import { initContactForm } from './modules/contactForm.js';
import { initInstagramSection } from './modules/instagram.js';
import { initWhatsAppChatbot } from './modules/whatsapp.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar Módulos Principales
  initCalculator();
  initInteractiveMap();
  initContactForm();
  initInstagramSection();
  initWhatsAppChatbot();

  // 2. Navegación Móvil (Menú Hamburguesa)
  const navToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Cerrar menú al hacer clic en un enlace
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // 3. Scroll Suave para Enlaces de Navegación
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 4. Header Sticky Scroll Effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
});
