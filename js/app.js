// ============================================================
// 1. ALTURA DINÁMICA DEL NAV
// ============================================================
(function setNavHeight() {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  const set = () => {
    const h = nav.getBoundingClientRect().height;
    document.documentElement.style.setProperty("--nav-h", `${Math.round(h)}px`);
  };

  set();
  window.addEventListener("resize", set);
})();

// ============================================================
// 2. AÑO DINÁMICO
// ============================================================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================================
// 3. MENÚ MÓVIL
// ============================================================
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    const open = mobileMenu.hasAttribute("hidden") === false;

    if (open) {
      mobileMenu.setAttribute("hidden", "");
      menuBtn.setAttribute("aria-expanded", "false");
    } else {
      mobileMenu.removeAttribute("hidden");
      menuBtn.setAttribute("aria-expanded", "true");
    }
  });
}

// ============================================================
// 4. EVENTOS
// ============================================================
const EVENTS = [
  { id: 1, title: "Vigilia de Oración", type: "culto", date: "2025-11-15", time: "7:00 PM", cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop", place: "Templo principal" },
  { id: 2, title: "Encuentro de Jóvenes", type: "jovenes", date: "2025-11-22", time: "4:00 PM", cover: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?q=80&w=1200&auto=format&fit=crop", place: "Salón multiusos" },
  { id: 3, title: "Brigada de Salud", type: "comunidad", date: "2025-12-01", time: "8:30 AM", cover: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop", place: "Parque Central" },
  { id: 4, title: "Escuela Sabática Infantil", type: "niños", date: "2025-11-29", time: "9:00 AM", cover: "https://images.unsplash.com/photo-1596464716121-8b7062b3cf4a?q=80&w=1200&auto=format&fit=crop", place: "Aulas infantiles" }
];

const eventList = document.getElementById("eventList");
const filterBtns = document.querySelectorAll("[data-filter]");

function renderEvents(type = "all") {
  if (!eventList) return;

  const filtered = type === "all" ? EVENTS : EVENTS.filter(e => e.type === type);

  eventList.innerHTML = filtered.map(e => `
    <article class="card event-card">
      <div class="event-cover"><img src="${e.cover}" alt="${e.title}"></div>
      <h3>${e.title}</h3>
      <div class="event-meta">
        <span>📅 ${new Date(e.date).toLocaleDateString("es-SV")}</span>
        <span>🕓 ${e.time}</span>
        <span>📍 ${e.place}</span>
      </div>
      <div style="margin-top:.6rem"><a class="btn btn-ghost" href="#">Ver detalle</a></div>
    </article>
  `).join("");
}
renderEvents();

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.getAttribute("data-filter");
    renderEvents(type);
  });
});

// ============================================================
// 5. ANIMACIONES REVEAL
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll("[data-reveal]").forEach(el => revealObserver.observe(el));

// ============================================================
// 6. BOTÓN VOLVER ARRIBA
// ============================================================
const toTop = document.getElementById("toTop");

window.addEventListener("scroll", () => {
  if (!toTop) return;
  toTop.style.display = window.scrollY > 800 ? "inline-flex" : "none";
}, { passive: true });

if (toTop) {
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ============================================================
// 7. ENLACE ACTIVO SEGÚN SECCIÓN
// ============================================================
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a, #mobileMenu a");
const linkById = {};

navLinks.forEach(a => {
  const id = a.getAttribute("href")?.replace("#", "");
  if (id) linkById[id] = a;
});

const rootMarginTop = getComputedStyle(document.documentElement).getPropertyValue("--nav-h") || "64px";

const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    if (entry.isIntersecting && linkById[id]) {
      navLinks.forEach(l => l.classList.remove("active"));
      linkById[id].classList.add("active");
    }
  });
}, {
  rootMargin: `-${rootMarginTop.trim()} 0px -60% 0px`,
  threshold: 0.1
});

sections.forEach(section => spy.observe(section));

// ============================================================
// 8. CERRAR MENÚ MÓVIL AL HACER CLICK
// ============================================================
document.querySelectorAll("#mobileMenu a").forEach(a => {
  a.addEventListener("click", () => {
    if (mobileMenu && !mobileMenu.hasAttribute("hidden")) {
      mobileMenu.setAttribute("hidden", "");
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    }
  });
});

// ============================================================
// 9. CLICK EN MARCA PARA SUBIR
// ============================================================
const brandTop = document.getElementById("brandTop");
if (brandTop) {
  brandTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ============================================================
// 10. NAV INTELIGENTE
// ============================================================
(function smartNav() {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  let lastY = window.scrollY;
  let ticking = false;
  const downHideStart = 80;
  const minDelta = 8;

  function onScroll() {
    const y = window.scrollY;
    const delta = y - lastY;
    const menuOpen = mobileMenu && !mobileMenu.hasAttribute("hidden");

    if (Math.abs(delta) > minDelta && !menuOpen) {
      const goingDown = delta > 0;

      if (goingDown && y > downHideStart) {
        nav.classList.add("nav--hidden");
      } else {
        nav.classList.remove("nav--hidden");
      }

      lastY = y;
    }

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
})();

// ============================================================
// 11. TOGGLE MAPAS FILIALES
// ============================================================
document.querySelectorAll(".toggle-map").forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".filial-card");
    if (!card) return;

    const map = card.querySelector(".filial-map");
    if (!map) return;

    const isHidden = map.hasAttribute("hidden");

    if (isHidden) {
      map.removeAttribute("hidden");
      btn.textContent = "Ocultar ubicación";
      btn.setAttribute("aria-expanded", "true");
    } else {
      map.setAttribute("hidden", "");
      btn.textContent = "Ver ubicación";
      btn.setAttribute("aria-expanded", "false");
    }
  });
});

// ============================================================
// 12. NETLIFY FORM
// ============================================================
(function netlifyAjaxContact() {
  const form = document.getElementById("contactForm");
  const msg = document.getElementById("formMsg");
  if (!form || !msg) return;

  function setDisabled(disabled) {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = disabled;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    msg.textContent = "Enviando...";
    setDisabled(true);

    const body = new URLSearchParams(new FormData(form)).toString();

    try {
      const res = await fetch("/.netlify/forms", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
      });

      const ok = res.ok || (res.status >= 300 && res.status < 400);

      if (ok) {
        msg.textContent = "✅ Mensaje enviado correctamente. Gracias por escribirnos.";
        form.reset();
      } else {
        msg.textContent = `❌ No se pudo enviar (código ${res.status}). Intenta más tarde.`;
      }
    } catch (err) {
      msg.textContent = "❌ Error de conexión. Intenta nuevamente.";
    } finally {
      setDisabled(false);
    }
  });
})();

// ============================================================
// 13. VIDEOS YOUTUBE
// ============================================================
(function youtubeCards() {
  const modal = document.getElementById("videoModal");
  const frame = document.getElementById("videoFrame");
  const titleEl = document.getElementById("videoTitle");
  const openYtBtn = document.getElementById("videoOpenYoutube");

  if (!modal || !frame || !titleEl || !openYtBtn) return;

  function getWebUrl(id) {
    return `https://www.youtube.com/watch?v=${id}`;
  }

  function getAppUrl(id) {
    return `youtube://watch?v=${id}`;
  }

  function openModal(id, title = "") {
    frame.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    titleEl.textContent = title || "Video";
    openYtBtn.href = getWebUrl(id);

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    frame.src = "";
    document.body.style.overflow = "";
  }

  function tryOpenYoutubeApp(id) {
    const appUrl = getAppUrl(id);
    const webUrl = getWebUrl(id);

    window.location.href = appUrl;

    setTimeout(() => {
      window.open(webUrl, "_blank", "noopener");
    }, 700);
  }

  document.querySelectorAll(".video-card").forEach(card => {
    const id = card.getAttribute("data-youtube-id");
    const ytLink = card.querySelector(".video-youtube");

    if (ytLink && id) {
      ytLink.href = getWebUrl(id);
    }
  });

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".video-card");
    if (!card) return;

    const id = card.getAttribute("data-youtube-id");
    const title = card.getAttribute("data-title") || "Video";

    if (e.target.closest(".video-open") || e.target.closest(".video-play")) {
      openModal(id, title);
      return;
    }

    const ytLink = e.target.closest(".video-youtube");
    if (ytLink) {
      e.preventDefault();
      tryOpenYoutubeApp(id);
    }
  });

  openYtBtn.addEventListener("click", (e) => {
    const currentSrc = frame.src;
    const match = currentSrc.match(/embed\/([^?]+)/);

    if (!match) return;

    e.preventDefault();
    const id = match[1];
    tryOpenYoutubeApp(id);
  });

  modal.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]")) {
      closeModal();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (!modal.hidden && e.key === "Escape") {
      closeModal();
    }
  });
})();

// ============================================================
// 14. RADIO (VERSIÓN SIMPLE Y ESTABLE)
// ============================================================
(function radioPlayer() {

  const audio = document.getElementById("radioAudio");
  const btn = document.getElementById("radioToggle");
  const vol = document.getElementById("radioVol");
  const status = document.getElementById("radioStatus");

  if (!audio || !btn || !vol || !status) return;

  const card = btn.closest(".radio-card");
  const STREAM_URL = "https://stream.zeno.fm/rghmon0t9xauv";

  function setUI(playing) {
    btn.textContent = playing ? "⏸ Pausar" : "▶ Reproducir";
    btn.setAttribute("aria-pressed", playing ? "true" : "false");

    if (card) {
      card.classList.toggle("is-playing", playing);
    }
  }

  // ▶ BOTÓN PLAY / PAUSE
  btn.addEventListener("click", async () => {
    try {
      if (audio.paused) {

        status.textContent = "Conectando...";

        // 🔥 evita caché (IMPORTANTE)
        audio.src = STREAM_URL + "?nocache=" + Date.now();

        await audio.play();

        setUI(true);
        status.textContent = "🔊 Reproduciendo en vivo.";

      } else {

        audio.pause();

        setUI(false);
        status.textContent = "Pausado.";

      }

    } catch (error) {
      setUI(false);
      status.textContent = "❌ Error al reproducir.";
    }
  });

  // 🔊 VOLUMEN
  vol.addEventListener("input", () => {
    audio.volume = Number(vol.value);
  });

  // 📡 ESTADOS
  audio.addEventListener("waiting", () => {
    status.textContent = "Cargando señal...";
  });

  audio.addEventListener("playing", () => {
    status.textContent = "🔊 Reproduciendo en vivo.";
  });

  audio.addEventListener("pause", () => {
    if (!audio.ended) {
      status.textContent = "Pausado.";
    }
  });

  audio.addEventListener("error", () => {
    status.textContent = "❌ Error en la transmisión.";
  });

})();

// ============================================================
// 15. BUSCADOR FILIALES
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("filialSearch");
  const clear = document.getElementById("filialClear");
  const countEl = document.getElementById("filialCount");
  const emptyEl = document.getElementById("filialEmpty");

  if (!input || !clear || !countEl || !emptyEl) return;

  const cards = Array.from(document.querySelectorAll("article.filial-card"));
  if (!cards.length) {
    countEl.textContent = "No se encontraron tarjetas .filial-card en esta página.";
    return;
  }

  const index = cards.map(card => {
    const text = (card.innerText || card.textContent || "").toLowerCase();
    return { card, text };
  });

  function updateUI(visible) {
    countEl.textContent = `Mostrando ${visible} de ${cards.length} filiales.`;
    emptyEl.style.display = visible === 0 ? "block" : "none";
  }

  function applyFilter(value) {
    const q = (value || "").trim().toLowerCase();
    let visible = 0;

    index.forEach(({ card, text }) => {
      const match = q === "" || text.includes(q);
      card.classList.toggle("is-hidden", !match);
      if (match) visible++;
    });

    updateUI(visible);
  }

  applyFilter("");

  input.addEventListener("input", () => applyFilter(input.value));

  clear.addEventListener("click", () => {
    input.value = "";
    input.focus();
    applyFilter("");
  });
});

// ============================================================
// 16. CARGAR GALERÍA DESDE CLOUDINARY
// ============================================================
(async function galleryFromCloudinary() {
  const track = document.getElementById("galleryTrack");
  const loading = document.getElementById("galleryLoading");
  if (!track) return;

  try {
    const res = await fetch("/.netlify/functions/gallery");
    if (!res.ok) throw new Error("No se pudo cargar la galería");

    const data = await res.json();
    const images = Array.isArray(data.images) ? data.images : [];

    if (!images.length) {
      if (loading) loading.textContent = "No hay fotos todavía.";
      return;
    }

    track.innerHTML = "";

    images.forEach(img => {
      const btn = document.createElement("button");
      btn.className = "gallery-item";
      btn.type = "button";

      const im = document.createElement("img");
      im.src = img.url;
      im.alt = img.alt || "Foto";
      im.loading = "lazy";

      btn.appendChild(im);
      track.appendChild(btn);
    });
  } catch (e) {
    if (loading) loading.textContent = "Error cargando fotos. Revisa Netlify.";
    console.error(e);
  }
})();

// ============================================================
// 17. CONTROLES DEL CARRUSEL
// ============================================================
(function galleryCarouselControls() {
  const track = document.getElementById("galleryTrack");
  if (!track) return;

  const wrap = track.closest(".gallery-carousel");
  const prev = wrap?.querySelector(".gallery-nav.prev");
  const next = wrap?.querySelector(".gallery-nav.next");

  function getStep() {
    const item = track.querySelector(".gallery-item");
    if (!item) return 300;
    const gap = 14;
    return item.getBoundingClientRect().width + gap;
  }

  function go(dir) {
    track.scrollBy({ left: dir * getStep(), behavior: "smooth" });
  }

  prev?.addEventListener("click", () => go(-1));
  next?.addEventListener("click", () => go(1));
})();

// ============================================================
// 18. LIGHTBOX GALERÍA GENERAL + FILIALES
// ============================================================
(function galleryLightbox() {
  const modal = document.getElementById("imgModal");
  const view = document.getElementById("imgModalView");
  const prevBtn = document.getElementById("imgPrev");
  const nextBtn = document.getElementById("imgNext");
  const backdrop = modal?.querySelector(".img-modal__backdrop");

  if (!modal || !view || !prevBtn || !nextBtn || !backdrop) return;

  let images = [];
  let currentIndex = 0;

  let touchStartX = 0;
  let touchEndX = 0;
  const minSwipeDistance = 50;

  // ABRIR GALERÍA
  function openGallery(galleryImages, startIndex = 0, alt = "Imagen") {
    images = galleryImages;
    currentIndex = startIndex;

    if (!images.length) return;

    view.src = images[currentIndex];
    view.alt = alt;

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Mostrar flechas solo si hay varias imágenes
    prevBtn.style.display = images.length > 1 ? "grid" : "none";
    nextBtn.style.display = images.length > 1 ? "grid" : "none";
  }

  // CERRAR
  function closeGallery() {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    view.src = "";
    view.alt = "";
    images = [];
    document.body.style.overflow = "";
  }

  // SIGUIENTE
  function showNext() {
    if (!images.length) return;
    currentIndex = (currentIndex + 1) % images.length;
    view.src = images[currentIndex];
  }

  // ANTERIOR
  function showPrev() {
    if (!images.length) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    view.src = images[currentIndex];
  }

  // CLICK GLOBAL
  document.addEventListener("click", (e) => {

    // ===== FILIALES =====
    const filialBtn = e.target.closest(".filial-item");
    if (filialBtn) {
      const img = filialBtn.querySelector("img");
      const gallery = filialBtn.dataset.gallery;

      if (!gallery) return;

      const filialImages = gallery
        .split(",")
        .map(src => src.trim())
        .filter(Boolean);

      openGallery(filialImages, 0, img?.alt || "Imagen de filial");
      return;
    }

    // ===== GALERÍA PRINCIPAL =====
    const galleryBtn = e.target.closest(".gallery-item");
    if (galleryBtn) {
      const galleryImgs = Array.from(document.querySelectorAll(".gallery-item img"));
      const clickedImg = galleryBtn.querySelector("img");

      if (!clickedImg || !galleryImgs.length) return;

      const urls = galleryImgs.map(img => img.src);
      const index = galleryImgs.indexOf(clickedImg);

      openGallery(urls, index, clickedImg.alt || "Imagen");
    }
  });

  // BOTONES
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
  });

  // CERRAR
  backdrop.addEventListener("click", closeGallery);

  modal.querySelectorAll("[data-close]").forEach(el => {
    el.addEventListener("click", closeGallery);
  });

  // TECLADO
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;

    if (e.key === "Escape") closeGallery();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });

  // SWIPE (CELULAR)
  view.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  view.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance < 0) {
      showNext();
    } else {
      showPrev();
    }
  }, { passive: true });

})();