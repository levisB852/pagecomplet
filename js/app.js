// ====== Ajuste dinámico del alto del navbar para compensaciones exactas ======
(function setNavHeight(){
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const set = () => {
    const h = nav.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--nav-h', `${Math.round(h)}px`);
  };
  set();
  window.addEventListener('resize', set);
})();

// Año dinámico
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Menú móvil accesible
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const open = mobileMenu.hasAttribute('hidden') === false;
    if (open){
      mobileMenu.setAttribute('hidden', '');
      menuBtn.setAttribute('aria-expanded', 'false');
    } else {
      mobileMenu.removeAttribute('hidden');
      menuBtn.setAttribute('aria-expanded', 'true');
    }
  });
}

// Datos de eventos (si no usas eventos, este bloque no afecta nada)
const EVENTS = [
  { id:1, title:'Vigilia de Oración', type:'culto', date:'2025-11-15', time:'7:00 PM', cover:'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop', place:'Templo principal' },
  { id:2, title:'Encuentro de Jóvenes', type:'jovenes', date:'2025-11-22', time:'4:00 PM', cover:'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?q=80&w=1200&auto=format&fit=crop', place:'Salón multiusos' },
  { id:3, title:'Brigada de Salud', type:'comunidad', date:'2025-12-01', time:'8:30 AM', cover:'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop', place:'Parque Central' },
  { id:4, title:'Escuela Sabática Infantil', type:'niños', date:'2025-11-29', time:'9:00 AM', cover:'https://images.unsplash.com/photo-1596464716121-8b7062b3cf4a?q=80&w=1200&auto=format&fit=crop', place:'Aulas infantiles' }
];

const eventList = document.getElementById('eventList');
const filterBtns = document.querySelectorAll('[data-filter]');

function renderEvents(type = 'all'){
  if (!eventList) return;
  const f = type === 'all' ? EVENTS : EVENTS.filter(e=>e.type === type);
  eventList.innerHTML = f.map(e => `
    <article class="card event-card">
      <div class="event-cover"><img src="${e.cover}" alt="${e.title}"></div>
      <h3>${e.title}</h3>
      <div class="event-meta"><span>📅 ${new Date(e.date).toLocaleDateString('es-SV')}</span><span>🕓 ${e.time}</span><span>📍 ${e.place}</span></div>
      <div style="margin-top:.6rem"><a class="btn btn-ghost" href="#">Ver detalle</a></div>
    </article>
  `).join('');
}
renderEvents();

filterBtns.forEach(b => b.addEventListener('click', () => {
  const t = b.getAttribute('data-filter');
  renderEvents(t);
}));

// Animaciones de aparición al hacer scroll
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  })
}, { threshold: .14 });
document.querySelectorAll('[data-reveal]').forEach(el=>revealObserver.observe(el));

// Botón volver arriba
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', ()=>{
  if (!toTop) return;
  toTop.style.display = window.scrollY > 800 ? 'inline-flex' : 'none';
}, { passive:true });
if (toTop) toTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

// ---- Resaltar enlace activo según la sección visible ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, #mobileMenu a');
const linkById = {};
navLinks.forEach(a => {
  const id = a.getAttribute('href')?.replace('#','');
  if (id) linkById[id] = a;
});
const rootMarginTop = getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '64px';
const spy = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    const id = entry.target.id;
    if (entry.isIntersecting && linkById[id]) {
      navLinks.forEach(l => l.classList.remove('active'));
      linkById[id].classList.add('active');
    }
  });
}, { rootMargin: `-${rootMarginTop.trim()} 0px -60% 0px`, threshold: 0.1 });
sections.forEach(s => spy.observe(s));

// ---- Cerrar menú móvil al hacer click en una opción ----
document.querySelectorAll('#mobileMenu a').forEach(a=>{
  a.addEventListener('click', ()=>{
    if (mobileMenu && !mobileMenu.hasAttribute('hidden')) {
      mobileMenu.setAttribute('hidden','');
      if (menuBtn) menuBtn.setAttribute('aria-expanded','false');
    }
  });
});

// ---- Click en la marca para volver arriba ----
const brandTop = document.getElementById('brandTop');
if (brandTop) {
  brandTop.addEventListener('click', (e)=>{
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ====== Barra inteligente: se oculta al bajar y aparece al subir ======
(function smartNav(){
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let lastY = window.scrollY;
  let ticking = false;
  const downHideStart = 80;
  const minDelta = 8;

  function onScroll() {
    const y = window.scrollY;
    const delta = y - lastY;

    const menuOpen = mobileMenu && !mobileMenu.hasAttribute('hidden');

    if (Math.abs(delta) > minDelta && !menuOpen) {
      const goingDown = delta > 0;

      if (goingDown && y > downHideStart) {
        nav.classList.add('nav--hidden');
      } else {
        nav.classList.remove('nav--hidden');
      }

      lastY = y;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive:true });
})();

// ---- Toggle mapas en Iglesias Filiales ----
document.querySelectorAll('.toggle-map').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.filial-card');
    if (!card) return;
    const map = card.querySelector('.filial-map');
    if (!map) return;

    const isHidden = map.hasAttribute('hidden');
    if (isHidden) {
      map.removeAttribute('hidden');
      btn.textContent = 'Ocultar ubicación';
    } else {
      map.setAttribute('hidden', '');
      btn.textContent = 'Ver ubicación';
    }
  });
});

// ============================================================
// ✅ NETLIFY FORMS: Enviar contacto SIN redirigir (AJAX GRATIS) - FIX 404
// ============================================================
(function netlifyAjaxContact(){
  const form = document.getElementById('contactForm');
  const msg  = document.getElementById('formMsg');
  if (!form || !msg) return;

  function setDisabled(disabled) {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = disabled;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    msg.textContent = 'Enviando...';
    setDisabled(true);

    const body = new URLSearchParams(new FormData(form)).toString();

    try {
      // 👇 endpoint correcto para Netlify Forms
      const res = await fetch('/.netlify/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });

      const ok = res.ok || (res.status >= 300 && res.status < 400);

      if (ok) {
        msg.textContent = '✅ Mensaje enviado correctamente. Gracias por escribirnos.';
        form.reset();
      } else {
        msg.textContent = `❌ No se pudo enviar (código ${res.status}). Intenta más tarde.`;
      }
    } catch (err) {
      msg.textContent = '❌ Error de conexión. Intenta nuevamente.';
    } finally {
      setDisabled(false);
    }
  });
})();

// ====== Videos YouTube: reproducir en modal o abrir en YouTube ======
(function youtubeCards(){
  const modal = document.getElementById('videoModal');
  const frame = document.getElementById('videoFrame');
  const titleEl = document.getElementById('videoTitle');
  const openYtBtn = document.getElementById('videoOpenYoutube');

  if (!modal || !frame || !titleEl || !openYtBtn) return;

  const openModal = (id, title='') => {
    // autoplay + modestbranding para que se vea más limpio
    frame.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    titleEl.textContent = title || 'Video';
    openYtBtn.href = `https://www.youtube.com/watch?v=${id}`;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    frame.src = ''; // importante: parar el video
    document.body.style.overflow = '';
  };

  // Delegación: clicks en tarjetas
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.video-card');
    if (!card) return;

    const id = card.getAttribute('data-youtube-id');
    const title = card.getAttribute('data-title') || '';

    // Botones "Reproducir aquí" o play sobre la imagen
    if (e.target.closest('.video-open') || e.target.closest('.video-play')) {
      openModal(id, title);
    }

    // Link "Abrir en YouTube" (web/app)
    const ytLink = card.querySelector('.video-youtube');
    if (ytLink) {
      ytLink.href = `https://www.youtube.com/watch?v=${id}`;
    }
  });

  // Cerrar modal: click fuera o botón X
  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-close]')) closeModal();
  });

  // Cerrar con ESC
  window.addEventListener('keydown', (e) => {
    if (!modal.hidden && e.key === 'Escape') closeModal();
  });
})();
(function galleryLightbox(){
  const modal = document.getElementById("imgModal");
  const view  = document.getElementById("imgModalView");
  if(!modal || !view) return;

  function open(src, alt){
    view.src = src;
    view.alt = alt || "Imagen";
    modal.hidden = false;
    modal.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }
  function close(){
    modal.hidden = true;
    modal.setAttribute("aria-hidden","true");
    view.src = "";
    document.body.style.overflow = "";
  }

  // ✅ Galería
  document.querySelectorAll(".gallery-item img").forEach(img=>{
    img.parentElement.addEventListener("click", ()=> open(img.src, img.alt));
  });

  // ✅ Filiales (nuevo)
  document.querySelectorAll(".filial-item img").forEach(img=>{
    img.parentElement.addEventListener("click", ()=> open(img.src, img.alt));
  });

  modal.addEventListener("click", (e)=>{
    if(e.target.matches("[data-close]")) close();
  });

  document.addEventListener("keydown", (e)=>{
    if(!modal.hidden && e.key === "Escape") close();
  });
})();

