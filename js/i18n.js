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
    "Filiales": "Local Churches",
    "Iglesias Filiales": "Local Churches",
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
    "Estatutos": "Bylaws",
    "Principios organizativos y normativos.": "Organizational principles and regulations.",
    "Ver estatutos": "View bylaws",
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
    "Encargado/contacto": "Person in charge / contact",
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
    "Página principal IADSDER": "IADSDER home page",
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

  Object.assign(english, {
    "← Volver": "← Back",
    "← Volver al inicio": "← Back to home",
    "▶ Reproducir": "▶ Play",
    "⭐ Favoritos": "⭐ Favorites",
    "🏠 Inicio": "🏠 Home",
    "🗂️ Mi Himnario": "🗂️ My Hymnal",
    "Entrar al Himnario": "Open the Hymnal",
    "Volver al sitio principal": "Back to the main site",
    "Iglesia Adventista de Dios del Séptimo Día en Reforma — Letras y Proyección": "Iglesia Adventista de Dios del Séptimo Día en Reforma — Lyrics and Projection",
    "Bienvenido al Himnario Digital de la Iglesia Adventista de Dios del Séptimo Día en Reforma (IADSDER).\n        Aquí encontrarás letras de himnos y un modo de proyección pensado para cultos, reuniones, coros y evangelismo.": "Welcome to the IADSDER Digital Hymnal. Here you will find hymn lyrics and a projection mode designed for worship services, meetings, choirs and evangelism.",
    "Recomendado para pantallas y proyector: selecciona un himno, lee por estrofas y comparte contenido de forma práctica.": "Recommended for screens and projectors: choose a hymn, read it verse by verse and share it easily.",
    "Cargando versículo...": "Loading verse...",
    "Uso recomendado": "Recommended use",
    "Contactar": "Contact us",
    "Consulta en línea o descárgalo:": "Read it online or download it:",
    "Descargar PDF": "Download PDF",
    "Ver PDF": "View PDF",
    "Documento oficial": "Official document",
    "Documento doctrinal": "Doctrine document",
    "Manual doctrinal oficial": "Official doctrine manual",
    "Compendio doctrinal": "Doctrine compendium",
    "Versión web + PDF descargable al final.": "Web version with a downloadable PDF at the end.",
    "Identidad y fundamentos doctrinales": "Identity and doctrinal foundations",
    "Organización, disciplina y procedimientos internos": "Organization, discipline and internal procedures",
    "Orden en el culto, reverencia y conducta cristiana": "Order in worship, reverence and Christian conduct",
    "Ministerio, liderazgo y administración de la obra": "Ministry, leadership and administration",
    "Clases bíblicas y formación doctrinal": "Bible classes and doctrinal training",
    "Material de apoyo para enseñanza y evangelismo": "Support material for teaching and evangelism",
    "Estudio personal y familiar": "Personal and family study",
    "Puedes leer o descargar el documento en PDF aquí:": "You can read or download the PDF document here:",
    "Descarga o consulta la versión oficial en PDF:": "Download or read the official PDF version:",
    "Selecciona una filial para ver su ubicación.": "Select a local church to view its location.",
    "Puedes escribirnos, visitar una filial o escuchar la radio en vivo desde esta página.": "You can write to us, visit a local church or listen to live radio from this page.",
    "Diseño y desarrollo web para una experiencia clara, moderna y accesible.": "Web design and development for a clear, modern and accessible experience.",
    "Desarrollado por Levis Flores": "Developed by Levis Flores",
    "Mensaje Cristiano": "Christian Message",
    "Mensaje para fortalecer la fe.": "A message to strengthen faith.",
    "Alabanza": "Praise",
    "Alabanza Especial": "Special Praise",
    "Momento de alabanza y adoración.": "A moment of praise and worship.",
    "Momento de alabanza y adoracion.": "A moment of praise and worship.",
    "Video especial para la congregación.": "A special video for the congregation.",
    "Video especial para la congregacion.": "A special video for the congregation.",
    "Carrusel de fotos": "Photo carousel",
    "Fotografía de evento juvenil": "Youth event photo",
    "Levis Flores - Desarrollador Web": "Levis Flores - Web Developer",
    "Reseña de cómo comenzó la iglesia, los primeros grupos de estudio y la organización de los servicios.": "A look at how the church began, its first study groups and the organization of worship services.",
    "Fechas clave, proyectos y ministerios que marcaron etapas importantes en nuestra misión.": "Key dates, projects and ministries that marked important stages in our mission.",
    "No llenar:": "Leave blank:",
    "Versiculo para recordar durante la semana.": "A verse to remember throughout the week.",
    "Lampara es a mis pies tu palabra, y lumbrera a mi camino.": "Your word is a lamp to my feet and a light to my path.",
    "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.": "Be strong and courageous. Do not be afraid or discouraged, for the Lord your God will be with you wherever you go.",
    "Raleway (moderna)": "Raleway (modern)",
    "Georgia (clásica)": "Georgia (classic)",
    "Roboto (limpia)": "Roboto (clean)",
    "Playfair (elegante)": "Playfair (elegant)",
    "Open Sans (versátil)": "Open Sans (versatile)",
    "Merriweather (serif cálida)": "Merriweather (warm serif)",
    "Lora (literaria)": "Lora (literary)",
    "Quicksand (suave)": "Quicksand (soft)",
    "Poppins (redondeada)": "Poppins (rounded)",
    "Nunito (amistosa)": "Nunito (friendly)",
    "Montserrat (moderna)": "Montserrat (modern)",
    "Oswald (condensada)": "Oswald (condensed)",
    "Raleway Dots (decorativa)": "Raleway Dots (decorative)",
    "Indie Flower (manuscrita)": "Indie Flower (handwritten)",
    "Amatic SC (dibujada)": "Amatic SC (hand-drawn)",
    "Shadows Into Light (amistosa)": "Shadows Into Light (friendly)",
    "PT Serif (clásica)": "PT Serif (classic)",
    "Josefin Sans (con estilo)": "Josefin Sans (stylish)",
    "Cinzel (romana)": "Cinzel (Roman)",
    "Exo 2 (tecnológica)": "Exo 2 (technological)",
    "Karla (legible)": "Karla (readable)",
    "Source Sans Pro (profesional)": "Source Sans Pro (professional)"
  });

  Object.assign(english, {
    "Manual de Doctrina oficial de la Iglesia Adventista de Dios del Séptimo Día en Reforma (IADSDER). Este documento reúne principios bíblicos y enseñanzas doctrinales para estudio, enseñanza y evangelismo.": "Official Doctrine Manual of the Church of God Adventist Seventh Day Reform (IADSDER). This document brings together biblical principles and doctrinal teachings for study, teaching and evangelism.",
    "El manual incluye contenidos doctrinales y bíblicos que ayudan a comprender la fe, fortalecer la vida cristiana y orientar la enseñanza dentro de la iglesia. Puedes consultarlo directamente aquí o descargar la versión oficial en PDF.": "The manual contains doctrinal and biblical material that helps readers understand the faith, strengthen Christian life and guide teaching within the church. You can read it here or download the official PDF.",
    "Consulta los estatutos y el reglamento interno oficiales de la Iglesia Adventista de Dios del Séptimo Día en Reforma (IADSDER), Misión de El Salvador. Incluye versión web por secciones y descarga en PDF.": "Read the official bylaws and internal regulations of the Church of God Adventist Seventh Day Reform (IADSDER), El Salvador Mission. It includes a web version organized by section and a downloadable PDF.",
    "En este documento encontrarás temas como doctrina y disciplina ministerial, orden en el culto, participación de la membresía, responsabilidades de liderazgo, y prácticas de reverencia conforme a la enseñanza bíblica.": "This document covers doctrine and ministerial discipline, order in worship, member participation, leadership responsibilities and practices of reverence according to biblical teaching.",
    "Como miembros, predicadores, ancianos y pastores, se recomienda conocer y respetar estos estatutos, pues son orden, disciplina y ley ministerial dentro de la organización.": "Members, preachers, elders and pastors are encouraged to know and respect these bylaws, which establish order, discipline and ministerial standards within the organization.",
    "Compendio preparado por la Iglesia Adventista de Dios del Séptimo Día en Reforma (IADSDER). Contiene temas bíblicos para estudio, enseñanza y evangelismo.": "A compendium prepared by the Church of God Adventist Seventh Day Reform (IADSDER). It contains biblical topics for study, teaching and evangelism.",
    "Este documento reúne lecciones/temas con base bíblica para fortalecer el conocimiento doctrinal. Puedes consultarlo aquí mismo o descargar la versión en PDF.": "This document brings together Bible-based lessons and topics to strengthen doctrinal knowledge. You can read it here or download the PDF version.",
    "Aquí está la paciencia de los santos, los que guardan los mandamientos de Dios y la fe de Jesús (Apocalipsis 14:12).": "Here is the perseverance of the saints who keep the commandments of God and the faith of Jesus (Revelation 14:12)."
  });

  function normalizeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  const normalizedEnglish = Object.fromEntries(
    Object.entries(english).map(([key, value]) => [normalizeText(key), value])
  );

  function currentLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return supportedLanguages.includes(saved) ? saved : "es";
  }

  function translate(value) {
    return currentLanguage() === "en" ? (english[value] || normalizedEnglish[normalizeText(value)] || value) : value;
  }

  function translateTextNode(node) {
    if (!node.nodeValue || node.parentElement?.closest("script, style, textarea, [data-no-translate]")) return;
    const original = node.nodeValue;
    const clean = normalizeText(original);
    const translated = normalizedEnglish[clean];
    if (!clean || !translated) return;
    node.nodeValue = original.replace(original.trim(), translated);
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
    if (/\/himnario\/proyeccion\.html$/i.test(window.location.pathname)) return;
    if (document.getElementById("siteLanguage")) return;
    function createSelector(id) {
      const wrapper = document.createElement("div");
      wrapper.className = "site-language";
      wrapper.setAttribute("data-no-translate", "");
      wrapper.innerHTML = `
        <label for="${id}"><span aria-hidden="true">🌐</span><span class="sr-language">Idioma</span></label>
        <select id="${id}" aria-label="Idioma / Language">
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>`;
      wrapper.querySelector("select").value = currentLanguage();
      wrapper.querySelector("select").addEventListener("change", event => {
        localStorage.setItem(STORAGE_KEY, event.target.value);
        window.location.reload();
      });
      return wrapper;
    }

    const wrapper = createSelector("siteLanguage");
    const hymnMenu = document.getElementById("menuOpciones");
    const hymnCover = document.querySelector(".hero-overlay");
    const desktopNav = document.querySelector(".nav-links");
    const mobileNav = document.querySelector("#mobileMenu .mobile-menu-card");
    if (hymnMenu) {
      wrapper.classList.add("site-language--embedded");
      hymnMenu.appendChild(wrapper);
    } else if (hymnCover && window.location.pathname.includes("/himnario/")) {
      wrapper.classList.add("site-language--cover");
      hymnCover.prepend(wrapper);
    } else if (desktopNav) {
      wrapper.classList.add("site-language--embedded", "site-language--nav");
      desktopNav.appendChild(wrapper);
      if (mobileNav) {
        const mobileSelector = createSelector("siteLanguageMobile");
        mobileSelector.classList.add("site-language--embedded", "site-language--mobile-nav");
        mobileNav.appendChild(mobileSelector);
      }
    } else {
      document.body.appendChild(wrapper);
    }
  }

  function addStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .site-language{position:fixed;right:auto;left:50%;bottom:max(10px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:9000;display:flex;align-items:center;gap:4px;padding:5px 8px;border:1px solid rgba(120,140,160,.35);border-radius:999px;background:rgba(255,255,255,.96);box-shadow:0 4px 14px rgba(0,0,0,.13);font:600 12.5px/1.2 system-ui,sans-serif;color:#174b35}
      .site-language select{border:0;background:transparent;color:inherit;font:inherit;outline:none;cursor:pointer}
      .site-language--embedded{position:static;transform:none;margin:.45rem auto;box-shadow:none;background:rgba(255,255,255,.12);color:inherit}
      .site-language--nav{margin:0 0 0 .25rem;background:color-mix(in srgb,currentColor 8%,transparent)}
      .site-language--mobile-nav{margin:.45rem 0 0;width:max-content}
      .site-language--cover{position:static;transform:none;width:max-content;margin:0 auto .7rem;background:rgba(15,23,42,.74);color:#fff;border-color:rgba(255,255,255,.24)}
      .sr-language{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
      @media(max-width:700px){.site-language{padding:5px 7px;font-size:12px}.site-language--embedded,.site-language--cover{position:static}}
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

    document.querySelectorAll("img").forEach(image => {
      image.decoding = "async";
      const isPriorityImage = image.matches(".brand-logo, .portada, .hero-media img, .logo-himnario");
      if (!isPriorityImage && !image.hasAttribute("loading")) image.loading = "lazy";
    });

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
