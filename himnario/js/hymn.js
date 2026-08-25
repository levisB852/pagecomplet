// 🔢 Obtener el número del himno desde la URL
const params = new URLSearchParams(window.location.search);
const currentHymnId = parseInt(params.get('number'), 10);

// 🔗 Referencias a elementos del DOM
const titleEl = document.getElementById('hymnTitle');
const lyricsEl = document.getElementById('hymnLyrics');
const backBtn = document.getElementById('backBtn');
const audioPlayer = document.getElementById('audioPlayer');
const navButtons = document.getElementById('navButtons');

// 🔙 Botón volver al inicio
if (backBtn) {
  backBtn.addEventListener('click', () => {
    window.location.href = 'inicio.html';
  });
}

// 🎵 Cargar himno desde JSON
function getHymnsData() {
  if (Array.isArray(window.HIMNOS_DATA)) {
    return Promise.resolve(window.HIMNOS_DATA);
  }

  return fetch('js/himnos_seccion_1.json').then(res => {
    if (!res.ok) throw new Error(`No se pudo cargar el JSON (${res.status})`);
    return res.json();
  });
}

getHymnsData()
  .then(list => {
    localStorage.setItem('himnosOriginales', JSON.stringify(list));

    const hymn = list.find(h => h.number === currentHymnId);

    if (!hymn) {
      titleEl.textContent = 'Himno no encontrado';
      lyricsEl.innerHTML = '<p>No se encontró el himno solicitado.</p>';
      return;
    }

    titleEl.textContent = `${hymn.number} - ${hymn.title}`;
    if (hymn.author) {
      const autorElemento = document.createElement('p');
      autorElemento.className = 'author';
      autorElemento.textContent = `\u270D\uFE0F : ${hymn.author}`;
      titleEl.insertAdjacentElement('afterend', autorElemento);
    }

    lyricsEl.innerHTML = hymn.content.map(block => {
      const tipo = block.type === 'chorus' ? 'coro' : 'estrofa';
      const lineas = block.lines.map(line => `<p>${line}</p>`).join('');
      return `<div class="${tipo}"><h3>${block.label}</h3>${lineas}</div>`;
    }).join('');

    audioPlayer.src = `audio/himno${hymn.number}.mp3`;

    const prevId = currentHymnId - 1;
    const nextId = currentHymnId + 1;

    if (list.some(h => h.number === prevId)) {
      navButtons.innerHTML += `<a href="hymn.html?number=${prevId}" class="nav-btn">\u2190 Himno anterior</a>`;
    }
    if (list.some(h => h.number === nextId)) {
      navButtons.innerHTML += `<a href="hymn.html?number=${nextId}" class="nav-btn">Siguiente himno \u2192</a>`;
    }

    verificarFavorito();
  })
  .catch(err => {
    console.error('Error al cargar el JSON:', err);
    titleEl.textContent = 'Error';
    lyricsEl.innerHTML = '<p>No se pudo cargar el himno. Verifica que exista js/himnos-data.js.</p>';
  });


// 🧡 Funciones para Mi Himnario
function agregarAHimnario() {
  const himnoActual = {
    id: currentHymnId,
    titulo: titleEl.textContent,
    descripcion: lyricsEl.textContent.slice(0, 100) + '...'
  };

  let himnario = JSON.parse(localStorage.getItem('miHimnario')) || [];

  if (!himnario.some(h => h.id === himnoActual.id)) {
    himnario.push(himnoActual);
    localStorage.setItem('miHimnario', JSON.stringify(himnario));
    actualizarBotonFavorito(true);
  }
}

function eliminarDeHimnario() {
  let himnario = JSON.parse(localStorage.getItem('miHimnario')) || [];
  himnario = himnario.filter(h => h.id !== currentHymnId);
  localStorage.setItem('miHimnario', JSON.stringify(himnario));
  actualizarBotonFavorito(false);
}

function actualizarBotonFavorito(guardado) {
  const btn = document.getElementById('favBtn');
  if (!btn) return;

  if (guardado) {
    btn.textContent = '\u274C Quitar de Mi Himnario';
    btn.style.backgroundColor = '#ff7043';
    btn.onclick = eliminarDeHimnario;
  } else {
    btn.textContent = '\u2795 Agregar a Mi Himnario';
    btn.style.backgroundColor = '#b39ddb';
    btn.onclick = agregarAHimnario;
  }
}

function verificarFavorito() {
  const himnario = JSON.parse(localStorage.getItem('miHimnario')) || [];
  const yaGuardado = himnario.some(h => h.id === currentHymnId);
  actualizarBotonFavorito(yaGuardado);
}


// 📂 Funciones para agregar a listas personalizadas
document.addEventListener('DOMContentLoaded', () => {
  const mostrarSelectorBtn = document.getElementById('mostrarSelectorBtn');
  const selectorListas = document.getElementById('selectorListas');
  const listasSelect = document.getElementById('listasSelect');
  const agregarBtn = document.getElementById('agregarAHimnarioBtn');

  const listas = JSON.parse(localStorage.getItem('listas')) || {};

  if (mostrarSelectorBtn) {
    mostrarSelectorBtn.addEventListener('click', () => {
      if (Object.keys(listas).length === 0) {
        alert('No tienes listas creadas. Ve a favoritos para crear una.');
        return;
      }

      selectorListas.style.display = 'block';
      listasSelect.innerHTML = '';
      Object.keys(listas).forEach(nombre => {
        const option = document.createElement('option');
        option.value = nombre;
        option.textContent = nombre;
        listasSelect.appendChild(option);
      });
    });
  }

  if (agregarBtn) {
    agregarBtn.addEventListener('click', () => {
      const listaSeleccionada = listasSelect.value;
      if (!listaSeleccionada) return alert('Selecciona una lista');

      const numero = Number(currentHymnId);
      if (!listas[listaSeleccionada].includes(numero)) {
        listas[listaSeleccionada].push(numero);
        localStorage.setItem('listas', JSON.stringify(listas));
        alert(`Himno ${numero} agregado a "${listaSeleccionada}"`);
      } else {
        alert('Este himno ya está en esa lista');
      }

      selectorListas.style.display = 'none';
    });
  }
});


// 📤 Compartir y copiar
function generarTextoCompartido(himno) {
  if (!himno || !Array.isArray(himno.content) || himno.content.length === 0) {
    return `⚠️ Himno #${himno?.number || 'sin número'} no tiene contenido disponible.`;
  }

  let texto = `🎵 Himno #${himno.number}: ${himno.title}\n\n`;

  const estrofas = himno.content.filter(p => p.type === "verse");
  const coro = himno.content.find(p => p.type === "chorus");

  if (estrofas.length > 0) {
    texto += `${estrofas[0].label}\n${estrofas[0].lines.join('\n')}\n\n`;
  }

  if (coro) {
    texto += `${coro.label}\n${coro.lines.join('\n')}\n\n`;
  }

  for (let i = 1; i < estrofas.length; i++) {
    texto += `${estrofas[i].label}\n${estrofas[i].lines.join('\n')}\n\n`;
  }

  return texto.trim();
}

function obtenerHimnoCompartible() {
  const numero = currentHymnId;
  const personalizados = JSON.parse(localStorage.getItem('himnosPersonalizados')) || [];
  const originales = JSON.parse(localStorage.getItem('himnosOriginales')) || [];
  const todos = [...originales, ...personalizados];
  return todos.find(h => h.number == numero) || window.hymnData || null;
}

function obtenerTextoCompartible() {
  const himno = obtenerHimnoCompartible();
  return himno ? generarTextoCompartido(himno) : 'Himno no encontrado';
}

function dividirLineaCanvas(ctx, texto, anchoMaximo) {
  const palabras = String(texto || '').split(/\s+/).filter(Boolean);
  const lineas = [];
  let linea = '';

  palabras.forEach(palabra => {
    const prueba = linea ? `${linea} ${palabra}` : palabra;
    if (linea && ctx.measureText(prueba).width > anchoMaximo) {
      lineas.push(linea);
      linea = palabra;
    } else {
      linea = prueba;
    }
  });
  if (linea) lineas.push(linea);
  return lineas.length ? lineas : [''];
}

function crearImagenHimno(himno) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const width = 1080;
  const padding = 92;
  const maxTextWidth = width - (padding * 2);
  const rows = [];

  ctx.font = '500 38px Georgia, serif';
  himno.content.forEach(block => {
    rows.push({ kind: 'label', text: block.label || (block.type === 'chorus' ? 'Coro' : 'Estrofa') });
    (block.lines || []).forEach(line => {
      dividirLineaCanvas(ctx, line, maxTextWidth).forEach(text => rows.push({ kind: 'line', text }));
    });
    rows.push({ kind: 'space', text: '' });
  });

  const height = Math.max(1080, 330 + rows.reduce((sum, row) => {
    if (row.kind === 'label') return sum + 62;
    if (row.kind === 'space') return sum + 28;
    return sum + 52;
  }, 0));
  canvas.width = width;
  canvas.height = height;

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f7fbf8');
  gradient.addColorStop(1, '#e6f2eb');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#174b35';
  ctx.fillRect(0, 0, 22, height);
  ctx.fillStyle = '#d3a832';
  ctx.fillRect(22, 0, 8, height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#2f7a54';
  ctx.font = '700 28px Arial, sans-serif';
  ctx.fillText('HIMNARIO DIGITAL IADSDER', width / 2, 74);

  ctx.fillStyle = '#174b35';
  ctx.font = '700 54px Georgia, serif';
  const titleLines = dividirLineaCanvas(ctx, `Himno ${himno.number} · ${himno.title}`, maxTextWidth);
  let y = 150;
  titleLines.forEach(line => {
    ctx.fillText(line, width / 2, y);
    y += 64;
  });
  y += 34;

  rows.forEach(row => {
    if (row.kind === 'label') {
      ctx.fillStyle = '#b07f08';
      ctx.font = '700 25px Arial, sans-serif';
      ctx.fillText(row.text.toUpperCase(), width / 2, y);
      y += 52;
    } else if (row.kind === 'space') {
      y += 28;
    } else {
      ctx.fillStyle = '#243c30';
      ctx.font = '500 38px Georgia, serif';
      ctx.fillText(row.text, width / 2, y);
      y += 52;
    }
  });

  ctx.fillStyle = '#607068';
  ctx.font = '500 23px Arial, sans-serif';
  ctx.fillText('iadsder.org · Compartiendo esperanza por medio de la alabanza', width / 2, height - 48);
  return canvas;
}

async function compartirComoImagen() {
  const himno = obtenerHimnoCompartible();
  if (!himno || !Array.isArray(himno.content) || !himno.content.length) {
    alert('No se pudo generar la imagen de este himno.');
    return;
  }

  const canvas = crearImagenHimno(himno);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) {
    alert('No se pudo generar la imagen.');
    return;
  }

  const fileName = `himno-${himno.number || 'iadsder'}.png`;
  const file = new File([blob], fileName, { type: 'image/png' });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: `Himno ${himno.number}: ${himno.title}`,
        text: 'Himnario Digital IADSDER',
        files: [file]
      });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  alert('La imagen se descargó. Ya puedes adjuntarla en la aplicación que prefieras.');
}

function compartirPorWhatsApp() {
  const texto = obtenerTextoCompartible();
  const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}

function compartirPorTelegram() {
  const texto = obtenerTextoCompartible();
  const url = `https://t.me/share/url?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}

function compartirPorEmail() {
  const texto = obtenerTextoCompartible();
  const subject = 'Himno para compartir';
  const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}
function copiarAlPortapapeles() {
  const texto = obtenerTextoCompartible();
  navigator.clipboard.writeText(texto).then(() => {
    alert('\u2705 Himno copiado al portapapeles');
  }).catch(() => {
    alert('\u274C No se pudo copiar el himno');
  });
}


// 📱 Menú de compartir
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('btnToggleCompartir');
  const menu = document.getElementById('menuCompartir');

  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', () => {
      menu.classList.toggle('oculto');
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
        menu.classList.add('oculto');
      }
    });
    // 👇 Cierra el menú al hacer scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY || document.documentElement.scrollTop;
      if (currentScroll > lastScrollTop) {
        // Solo cierra si se desliza hacia abajo
        menu.classList.add('oculto');
      }
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });
  }
});




