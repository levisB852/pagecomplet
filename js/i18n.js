(function () {
  "use strict";

  const STORAGE_KEY = "iadsder-language";
  const supportedLanguages = ["es", "en"];
  const english = {
    "Inicio": "Home",
    "Bienvenido": "Welcome",
    "Principal": "Main",
    "Recursos": "Resources",
    "Radio": "Radio",
    "Radio en vivo": "Live radio",
    "Radio en Vivo": "Live Radio",
    "Videos": "Videos",
    "Eventos": "Events",
    "Eventos Juveniles": "Youth Events",
    "Contacto": "Contact",
    "Filiales": "Churches",
    "Iglesias Filiales": "Church Locations",
    "Ubicaciones": "Locations",
    "Nuestra Historia": "Our History",
    "Transmisión en vivo": "Live Stream",
    "Alabanzas en vivo": "Live Praise",
    "Ver filiales": "View churches",
    "Ver recursos": "View resources",
    "Planificar visita": "Plan a visit",
    "Letras y pistas": "Lyrics and tracks",
    "Mensajes y alabanzas": "Messages and praise",
    "Galería": "Gallery",
    "Historia": "History",
    "Momentos de la comunidad": "Community moments",
    "Comunidad cristiana en El Salvador — esperanza, servicio y fe en comunidad.": "Christian community in El Salvador — hope, service and faith in community.",
    "Conoce nuestros recursos, nuestra historia y el propósito que nos guía. ¡Eres bienvenido!": "Discover our resources, our history and the purpose that guides us. You are welcome!",
    "Versiculo de la semana": "Verse of the week",
    "Materiales para acompañar la adoración y el crecimiento espiritual.": "Resources to support worship and spiritual growth.",
    "Letras y pistas para alabar el nombre de Dios todos juntos.": "Lyrics and tracks to praise God's name together.",
    "Ver himnario": "View hymnal",
    "Estatutos": "Statutes",
    "Principios organizativos y normativos.": "Organizational principles and regulations.",
    "Ver estatutos": "View statutes",
    "Manual Doctrinal": "Doctrine Manual",
    "Documento doctrinal y de orientación para la iglesia.": "Doctrine and guidance document for the church.",
    "Ver manual": "View manual",
    "Conoce nuestras iglesias filiales, direcciones y ubicación en Google Maps.": "Discover our local churches, addresses and Google Maps locations.",
    "Plan Maravilloso": "Wonderful Plan",
    "Conoce el plan maravilloso de Dios para la humanidad.": "Discover God's wonderful plan for humanity.",
    "Ver plan": "View plan",
    "Escucha nuestra programación cristiana desde cualquier lugar.": "Listen to our Christian programming from anywhere.",
    "EN VIVO": "LIVE",
    "EN DIRECTO": "LIVE NOW",
    "Reproducir": "Play",
    "Pausar": "Pause",
    "Volumen": "Volume",
    "Listo para reproducir.": "Ready to play.",
    "Acompáñanos en nuestra transmisión.": "Join our live stream.",
    "Predicaciones, himnos y mensajes para fortalecer la fe.": "Sermons, hymns and messages to strengthen faith.",
    "Reproducir aquí": "Play here",
    "Momentos especiales vividos en nuestra comunidad.": "Special moments shared in our community.",
    "Cargando fotos...": "Loading photos...",
    "Compartir foto": "Share photo",
    "Un recorrido de fe: orígenes, crecimiento y servicio en la comunidad.": "A journey of faith: origins, growth and service in the community.",
    "Orígenes": "Origins",
    "Hitos": "Milestones",
    "¿Preguntas o peticiones de oración? Escríbenos.": "Questions or prayer requests? Write to us.",
    "O escríbenos directamente por WhatsApp": "Or contact us directly on WhatsApp",
    "Escribir por WhatsApp": "Write on WhatsApp",
    "Visítanos": "Visit us",
    "Estamos para servirte": "We are here to serve you",
    "Direcciones y ubicaciones": "Addresses and locations",
    "Programación cristiana en vivo": "Live Christian programming",
    "Una familia para crecer en fe, servir con amor y compartir esperanza.": "A family where you can grow in faith, serve with love and share hope.",
    "Desarrollado por": "Developed by",
    "Ver videos": "View videos",
    "Escuchar radio": "Listen to radio",
    "Escuchar en vivo": "Listen live",
    "Ver transmisión": "Watch stream",
    "Abrir en YouTube": "Open on YouTube",
    "Abrir en Facebook": "Open on Facebook",
    "Buscar filial": "Find a church",
    "Limpiar": "Clear",
    "Departamento": "Department",
    "Todos los departamentos": "All departments",
    "Circuito": "Circuit",
    "Todos los circuitos": "All circuits",
    "Circuito 1": "Circuit 1",
    "Circuito 2": "Circuit 2",
    "Circuito 3": "Circuit 3",
    "Circuito 4": "Circuit 4",
    "Sin asignar": "Unassigned",
    "Ver ubicación": "View location",
    "Ocultar ubicación": "Hide location",
    "Ocultar ubicacion": "Hide location",
    "Abrir en Google Maps": "Open in Google Maps",
    "Estas son algunas de nuestras iglesias filiales.": "These are some of our local churches.",
    "Direcciones y ubicación en Google Maps.": "Addresses and locations on Google Maps.",
    "Dirección": "Address",
    "Encargado/contacto": "Leader/contact",
    "Horario": "Schedule",
    "No hay resultados con ese nombre o dirección.": "No results were found with that name or address.",
    "Atrás": "Back",
    "Volver": "Back",
    "Volver al inicio": "Back to home",
    "Volver arriba": "Back to top",
    "Abrir menú": "Open menu",
    "Cerrar": "Close",
    "Anterior": "Previous",
    "Siguiente": "Next",
    "Imagen anterior": "Previous image",
    "Imagen siguiente": "Next image",
    "Reproducir video": "Play video",
    "Nombre": "Name",
    "Correo": "Email",
    "Mensaje": "Message",
    "Enviar mensaje": "Send message",
    "Enviando...": "Sending...",
    "Tu nombre completo": "Your full name",
    "¿En qué podemos ayudarte?": "How can we help you?",
    "Himnario": "Hymnal",
    "Himnario Digital": "Digital Hymnal",
    "Himnario Digital IADSDER": "IADSDER Digital Hymnal",
    "⭐ Himnos Favoritos": "⭐ Favorite Hymns",
    "🗂️ Mi Himnario Personal": "🗂️ My Personal Hymnal",
    "Favoritos": "Favorites",
    "Mis Himnos": "My Hymns",
    "Mi Himnario": "My Hymnal",
    "➕ Agregar a mi Himnario": "➕ Add to My Hymnal",
    "➖ Quitar de mi Himnario": "➖ Remove from My Hymnal",
    "Compartir": "Share",
    "Compartir como texto": "Share as text",
    "Compartir como imagen": "Share as image",
    "Copiar texto": "Copy text",
    "Inicio del Himnario": "Hymnal Home",
    "Buscar": "Search",
    "Buscar himno": "Search hymns",
    "Borrar": "Clear",
    "⚙️ Configuración": "⚙️ Settings",
    "🎨 Personaliza tu lectura": "🎨 Customize your reading",
    "Modo de estilo:": "Theme:",
    "Estilo de letra:": "Font:",
    "Tamaño de letra:": "Font size:",
    "☀️ Claro": "☀️ Light",
    "🌙 Oscuro": "🌙 Dark",
    "Pequeño": "Small",
    "Mediano": "Medium",
    "Grande": "Large",
    "Muy grande": "Very large",
    "Compartir como": "Share as",
    "Texto": "Text",
    "Compartir imagen": "Share image",
    "Proyectar himno": "Project hymn",
    "Búsquedas recientes": "Recent searches",
    "No hay búsquedas recientes.": "There are no recent searches.",
    "No se encontraron himnos.": "No hymns were found.",
    "Borrar búsquedas": "Clear searches",
    "Proyección": "Projection",
    "Aumentar letra": "Increase font size",
    "Disminuir letra": "Decrease font size",
    "Restablecer letra": "Reset font size",
    "Modo oscuro": "Dark mode",
    "Instalar aplicación": "Install app",
    "Descargar": "Download",
    "Documentos": "Documents",
    "Manual de Doctrina": "Doctrine Manual",
    "Estatutos y Reglamento Interno": "Statutes and Internal Regulations",
    "El Maravilloso Plan de Dios": "God's Wonderful Plan",
    "Versión PDF": "PDF Version",
    "Manual en PDF": "PDF Manual",
    "¿Qué contiene este manual?": "What does this manual contain?",
    "¿Qué contiene este compendio?": "What does this compendium contain?",
    "Preámbulo": "Preamble",
    "Resumen de secciones del documento": "Document section summary",
    "Enlaces": "Links",
    "Desarrollador del sitio": "Website developer"
  };

  function currentLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return supportedLanguages.includes(saved) ? saved : "es";
  }

  function translate(value) {
    return currentLanguage() === "en" ? (english[value] || value) : value;
  }

  function translateTextNode(node) {
    if (!node.nodeValue || node.parentElement?.closest("script, style, textarea, [data-no-translate]")) return;
    const original = node.nodeValue;
    const clean = original.trim();
    if (!clean || !english[clean]) return;
    node.nodeValue = original.replace(clean, english[clean]);
  }

  function translateElement(element) {
    if (!(element instanceof Element) || element.closest("[data-no-translate]")) return;
    ["placeholder", "title", "aria-label"].forEach(attribute => {
      const value = element.getAttribute(attribute);
      if (value && english[value]) element.setAttribute(attribute, english[value]);
    });
    if (element.matches("input[type='search']")) {
      const placeholder = element.getAttribute("placeholder");
      if (placeholder === "Buscar por número, título o letra...") {
        element.setAttribute("placeholder", "Search by number, title or lyrics...");
      }
    }
  }

  function translatePage(root) {
    if (currentLanguage() !== "en") return;
    if (root.nodeType === Node.TEXT_NODE) translateTextNode(root);
    if (root.nodeType === Node.ELEMENT_NODE) translateElement(root);

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) translateTextNode(walker.currentNode);
    if (root.querySelectorAll) root.querySelectorAll("[placeholder], [title], [aria-label]").forEach(translateElement);
  }

  function addLanguageSelector() {
    if (document.getElementById("siteLanguage")) return;
    const wrapper = document.createElement("div");
    wrapper.className = "site-language";
    wrapper.setAttribute("data-no-translate", "");
    wrapper.innerHTML = `
      <label for="siteLanguage"><span aria-hidden="true">🌐</span><span class="sr-language">Idioma</span></label>
      <select id="siteLanguage" aria-label="Idioma / Language">
        <option value="es">Español</option>
        <option value="en">English</option>
      </select>`;
    wrapper.querySelector("select").value = currentLanguage();
    wrapper.querySelector("select").addEventListener("change", event => {
      localStorage.setItem(STORAGE_KEY, event.target.value);
      window.location.reload();
    });
    document.body.appendChild(wrapper);
  }

  function addStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .site-language{position:fixed;top:12px;right:12px;z-index:10000;display:flex;align-items:center;gap:6px;padding:7px 10px;border:1px solid rgba(120,140,160,.35);border-radius:999px;background:rgba(255,255,255,.96);box-shadow:0 5px 18px rgba(0,0,0,.14);font:600 14px/1.2 system-ui,sans-serif;color:#174b35}
      .site-language select{border:0;background:transparent;color:inherit;font:inherit;outline:none;cursor:pointer}
      .sr-language{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
      @media(max-width:700px){.site-language{top:auto;right:10px;bottom:10px;padding:8px 10px}}
      @media(prefers-color-scheme:dark){.site-language{background:rgba(20,30,35,.96);color:#e8fff4}}
    `;
    document.head.appendChild(style);
  }

  function init() {
    document.documentElement.lang = currentLanguage();
    addStyles();
    if (currentLanguage() === "en" && english[document.title]) document.title = english[document.title];
    translatePage(document.body);
    addLanguageSelector();

    if (currentLanguage() === "en") {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => mutation.addedNodes.forEach(translatePage));
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  window.iadsderI18n = { language: currentLanguage, t: translate };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
