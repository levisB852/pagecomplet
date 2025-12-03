// js/estilosUsuario.js
(function(){
  const root = document.documentElement;
  const body = document.body || document.getElementsByTagName('body')[0];

  function formatFontFamily(name){
    if(!name) return "Quicksand, sans-serif";
    const sanitized = name.replace(/^['"]|['"]$/g, '').trim();
    const needsQuotes = /\s/.test(sanitized);
    const quoted = needsQuotes ? `'${sanitized}'` : sanitized;
    return `${quoted}, sans-serif`;
  }

  function loadGoogleFont(name){
    if(!name) return Promise.resolve();
    const sanitized = name.replace(/^['"]|['"]$/g, '').trim();
    const familyParam = sanitized.replace(/\s+/g, '+');
    const id = `gf-${familyParam}`;
    if(document.getElementById(id)) return Promise.resolve();
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    // Google expects spaces as + (encodeURIComponent then replace %20->+)
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(sanitized).replace(/%20/g,'+')}&display=swap`;
    document.head.appendChild(link);
    // wait for font to be available (if supported)
    return document.fonts ? document.fonts.load(`1rem ${sanitized}`) : Promise.resolve();
  }

  function applySaved(){
    const fuente = localStorage.getItem('fuenteHimnos');
    const tamano = localStorage.getItem('tamanoHimnos');
    const modo = localStorage.getItem('modoOscuro');

    if (fuente) {
      root.style.setProperty('--fuente-himnos', formatFontFamily(fuente));
      loadGoogleFont(fuente).catch(e => console.warn('Error cargando fuente:', e));
    }
    if (tamano) root.style.setProperty('--tamano-himnos', tamano);
    if (modo === 'true') body.classList.add('modo-oscuro'); else body.classList.remove('modo-oscuro');
  }

  // Aplicar inmediatamente al cargar este archivo (no esperar DOMContentLoaded)
  applySaved();

  // Cuando DOM esté listo, vincular selects y listeners
  document.addEventListener('DOMContentLoaded', () => {
    const fuenteSelect = document.getElementById('fuenteSelect');
    const tamanoSelect = document.getElementById('tamanoSelect');
    const estiloSelect = document.getElementById('estiloSelect');

    const savedFuente = localStorage.getItem('fuenteHimnos') || (fuenteSelect ? fuenteSelect.value : 'Raleway');
    const savedTamano = localStorage.getItem('tamanoHimnos') || (tamanoSelect ? tamanoSelect.value : '18px');
    const savedModo = localStorage.getItem('modoOscuro') === 'true' ? 'oscuro' : 'claro';

    if (fuenteSelect) fuenteSelect.value = savedFuente;
    if (tamanoSelect) tamanoSelect.value = savedTamano;
    if (estiloSelect) estiloSelect.value = savedModo;

    fuenteSelect?.addEventListener('change', async () => {
      const nueva = fuenteSelect.value;
      root.style.setProperty('--fuente-himnos', formatFontFamily(nueva));
      localStorage.setItem('fuenteHimnos', nueva);
      try { await loadGoogleFont(nueva); } catch(e){ console.warn(e); }
    });

    tamanoSelect?.addEventListener('change', () => {
      const nuevo = tamanoSelect.value;
      root.style.setProperty('--tamano-himnos', nuevo);
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

  // helper para depuración en consola
  window.__estilosUsuario_applySaved = applySaved;
})();
