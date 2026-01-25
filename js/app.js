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
  const downHideStart = 80;   // desde qué distancia empezamos a ocultar
  const minDelta = 8;         // mínimo desplazamiento para reaccionar (anti-jitter)

  function onScroll() {
    const y = window.scrollY;
    const delta = y - lastY;

    // si el menú móvil está abierto, no ocultar
    const menuOpen = mobileMenu && !mobileMenu.hasAttribute('hidden');

    if (Math.abs(delta) > minDelta && !menuOpen) {
      const goingDown = delta > 0;

      if (goingDown && y > downHideStart) {
        nav.classList.add('nav--hidden');      // ocultar al bajar
      } else {
        nav.classList.remove('nav--hidden');   // mostrar al subir aunque sea poquito
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
// ====== Mensaje simple al enviar el formulario (sin romper Netlify Forms) ======
(function contactSendingMsg(){
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  if (!form || !msg) return;

  form.addEventListener('submit', () => {
    msg.textContent = 'Enviando...';
  });
})();

// ====== Envío AJAX para Netlify Forms (GRATIS, sin redirección) ======
(function netlifyAjaxForm(){
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  if (!form || !msg) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // detenemos envío normal

    msg.textContent = 'Enviando...';

    const formData = new FormData(form);

    try {
      const res = await fetch('/', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        msg.textContent = '✅ Mensaje enviado correctamente. Gracias por escribirnos.';
        form.reset();
      } else {
        msg.textContent = '❌ No se pudo enviar el mensaje. Intenta más tarde.';
      }
    } catch (err) {
      msg.textContent = '❌ Error de conexión. Intenta nuevamente.';
    }
  });
})();
