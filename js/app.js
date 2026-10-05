// ============================================================
// 1. ALTURA DINAMICA DEL NAV
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
// 2. ANO DINAMICO
// ============================================================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
const appT = window.iadsderI18n?.t || (value => value);
const appLanguage = window.iadsderI18n?.language?.() || "es";

// Estado comun del contenido administrable. Admite borradores y, cuando los
// campos existen, fechas automaticas de publicacion y retiro.
function isPublished(item) {
  if (!item || item.published === false) return false;

  const now = Date.now();
  const publishAt = item.publishAt ? new Date(item.publishAt).getTime() : NaN;
  const unpublishAt = item.unpublishAt ? new Date(item.unpublishAt).getTime() : NaN;

  if (Number.isFinite(publishAt) && publishAt > now) return false;
  if (Number.isFinite(unpublishAt) && unpublishAt <= now) return false;
  return true;
}

// ============================================================
// 3. MENU MOVIL
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
// 4.5 VERSICULO, DESCARGAS Y AJUSTES EDITABLES
// ============================================================
(function siteEditableContent() {
  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
  }

  function setMeta(selector, attr, value) {
    const el = document.querySelector(selector);
    if (el && value) el.setAttribute(attr, value);
  }

  fetch("/data/versiculo.json")
    .then(res => res.ok ? res.json() : Promise.reject(new Error("Sin versiculo.json")))
    .then(data => {
      if (!isPublished(data)) {
        document.getElementById("versiculo")?.setAttribute("hidden", "");
        return;
      }

      setText("verseText", appT(data.text));
      setText("verseReference", data.reference);
      setText("verseNote", appT(data.note));
    })
    .catch(() => {});

  fetch("/data/ajustes.json")
    .then(res => res.ok ? res.json() : Promise.reject(new Error("Sin ajustes.json")))
    .then(data => {
      const seo = data.seo || {};

      if (seo.title) {
        const translatedTitle = appLanguage === "en"
          ? "Iglesia Adventista de Dios del Séptimo Día en Reforma"
          : seo.title;
        document.title = `${translatedTitle} | iadsder.org`;
        setMeta('meta[property="og:title"]', "content", translatedTitle);
        setMeta('meta[name="twitter:title"]', "content", translatedTitle);
      }

      if (seo.description) {
        const translatedDescription = appLanguage === "en"
          ? "Official IADSDER website with hymnal, live radio, videos, local churches, resources and contact information in El Salvador."
          : seo.description;
        setMeta('meta[name="description"]', "content", translatedDescription);
        setMeta('meta[property="og:description"]', "content", translatedDescription);
        setMeta('meta[name="twitter:description"]', "content", translatedDescription);
      }

      if (seo.image) {
        setMeta('meta[property="og:image"]', "content", seo.image);
        setMeta('meta[name="twitter:image"]', "content", seo.image);
      }
    })
    .catch(() => {});
})();

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
// 6. BOTON VOLVER ARRIBA
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
// 7. ENLACE ACTIVO SEGUN SECCION
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
// 8. CERRAR MENU MOVIL AL HACER CLICK
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
      btn.textContent = window.iadsderI18n?.t("Ocultar ubicación") || "Ocultar ubicacion";
      btn.setAttribute("aria-expanded", "true");
    } else {
      map.setAttribute("hidden", "");
      btn.textContent = window.iadsderI18n?.t("Ver ubicación") || "Ver ubicacion";
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

    msg.textContent = appT("Enviando...");
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
        msg.textContent = appLanguage === "en"
          ? "Message sent successfully. Thank you for writing to us."
          : "Mensaje enviado correctamente. Gracias por escribirnos.";
        form.reset();
      } else {
        msg.textContent = appLanguage === "en"
          ? `The message could not be sent (code ${res.status}). Please try again later.`
          : `No se pudo enviar (codigo ${res.status}). Intenta mas tarde.`;
      }
    } catch (err) {
      msg.textContent = appLanguage === "en"
        ? "Connection error. Please try again."
        : "Error de conexion. Intenta nuevamente.";
    } finally {
      setDisabled(false);
    }
  });
})();

// ============================================================
// 13. VIDEOS YOUTUBE
// ============================================================
(function liveBroadcast() {
  const section = document.getElementById('transmision');
  const grid = document.getElementById('liveGrid');
  const heading = document.getElementById('liveHeading');
  const description = document.getElementById('liveDescription');
  if (!section || !grid) return;

  function youtubeIdFromUrl(value) {
    try {
      const url = new URL(value);
      if (url.hostname.includes('youtu.be')) return url.pathname.split('/').filter(Boolean)[0] || '';
      if (url.pathname.startsWith('/live/') || url.pathname.startsWith('/shorts/') || url.pathname.startsWith('/embed/')) {
        return url.pathname.split('/').filter(Boolean)[1] || '';
      }
      return url.searchParams.get('v') || '';
    } catch (error) {
      return '';
    }
  }

  function getEmbedUrl(platform, sourceUrl) {
    if (platform === 'facebook') {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(sourceUrl)}&show_text=false&autoplay=false`;
    }
    const videoId = youtubeIdFromUrl(sourceUrl);
    return videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1` : '';
  }

  function createLiveCard(platform, sourceUrl) {
    const embedUrl = getEmbedUrl(platform, sourceUrl);
    if (!embedUrl) return null;
    const platformName = platform === 'facebook' ? 'Facebook Live' : 'YouTube Live';
    const article = document.createElement('article');
    article.className = `live-card live-card--${platform}`;
    article.innerHTML = `
      <div class="live-frame">
        <iframe title="${platformName} de IADSDER" src="${embedUrl}" allow="autoplay; encrypted-media; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>
      </div>
      <div class="live-card__footer">
        <div>
          <strong>${platformName}</strong>
          <p>Transmisión oficial</p>
        </div>
        <a class="btn btn-primary" href="${sourceUrl}" target="_blank" rel="noopener">Abrir en ${platform === 'facebook' ? 'Facebook' : 'YouTube'}</a>
      </div>`;
    return article;
  }

  fetch('/data/en-vivo.json', { cache: 'no-cache' })
    .then(response => response.ok ? response.json() : Promise.reject(new Error('Sin configuración de transmisión')))
    .then(data => {
      if (data.published !== true) return;

      const streams = [
        { platform: 'youtube', url: String(data.youtubeUrl || '').trim() },
        { platform: 'facebook', url: String(data.facebookUrl || '').trim() }
      ];

      // Compatibilidad con la primera versión, que guardaba una sola plataforma.
      if (!streams.some(stream => stream.url) && data.url) {
        streams.push({ platform: data.platform === 'facebook' ? 'facebook' : 'youtube', url: String(data.url).trim() });
      }

      const cards = streams.filter(stream => stream.url).map(stream => createLiveCard(stream.platform, stream.url)).filter(Boolean);
      if (!cards.length) return;

      heading.textContent = appT(data.title || 'Transmisión en vivo');
      description.textContent = appT(data.description || 'Acompáñanos en nuestra transmisión.');
      grid.replaceChildren(...cards);
      grid.classList.toggle('live-grid--single', cards.length === 1);
      section.hidden = false;
    })
    .catch(error => console.info('Transmisión en vivo no disponible:', error.message));
})();

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

  function renderVideoCards(videos) {
    const grid = document.getElementById("videoGrid");
    if (!grid || !Array.isArray(videos) || videos.length === 0) return;

    const publishedVideos = videos.filter(isPublished);
    if (!publishedVideos.length) return;

    const t = window.iadsderI18n?.t || (value => value);
    grid.innerHTML = publishedVideos.map(video => `
      <article class="card video-card"
               data-youtube-id="${video.id}"
               data-title="${video.title || "Video"}">
        <div class="video-thumb">
          <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" alt="${video.title || "Video"}" loading="lazy">
          <button class="video-play" type="button" aria-label="${t("Reproducir video")}">&#9658;</button>
        </div>

        <h3>${video.title || "Video"}</h3>
        <p class="muted">${t(video.description || "Mensaje para fortalecer la fe.")}</p>

        <div class="video-actions">
          <button class="btn btn-primary video-open" type="button">${t("Reproducir aquí")}</button>
          <a class="btn btn-ghost video-youtube" href="${getWebUrl(video.id)}" target="_blank" rel="noopener">${t("Abrir en YouTube")}</a>
        </div>
      </article>
    `).join("");
  }

  fetch("/data/videos.json")
    .then(res => res.ok ? res.json() : Promise.reject(new Error("Sin videos.json")))
    .then(data => renderVideoCards(Array.isArray(data) ? data : data.videos))
    .catch(() => {});

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
// 14. RADIO CON RECONEXION AUTOMATICA
// ============================================================
(function radioPlayer() {

  const audio = document.getElementById("radioAudio");
  const btn = document.getElementById("radioToggle");
  const vol = document.getElementById("radioVol");
  const status = document.getElementById("radioStatus");

  if (!audio || !btn || !vol || !status) return;

  const card = btn.closest(".radio-card");
  const STREAM_URL = "https://stream.zeno.fm/rghmon0t9xauv";
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 5000;
  const radioText = (es, en) => appLanguage === "en" ? en : es;

  let userWantsRadio = false;
  let reconnectAttempts = 0;
  let reconnectTimer = null;

  function setUI(playing) {
    btn.textContent = playing ? appT("Pausar") : appT("Reproducir");
    btn.setAttribute("aria-pressed", playing ? "true" : "false");

    if (card) {
      card.classList.toggle("is-playing", playing);
    }
  }

  function getStreamUrl() {
    return STREAM_URL + "?nocache=" + Date.now();
  }

  function clearReconnectTimer() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  async function startRadio() {
    clearReconnectTimer();
    status.textContent = reconnectAttempts > 0
      ? radioText(`Reconectando... intento ${reconnectAttempts} de ${MAX_RECONNECT_ATTEMPTS}.`, `Reconnecting... attempt ${reconnectAttempts} of ${MAX_RECONNECT_ATTEMPTS}.`)
      : radioText("Conectando...", "Connecting...");

    audio.src = getStreamUrl();
    audio.load();
    await audio.play();

    reconnectAttempts = 0;
    setUI(true);
    status.textContent = radioText("Reproduciendo en vivo.", "Playing live.");
  }

  function stopRadio() {
    userWantsRadio = false;
    clearReconnectTimer();
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    reconnectAttempts = 0;
    setUI(false);
    status.textContent = radioText("Pausado.", "Paused.");
  }

  function scheduleReconnect(reason = "Se corto la transmision.") {
    if (!userWantsRadio || reconnectTimer) return;

    if (!navigator.onLine) {
      status.textContent = radioText("Sin internet. Se intentara reconectar cuando vuelva la conexion.", "No internet connection. The radio will reconnect when the connection returns.");
      return;
    }

    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      setUI(false);
      status.textContent = radioText("No se pudo reconectar. Presiona reproducir otra vez.", "Unable to reconnect. Press play to try again.");
      return;
    }

    reconnectAttempts += 1;
    setUI(false);
    status.textContent = appLanguage === "en" ? "Reconnecting in 5 seconds..." : `${reason} Reconectando en 5 segundos...`;

    reconnectTimer = setTimeout(async () => {
      reconnectTimer = null;

      try {
        await startRadio();
      } catch (error) {
        scheduleReconnect("Aun no hay senal.");
      }
    }, RECONNECT_DELAY);
  }

  // BOTON PLAY / PAUSE
  btn.addEventListener("click", async () => {
    if (userWantsRadio && !audio.paused) {
      stopRadio();
      return;
    }

    userWantsRadio = true;
    reconnectAttempts = 0;

    try {
      await startRadio();
    } catch (error) {
      setUI(false);
      scheduleReconnect("No se pudo iniciar la radio.");
    }
  });

  // VOLUMEN
  vol.addEventListener("input", () => {
    audio.volume = Number(vol.value);
  });

  // ESTADOS
  audio.addEventListener("waiting", () => {
    if (userWantsRadio) status.textContent = radioText("Cargando senal...", "Loading stream...");
  });

  audio.addEventListener("playing", () => {
    clearReconnectTimer();
    reconnectAttempts = 0;
    setUI(true);
    status.textContent = radioText("Reproduciendo en vivo.", "Playing live.");
  });

  audio.addEventListener("pause", () => {
    if (!userWantsRadio && !audio.ended) {
      status.textContent = radioText("Pausado.", "Paused.");
    }
  });

  audio.addEventListener("stalled", () => {
    scheduleReconnect("La senal se detuvo.");
  });

  audio.addEventListener("ended", () => {
    scheduleReconnect("La transmision finalizo.");
  });

  audio.addEventListener("error", () => {
    scheduleReconnect("Error en la transmision.");
  });

  window.addEventListener("online", async () => {
    if (!userWantsRadio || !audio.paused) return;

    reconnectAttempts = 0;
    try {
      await startRadio();
    } catch (error) {
      scheduleReconnect("Volvio internet, pero aun no conecta la radio.");
    }
  });

  window.addEventListener("offline", () => {
    if (userWantsRadio) {
      clearReconnectTimer();
      setUI(false);
      status.textContent = radioText("Sin internet. La radio se reconectara al volver la conexion.", "No internet connection. The radio will reconnect when the connection returns.");
    }
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
  const departmentSelect = document.getElementById("filialDepartment");
  const circuitSelect = document.getElementById("filialCircuit");

  if (!input || !clear || !countEl || !emptyEl) return;

  let activeZone = "all";
  let activeCircuit = "all";
  let cards = [];
  let index = [];
  const language = window.iadsderI18n?.language?.() || "es";

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function zoneFor(text) {
    if (/chapeltique|san miguel|rio frio/.test(text)) return "san miguel";
    if (/gualococti|sesori|boquin|san nicolas|los fuentes|el tablon/.test(text)) return "morazan";
    if (/sensuntepeque|san juan/.test(text)) return "cabanas";
    if (/cojutepeque/.test(text)) return "cuscatlan";
    if (/zapotitan|apancino|apulo|los guzman/.test(text)) return "la libertad";
    return "";
  }

  function buildIndex() {
    cards = Array.from(document.querySelectorAll("article.filial-card"));
    cards.forEach(card => card.classList.remove("is-hidden"));
    index = cards.map(card => {
      const text = normalize(card.innerText || card.textContent || "");
      return {
        card,
        text,
        zone: normalize(card.dataset.zone || "") || zoneFor(text),
        circuit: String(card.dataset.circuit || "")
      };
    });
  }

  function updateUI(visible) {
    countEl.textContent = language === "en"
      ? `Showing ${visible} of ${cards.length} churches.`
      : `Mostrando ${visible} de ${cards.length} filiales.`;
    emptyEl.style.display = visible === 0 ? "block" : "none";
  }

  function applyFilter(value) {
    const q = normalize(value).trim();
    let visible = 0;

    index.forEach(({ card, text, zone, circuit }) => {
      const matchText = q === "" || text.includes(q);
      const matchZone = activeZone === "all" || zone === activeZone || text.includes(activeZone);
      const matchCircuit = activeCircuit === "all"
        || (activeCircuit === "unassigned" ? !circuit : circuit === activeCircuit);
      const match = matchText && matchZone && matchCircuit;
      card.classList.toggle("is-hidden", !match);
      if (match) visible++;
    });

    updateUI(visible);
  }

  buildIndex();

  if (!cards.length) {
    countEl.textContent = language === "en"
      ? "No churches were found on this page."
      : "No se encontraron filiales en esta pagina.";
    return;
  }

  applyFilter("");

  window.__refreshFilialSearch = () => {
    buildIndex();
    applyFilter(input.value);
  };

  input.addEventListener("input", () => applyFilter(input.value));

  clear.addEventListener("click", () => {
    input.value = "";
    activeZone = "all";
    activeCircuit = "all";
    if (departmentSelect) departmentSelect.value = "all";
    if (circuitSelect) circuitSelect.value = "all";
    input.focus();
    applyFilter("");
  });

  departmentSelect?.addEventListener("change", () => {
    activeZone = departmentSelect.value || "all";
    applyFilter(input.value);
  });

  circuitSelect?.addEventListener("change", () => {
    activeCircuit = circuitSelect.value || "all";
    applyFilter(input.value);
  });
});

// ============================================================
// 15.5 FILIALES DESDE ADMIN
// ============================================================
(function loadAdminFiliales() {
  const grid = document.querySelector(".filial-grid");
  if (!grid) return;
  const t = window.iadsderI18n?.t || (value => value);

  function assetPath(path) {
    const value = String(path || "").trim();
    if (!value) return "/.netlify/images?url=/img/Logo_IADSDER.png&w=760&q=78";
    if (/^(https?:)?\/\//.test(value) || value.startsWith("/.netlify/images")) return value;
    const localPath = value.startsWith("/") ? value : `/${value}`;
    if (/\.svg(?:\?|$)/i.test(localPath)) return localPath;
    return `/.netlify/images?url=${encodeURIComponent(localPath)}&w=760&q=78`;
  }

  function fallbackMap(item) {
    const query = [item.name, item.address].filter(Boolean).join(", ");
    return `https://www.google.com/maps?q=${encodeURIComponent(query || "El Salvador")}&output=embed`;
  }

  function embedMapUrl(value, item) {
    const savedValue = String(value || "").trim();
    if (!savedValue) return fallbackMap(item);

    // El administrador acepta tanto el URL como el iframe completo de Google Maps.
    const iframeSource = savedValue.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
    return iframeSource ? iframeSource[1] : savedValue;
  }

  function bindMapButton(card) {
    const btn = card.querySelector(".toggle-map");
    const map = card.querySelector(".filial-map");
    if (!btn || !map) return;

    btn.addEventListener("click", () => {
      const hidden = map.hasAttribute("hidden");
      if (hidden) {
        map.removeAttribute("hidden");
        btn.textContent = t("Ocultar ubicación");
        btn.setAttribute("aria-expanded", "true");
      } else {
        map.setAttribute("hidden", "");
        btn.textContent = t("Ver ubicación");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  function renderFilial(item) {
    const name = item.name || "Iglesia filial";
    const address = item.address || "Direccion por confirmar";
    const mapsUrl = item.mapsUrl || "#";
    const embedUrl = embedMapUrl(item.embedUrl, item);
    const image = assetPath(item.image);
    const zone = item.zone || "";
    const circuit = item.circuit ? `<p class="muted">${t("Circuito")} ${item.circuit}</p>` : "";
    const contact = item.contact ? `<p class="muted">${t("Encargado/contacto")}: ${item.contact}</p>` : "";
    const schedule = item.schedule ? `<p class="muted">${t("Horario")}: ${item.schedule}</p>` : "";

    const card = document.createElement("article");
    card.className = "card filial-card";
    card.dataset.zone = zone;
    card.dataset.circuit = item.circuit || "";
    card.innerHTML = `
      <button class="filial-item" type="button">
        <img src="${image}" alt="${name}" loading="lazy">
      </button>
      <h3>${name}</h3>
      <p class="muted">${t("Dirección")}: ${address}</p>
      ${circuit}
      ${contact}
      ${schedule}
      <div class="filial-actions">
        <button class="btn btn-primary toggle-map" type="button" aria-expanded="false">${t("Ver ubicación")}</button>
        <a class="btn btn-ghost" target="_blank" rel="noopener" href="${mapsUrl}">${t("Abrir en Google Maps")}</a>
      </div>
      <div class="filial-map" hidden>
        <iframe
          title="Mapa ${name}"
          src="${embedUrl}"
          width="100%" height="300" style="border:0;"
          allowfullscreen loading="lazy"
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>
    `;

    bindMapButton(card);
    return card;
  }

  fetch("/data/filiales.json")
    .then(res => res.ok ? res.json() : Promise.reject(new Error("Sin filiales.json")))
    .then(data => {
      const items = Array.isArray(data) ? data : data.filiales;
      if (!Array.isArray(items) || !items.length) return;

      const publishedItems = items.filter(isPublished);
      grid.replaceChildren(...publishedItems.map(renderFilial));

      window.__refreshFilialSearch?.();
    })
    .catch(() => {});
})();

// ============================================================
// 16. CARGAR GALERIA
// ============================================================
(async function galleryLoader() {
  const track = document.getElementById("galleryTrack");
  const loading = document.getElementById("galleryLoading");
  const counter = document.getElementById("galleryCounter");
  if (!track) return;
  const language = window.iadsderI18n?.language?.() || "es";

  function optimizedGalleryImage(path) {
    const value = String(path || "");
    if (!value.startsWith("/") || value.startsWith("/.netlify/images") || /\.svg(?:\?|$)/i.test(value)) return value;
    return `/.netlify/images?url=${encodeURIComponent(value)}&w=900&q=76`;
  }

  function renderImages(images) {
    if (counter) {
      counter.textContent = language === "en"
        ? `${images.length} ${images.length === 1 ? "photo" : "photos"}`
        : `${images.length} ${images.length === 1 ? "fotografía" : "fotografías"}`;
    }

    if (!images.length) {
      if (loading) loading.textContent = language === "en"
        ? "There are no published photos yet."
        : "Todavía no hay fotografías publicadas.";
      return;
    }

    track.innerHTML = "";

    images.forEach(img => {
      const btn = document.createElement("button");
      btn.className = "gallery-item";
      btn.type = "button";
      btn.setAttribute("aria-label", language === "en" ? "Open youth event photo" : "Abrir fotografía de evento juvenil");

      const im = document.createElement("img");
      im.src = optimizedGalleryImage(img.image);
      im.alt = img.alt || "Foto";
      im.loading = "lazy";
      im.decoding = "async";

      btn.appendChild(im);
      track.appendChild(btn);
    });
  }

  try {
    const response = await fetch("/data/galeria.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`Galería no disponible (${response.status})`);
    const data = await response.json();
    const galleryItems = Array.isArray(data) ? data : data.imagenes;
    function normalizeGalleryItem(item) {
      if (typeof item === "string") return [{ image: item, alt: "Fotografía de evento juvenil" }];
      if (Array.isArray(item)) return item.flatMap(normalizeGalleryItem);
      if (!item || typeof item !== "object") return [];

      const sources = Array.isArray(item.image) ? item.image : [item.image];
      return sources.flatMap(source => {
        if (Array.isArray(source)) return source.flatMap(normalizeGalleryItem);
        return source ? [{ ...item, image: source }] : [];
      });
    }

    const normalizedItems = Array.isArray(galleryItems)
      ? galleryItems.flatMap(normalizeGalleryItem)
      : [];
    renderImages(normalizedItems.filter(isPublished));
  } catch (e) {
    console.error(e);
    if (loading) loading.textContent = language === "en"
      ? "The photos could not be loaded. Please try again."
      : "No se pudieron cargar las fotografías. Intenta nuevamente.";
    if (counter) counter.textContent = "Galería no disponible";
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
// 18. LIGHTBOX GALERIA GENERAL + FILIALES
// ============================================================
(function galleryLightbox() {
  const modal = document.getElementById("imgModal");
  const view = document.getElementById("imgModalView");
  const prevBtn = document.getElementById("imgPrev");
  const nextBtn = document.getElementById("imgNext");
  const counterEl = document.getElementById("imgModalCounter");
  const shareBtn = document.getElementById("imgModalShare");
  const backdrop = modal?.querySelector(".img-modal__backdrop");

  if (!modal || !view || !prevBtn || !nextBtn || !backdrop) return;

  let images = [];
  let currentIndex = 0;

  let touchStartX = 0;
  let touchEndX = 0;
  const minSwipeDistance = 50;

  // ABRIR GALERIA
  function normalizeImage(item, fallbackAlt = "Imagen") {
    return typeof item === "string"
      ? { src: item, alt: fallbackAlt, caption: fallbackAlt, date: "" }
      : item;
  }

  function updateModalImage() {
    const item = images[currentIndex];
    if (!item) return;
    view.src = item.src;
    view.alt = item.alt || item.caption || "Imagen";
    if (counterEl) counterEl.textContent = `${currentIndex + 1} de ${images.length}`;
  }

  function openGallery(galleryImages, startIndex = 0, alt = "Imagen") {
    images = galleryImages.map(item => normalizeImage(item, alt));
    currentIndex = startIndex;

    if (!images.length) return;

    updateModalImage();

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Mostrar flechas solo si hay varias imagenes
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
    updateModalImage();
  }

  // ANTERIOR
  function showPrev() {
    if (!images.length) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateModalImage();
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

    // ===== GALERIA PRINCIPAL =====
    const galleryBtn = e.target.closest(".gallery-item");
    if (galleryBtn) {
      const galleryImgs = Array.from(document.querySelectorAll(".gallery-item img"));
      const clickedImg = galleryBtn.querySelector("img");

      if (!clickedImg || !galleryImgs.length) return;

      const urls = galleryImgs.map(img => {
        return {
          src: img.src,
          alt: img.alt,
          caption: "Fotografía de evento juvenil",
          date: ""
        };
      });
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

  shareBtn?.addEventListener("click", async (e) => {
    e.stopPropagation();
    const item = images[currentIndex];
    if (!item) return;

    const shareData = {
      title: item.caption || "Fotografía IADSDER",
      text: `${item.caption || "Fotografía de IADSDER"} — iadsder.org`,
      url: item.src
    };

    try {
      const response = await fetch(item.src);
      const blob = response.ok ? await response.blob() : null;
      const extension = blob?.type === "image/png" ? "png" : "jpg";
      const file = blob ? new File([blob], `iadsder-foto-${currentIndex + 1}.${extension}`, { type: blob.type || "image/jpeg" }) : null;

      if (file && navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: shareData.title, text: shareData.text, files: [file] });
      } else if (navigator.share) {
        await navigator.share(shareData);
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareData.text}\n${shareData.url}`)}`, "_blank", "noopener");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareData.text}\n${shareData.url}`)}`, "_blank", "noopener");
      }
    }
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
