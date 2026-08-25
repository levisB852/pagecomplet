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
  const padding = 125;
  const maxTextWidth = width - (padding * 2);
  const rows = [];

  ctx.font = '500 38px Georgia, serif';
  himno.content.forEach(block => {
    const isChorus = block.type === 'chorus';
    rows.push({ kind: 'label', text: block.label || (isChorus ? 'Coro' : 'Estrofa'), isChorus });
    (block.lines || []).forEach(line => {
      dividirLineaCanvas(ctx, line, maxTextWidth).forEach(text => rows.push({ kind: 'line', text, isChorus }));
    });
    rows.push({ kind: 'space', text: '' });
  });

  const height = Math.max(1080, 610 + rows.reduce((sum, row) => {
    if (row.kind === 'label') return sum + 58;
    if (row.kind === 'space') return sum + 24;
    return sum + 50;
  }, 0));
  canvas.width = width;
  canvas.height = height;

  function roundedRect(x, y, w, h, radius) {
    const r = Math.min(radius, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#103d2a');
  gradient.addColorStop(1, '#286748');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(255,255,255,.06)';
  ctx.beginPath();
  ctx.arc(940, 120, 210, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(80, height - 40, 250, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = 'rgba(0,0,0,.22)';
  ctx.shadowBlur = 35;
  ctx.shadowOffsetY = 14;
  roundedRect(48, 48, width - 96, height - 96, 34);
  ctx.fillStyle = '#fffdf7';
  ctx.fill();
  ctx.shadowColor = 'transparent';

  roundedRect(72, 72, width - 144, 225, 25);
  ctx.fillStyle = '#174b35';
  ctx.fill();

  ctx.fillStyle = '#d3a832';
  ctx.beginPath();
  ctx.arc(167, 184, 64, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.font = '700 36px Arial, sans-serif';
  ctx.fillText(String(himno.number || '♪'), 167, 197);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#dbe9e0';
  ctx.font = '700 23px Arial, sans-serif';
  ctx.fillText('HIMNARIO DIGITAL · IADSDER', 260, 125);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 46px Georgia, serif';
  const titleLines = dividirLineaCanvas(ctx, himno.title || 'Himno', 680);
  let titleY = 184;
  titleLines.forEach(line => {
    ctx.fillText(line, 260, titleY);
    titleY += 52;
  });

  ctx.textAlign = 'center';
  let y = 375;

  rows.forEach(row => {
    if (row.kind === 'label') {
      ctx.fillStyle = row.isChorus ? '#2f7a54' : '#b07f08';
      ctx.font = '700 24px Arial, sans-serif';
      ctx.fillText(row.text.toUpperCase(), width / 2, y);
      y += 50;
    } else if (row.kind === 'space') {
      y += 24;
    } else {
      ctx.fillStyle = row.isChorus ? '#1f6647' : '#293d32';
      ctx.font = row.isChorus ? '600 37px Georgia, serif' : '500 37px Georgia, serif';
      ctx.fillText(row.text, width / 2, y);
      y += 50;
    }
  });

  ctx.strokeStyle = '#d9c88f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(150, height - 135);
  ctx.lineTo(width - 150, height - 135);
  ctx.stroke();

  ctx.fillStyle = '#607068';
  ctx.font = '600 22px Arial, sans-serif';
  ctx.fillText('iadsder.org', width / 2, height - 93);
  ctx.fillStyle = '#87958e';
  ctx.font = '500 19px Arial, sans-serif';
  ctx.fillText('Fe · Alabanza · Esperanza', width / 2, height - 64);
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




