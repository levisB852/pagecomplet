// 1. Referencias a DOM
// ------------------------------
const searchInput = document.getElementById('searchInput');
const hymnList = document.getElementById('hymnList');
let hymns = [];
let currentPage = 1;
const pageSize = 100;

// Aplicar estilo guardado al cargar
if (localStorage.getItem('modoOscuro') === 'true') {
  document.body.classList.add('modo-oscuro');
}

// ------------------------------
// 2. Cargar himnos desde JSON
// ------------------------------
fetch('js/himnos_seccion_1.json')
  .then(res => res.json())
  .then(data => {
    hymns = data;

    const mostrarHimnario = localStorage.getItem('mostrarHimnario') === 'true';
    if (mostrarHimnario) {
      localStorage.setItem('mostrarHimnario', 'false');
      const himnario = JSON.parse(localStorage.getItem('miHimnario')) || [];
      renderHimnario(himnario);
    } else {
      renderList(hymns);
    }
  })
  .catch(err => {
    console.error('Error al cargar el JSON:', err);
    if (hymnList) {
      hymnList.innerHTML = '<p>Error al cargar los himnos.</p>';
    }
  });


// ------------------------------
// 3. Mostrar lista normal con paginación
// ------------------------------
function renderList(list) {
  if (!hymnList) return;

  hymnList.innerHTML = '';
  const term = searchInput ? searchInput.value.toLowerCase() : '';
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

  if (list.length === 0) {
    hymnList.innerHTML = '<p class="no-results">No se encontraron himnos.</p>';
    return;
  }

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = list.slice(start, end);

  pageItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'hymn-card';

    let preview = '';
    if (item.content) {
      for (const block of item.content) {
        if (block.lines) {
          const match = block.lines.find(line => line.toLowerCase().includes(term));
          if (match) {
            const highlighted = match.replace(
              new RegExp(term, 'gi'),
              match => `<mark>${match}</mark>`
            );
            preview = highlighted;
            break;
          }
        }
      }
    }

    const esFavorito = favoritos.includes(item.number);
    const icono = esFavorito ? '⭐' : '☆';

    card.innerHTML = `
      <strong>${item.number} - ${item.title}</strong>
      <button class="fav-btn" onclick="toggleFavorito(${item.number}); event.stopPropagation();">${icono}</button><br>
      <small>${preview}</small>
    `;
    card.onclick = () => {
      window.location.href = `hymn.html?number=${item.number}`;
    };
    hymnList.appendChild(card);
  });

  renderPagination(list.length);
}

// ------------------------------
// 4. Mostrar himnario personal
// ------------------------------
function renderHimnario(himnos) {
  if (!hymnList) return;

  hymnList.innerHTML = '';

  if (himnos.length === 0) {
    hymnList.innerHTML = '<p class="no-results">Aún no has agregado himnos a tu himnario personal.</p>';
  } else {
    himnos.forEach(himno => {
      const card = document.createElement('div');
      card.className = 'hymn-card';
      card.innerHTML = `
        <h3>${himno.titulo}</h3>
        <p>${himno.descripcion}</p>
      `;
      card.onclick = () => verHimno(himno.id);
      hymnList.appendChild(card);
    });
  }

  if (!document.querySelector('.btn-volver-esquina')) {
    const volverBtn = document.createElement('button');
    volverBtn.textContent = '🏠 Inicio';
    volverBtn.className = 'btn-volver-esquina';
    volverBtn.onclick = () => {
      window.location.href = 'inicio.html';
    };
    document.body.appendChild(volverBtn);
  }
}

// ------------------------------
// 5. Filtro en tiempo real
// ------------------------------
searchInput?.addEventListener('input', () => {
  currentPage = 1;
  const term = searchInput.value.toLowerCase();
  const filtered = hymns.filter(h =>
    (h.title && h.title.toLowerCase().includes(term)) ||
    (typeof h.number === 'number' && h.number.toString().includes(term)) ||
    (h.content && h.content.some(block =>
      block.lines && block.lines.some(line => line.toLowerCase().includes(term))
    ))
    || (h.author && h.author.toLowerCase().includes(term))

  );
  renderList(filtered);
});

// ------------------------------
// 6. Funciones generales del menú
// ------------------------------
function toggleMenu() {
  const menu = document.getElementById('menuOpciones');
  const panel = document.getElementById('panelConfiguracion');
  menu.classList.toggle('visible');
  if (panel) panel.style.display = 'none';
}

function abrirMiHimnario() {
  localStorage.setItem('mostrarHimnario', 'true');
  window.location.href = 'inicio.html';
}

function verFavoritos() {
  window.location.href = 'favoritos.html';
  const menu = document.getElementById('menuOpciones');
  if (menu) menu.style.display = 'none';
}

function cambiarEstilo() {
  document.body.classList.toggle('modo-oscuro');
  const isDark = document.body.classList.contains('modo-oscuro');
  localStorage.setItem('modoOscuro', isDark ? 'true' : 'false');
  const menu = document.getElementById('menuOpciones');
  if (menu) menu.classList.remove('visible');
}

function verHimno(id) {
  window.location.href = `hymn.html?number=${id}`;
}

function toggleFavorito(numero) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  const index = favoritos.indexOf(numero);

  if (index !== -1) {
    favoritos.splice(index, 1);
  } else {
    favoritos.push(numero);
  }

  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  renderList(hymns);
}


function abrirConfiguracion() {
  const panel = document.getElementById('panelConfiguracion');
  if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  const menu = document.getElementById('menuOpciones');
  if (menu) menu.classList.remove('visible');
}

// ------------------------------
// 7. Aplicar configuraciones de usuario
// ------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const fuente = localStorage.getItem('fuenteHimnos') || 'Raleway';
  const tamano = localStorage.getItem('tamanoHimnos') || '18px';
  const estilo = localStorage.getItem('modoOscuro') === 'true' ? 'oscuro' : 'claro';

  document.body.style.setProperty('--fuente-himnos', `'${fuente}'`);
  document.body.style.setProperty('--tamano-himnos', tamano);

  if (estilo === 'oscuro') {
    document.body.classList.add('modo-oscuro');
  } else {
    document.body.classList.remove('modo-oscuro');
  }

  const fuenteSelect = document.getElementById('fuenteSelect');
  const tamanoSelect = document.getElementById('tamanoSelect');
  const estiloSelect = document.getElementById('estiloSelect');

  if (fuenteSelect) fuenteSelect.value = fuente;
  if (tamanoSelect) tamanoSelect.value = tamano;
  if (estiloSelect) estiloSelect.value = estilo;

  fuenteSelect?.addEventListener('change', () => {
    const nuevaFuente = fuenteSelect.value;
    document.body.style.setProperty('--fuente-himnos', `'${nuevaFuente}'`);
    localStorage.setItem('fuenteHimnos', nuevaFuente);
  });

  tamanoSelect?.addEventListener('change', () => {
    const nuevoTamano = tamanoSelect.value;
    document.body.style.setProperty('--tamano-himnos', nuevoTamano);
    localStorage.setItem('tamanoHimnos', nuevoTamano);
  });

  estiloSelect?.addEventListener('change', () => {
    const nuevoEstilo = estiloSelect.value;
    if (nuevoEstilo === 'oscuro') {
      document.body.classList.add('modo-oscuro');
      localStorage.setItem('modoOscuro', 'true');
    } else {
            document.body.classList.remove('modo-oscuro');
      localStorage.setItem('modoOscuro', 'false');
    }
  });
});

// ------------------------------
// 8. Ocultar menú al hacer scroll
// ------------------------------
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  const menuToggle = document.querySelector('.menu-toggle');
  const menuOpciones = document.getElementById('menuOpciones');
  const panel = document.getElementById('panelConfiguracion');

  if (menuToggle) {
    if (currentScroll > lastScrollTop) {
      menuToggle.style.opacity = '0';
      menuToggle.style.pointerEvents = 'none';
      menuOpciones?.classList.remove('visible');
      if (panel && panel.style.display === 'block') panel.style.display = 'none';
    } else {
      menuToggle.style.opacity = '1';
      menuToggle.style.pointerEvents = 'auto';
    }
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// ------------------------------
// 9. Paginación dinámica
// ------------------------------
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const container = document.getElementById('paginationControls');
  if (!container) return;

  container.innerHTML = '';

  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '⟨ Ant';
  prevBtn.disabled = currentPage === 1;
  prevBtn.className = 'nav-btn';
  prevBtn.onclick = () => {
    currentPage--;
    renderList(hymns);
  };

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Sig ⟩';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.className = 'nav-btn';
  nextBtn.onclick = () => {
    currentPage++;
    renderList(hymns);
  };

  const info = document.createElement('span');
  info.textContent = `Página ${currentPage} de ${totalPages}`;
  info.style.margin = '0 1rem';
  info.style.fontWeight = 'bold';

  container.appendChild(prevBtn);
  container.appendChild(info);
  container.appendChild(nextBtn);
}

// ------------------------------
// PREYECTAR HIMNO
// ------------------------------
function activarModoProyeccion() {
  const titulo = document.getElementById('hymnTitle')?.innerText || '';
  const letra = document.getElementById('hymnLyrics')?.innerText || '';
  const contenido = `${titulo}\n\n${letra}`;
  
  if (!letra.trim()) {
    alert("No se encontró la letra del himno.");
    return;
  }

  localStorage.setItem('letraHimno', contenido);
  window.open('proyeccion.html', '_blank');
}
