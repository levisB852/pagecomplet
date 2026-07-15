// js/estilosusuario.js
(function(){
  const root = document.documentElement;
  const body = document.body || document.getElementsByTagName('body')[0];

  const FONT_OPTIONS = [
    { value: "Arial", label: "Arial - normal y clara", profile: "sans", local: true },
    { value: "Verdana", label: "Verdana - muy legible", profile: "sans", local: true },
    { value: "Tahoma", label: "Tahoma - sencilla", profile: "sans", local: true },
    { value: "Georgia", label: "Georgia - clasica normal", profile: "serif", local: true },
    { value: "Times New Roman", label: "Times New Roman - tradicional", profile: "serif", local: true },
    { value: "Roboto", label: "Roboto - limpia", profile: "sans" },
    { value: "Open Sans", label: "Open Sans - versatil", profile: "sans" },
    { value: "Cormorant Garamond", label: "Cormorant Garamond - elegante liturgica", profile: "serif" },
    { value: "EB Garamond", label: "EB Garamond - clasica de lectura", profile: "serif" },
    { value: "Libre Baskerville", label: "Libre Baskerville - formal y clara", profile: "serif" },
    { value: "Crimson Text", label: "Crimson Text - himnario clasico", profile: "serif" },
    { value: "Spectral", label: "Spectral - solemne y moderna", profile: "serif" },
    { value: "Alegreya", label: "Alegreya - calida y expresiva", profile: "serif" },
    { value: "Cardo", label: "Cardo - tradicional", profile: "serif" },
    { value: "Marcellus", label: "Marcellus - elegante y limpia", profile: "display" },
    { value: "Cinzel", label: "Cinzel - ceremonial", profile: "display" },
    { value: "Playfair Display", label: "Playfair Display - refinada", profile: "display" },
    { value: "Merriweather", label: "Merriweather - lectura comoda", profile: "serif" },
    { value: "Lora", label: "Lora - literaria", profile: "serif" },
    { value: "Quicksand", label: "Quicksand - suave", profile: "sans" },
    { value: "Poppins", label: "Poppins - moderna", profile: "sans" },
    { value: "Nunito", label: "Nunito - amistosa", profile: "sans" },
    { value: "Montserrat", label: "Montserrat - limpia", profile: "sans" },
    { value: "Raleway", label: "Raleway - sencilla", profile: "sans" }
  ];

  const SIZE_OPTIONS = [
    { value: "15px", label: "Pequeno" },
    { value: "17px", label: "Mediano" },
    { value: "19px", label: "Grande" },
    { value: "21px", label: "Muy grande" }
  ];

  function getFontOption(name) {
    return FONT_OPTIONS.find(font => font.value === name) || FONT_OPTIONS[0];
  }

  function formatFontFamily(name){
    if(!name) return "'Cormorant Garamond', serif";
    const sanitized = name.replace(/^['"]|['"]$/g, '').trim();
    const needsQuotes = /\s/.test(sanitized);
    const quoted = needsQuotes ? `'${sanitized}'` : sanitized;
    const fallback = getFontOption(sanitized).profile === "sans" ? "sans-serif" : "serif";
    return `${quoted}, ${fallback}`;
  }

  function loadGoogleFont(name){
    if(!name) return Promise.resolve();
    const sanitized = name.replace(/^['"]|['"]$/g, '').trim();
    if (getFontOption(sanitized).local) return Promise.resolve();
    const familyParam = encodeURIComponent(sanitized).replace(/%20/g,'+');
    const id = `gf-${familyParam}`;
    if(document.getElementById(id)) return Promise.resolve();

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);

    return document.fonts ? document.fonts.load(`1rem ${sanitized}`) : Promise.resolve();
  }

  function setFontProfile(name) {
    const profile = getFontOption(name).profile;
    root.dataset.hymnFontStyle = profile;

    if (profile === "display") {
      root.style.setProperty('--hymn-line-height', '1.85');
      root.style.setProperty('--hymn-letter-spacing', '0.01em');
    } else if (profile === "serif") {
      root.style.setProperty('--hymn-line-height', '1.78');
      root.style.setProperty('--hymn-letter-spacing', '0.005em');
    } else {
      root.style.setProperty('--hymn-line-height', '1.68');
      root.style.setProperty('--hymn-letter-spacing', '0');
    }
  }

  function populateFontSelect(select) {
    if (!select || select.dataset.enhancedFonts === "true") return;

    const saved = localStorage.getItem('fuenteHimnos') || select.value || FONT_OPTIONS[0].value;
    select.innerHTML = "";

    FONT_OPTIONS.forEach(font => {
      const option = document.createElement('option');
      option.value = font.value;
      option.textContent = font.label;
      select.appendChild(option);
    });

    select.value = getFontOption(saved).value;
    select.dataset.enhancedFonts = "true";
  }

  function populateSizeSelect(select) {
    if (!select || select.dataset.enhancedSizes === "true") return;

    const saved = localStorage.getItem('tamanoHimnos') || select.value || SIZE_OPTIONS[1].value;
    select.innerHTML = "";

    SIZE_OPTIONS.forEach(size => {
      const option = document.createElement('option');
      option.value = size.value;
      option.textContent = size.label;
      select.appendChild(option);
    });

    select.value = SIZE_OPTIONS.some(size => size.value === saved) ? saved : SIZE_OPTIONS[1].value;
    select.dataset.enhancedSizes = "true";
  }

  function applyFont(name) {
    const fontName = getFontOption(name).value;
    root.style.setProperty('--fuente-himnos', formatFontFamily(fontName));
    body.style.setProperty('--fuente-himnos', formatFontFamily(fontName));
    setFontProfile(fontName);
    localStorage.setItem('fuenteHimnos', fontName);
    return loadGoogleFont(fontName).catch(e => console.warn('Error cargando fuente:', e));
  }

  function applySaved(){
    const fuente = localStorage.getItem('fuenteHimnos') || FONT_OPTIONS[0].value;
    const tamano = localStorage.getItem('tamanoHimnos') || SIZE_OPTIONS[1].value;
    const modo = localStorage.getItem('modoOscuro');

    applyFont(fuente);
    root.style.setProperty('--tamano-himnos', tamano);
    body.style.setProperty('--tamano-himnos', tamano);
    if (modo === 'true') body.classList.add('modo-oscuro'); else body.classList.remove('modo-oscuro');
  }

  applySaved();

  document.addEventListener('DOMContentLoaded', () => {
    const fuenteSelect = document.getElementById('fuenteSelect');
    const tamanoSelect = document.getElementById('tamanoSelect');
    const estiloSelect = document.getElementById('estiloSelect');

    populateFontSelect(fuenteSelect);
    populateSizeSelect(tamanoSelect);

    const savedFuente = localStorage.getItem('fuenteHimnos') || FONT_OPTIONS[0].value;
    const savedTamano = localStorage.getItem('tamanoHimnos') || (tamanoSelect ? tamanoSelect.value : SIZE_OPTIONS[1].value);
    const savedModo = localStorage.getItem('modoOscuro') === 'true' ? 'oscuro' : 'claro';

    if (fuenteSelect) fuenteSelect.value = getFontOption(savedFuente).value;
    if (tamanoSelect) tamanoSelect.value = savedTamano;
    if (estiloSelect) estiloSelect.value = savedModo;

    fuenteSelect?.addEventListener('change', async () => {
      await applyFont(fuenteSelect.value);
    });

    tamanoSelect?.addEventListener('change', () => {
      const nuevo = tamanoSelect.value;
      root.style.setProperty('--tamano-himnos', nuevo);
      body.style.setProperty('--tamano-himnos', nuevo);
      localStorage.setItem('tamanoHimnos', nuevo);
    });

    estiloSelect?.addEventListener('change', () => {
      const nuevo = estiloSelect.value;
      if (nuevo === 'oscuro') {
        body.classList.add('modo-oscuro');
        localStorage.setItem('modoOscuro', 'true');
      } else {
        body.classList.remove('modo-oscuro');
        localStorage.setItem('modoOscuro', 'false');
      }
    });
  });

  window.__estilosUsuario_applySaved = applySaved;
})();
