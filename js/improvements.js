(function () {
  "use strict";

  const absolute = path => new URL(path, window.location.origin).href;
  const clean = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  async function shareContent(data) {
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText([data.title, data.text, data.url].filter(Boolean).join("\n"));
      window.alert("Enlace copiado para compartir.");
    } catch (error) {
      if (error?.name !== "AbortError") window.alert("No se pudo compartir en este momento.");
    }
  }

  document.getElementById("shareVerse")?.addEventListener("click", () => {
    const text = document.getElementById("verseText")?.textContent?.trim();
    const reference = document.getElementById("verseReference")?.textContent?.trim();
    shareContent({
      title: `Reflexión semanal — ${reference || "IADSDER"}`,
      text: `“${text || ""}” — ${reference || ""}`,
      url: absolute("/#versiculo")
    });
  });

  document.getElementById("shareRadio")?.addEventListener("click", () => shareContent({
    title: "Radio IADSDER en vivo",
    text: "Escucha la programación cristiana de Radio Adventista de Dios en Reforma.",
    url: absolute("/#radio")
  }));

  function addFilialShareButtons(root = document) {
    root.querySelectorAll(".filial-card:not([data-share-ready])").forEach(card => {
      card.dataset.shareReady = "true";
      const actions = card.querySelector(".filial-actions");
      const title = card.querySelector("h3")?.textContent?.trim() || "Filial IADSDER";
      const address = card.querySelector("p")?.textContent?.trim() || "";
      if (!actions) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-ghost filial-share";
      button.textContent = "Compartir";
      button.addEventListener("click", () => shareContent({
        title,
        text: `${title}. ${address}`,
        url: `${absolute("/archivos/filiales.html")}?q=${encodeURIComponent(title)}`
      }));
      actions.append(button);
    });
  }

  addFilialShareButtons();
  const filialGrid = document.querySelector(".filial-grid");
  if (filialGrid) new MutationObserver(() => addFilialShareButtons(filialGrid)).observe(filialGrid, { childList: true });

  const audio = document.getElementById("radioAudio");
  const mini = document.getElementById("radioMini");
  const miniToggle = document.getElementById("radioMiniToggle");
  const mainToggle = document.getElementById("radioToggle");
  if (audio && mini && miniToggle && mainToggle) {
    const syncMini = () => {
      const playing = !audio.paused && !audio.ended;
      mini.hidden = !playing;
      miniToggle.textContent = playing ? "❚❚" : "▶";
      miniToggle.setAttribute("aria-label", playing ? "Pausar radio" : "Reproducir radio");
    };
    audio.addEventListener("playing", syncMini);
    audio.addEventListener("pause", syncMini);
    audio.addEventListener("ended", syncMini);
    miniToggle.addEventListener("click", () => mainToggle.click());

    const savedVolume = Number(localStorage.getItem("iadsderRadioVolume"));
    const volume = document.getElementById("radioVol");
    if (volume && Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 1) {
      volume.value = String(savedVolume);
      audio.volume = savedVolume;
    }
    volume?.addEventListener("input", () => localStorage.setItem("iadsderRadioVolume", volume.value));

    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: "Radio IADSDER en vivo",
        artist: "Iglesia Adventista de Dios en Reforma",
        album: "Programación cristiana",
        artwork: [{ src: absolute("/img/pwa-512.png"), sizes: "512x512", type: "image/png" }]
      });
      navigator.mediaSession.setActionHandler("play", () => mainToggle.click());
      navigator.mediaSession.setActionHandler("pause", () => mainToggle.click());
    }
  }

  (function loadNews() {
    const section = document.getElementById("novedades");
    const container = document.getElementById("newsGrid");
    if (!section || !container) return;

    function validUrl(value) {
      try {
        const url = new URL(String(value || "").trim());
        return ["http:", "https:"].includes(url.protocol) ? url.href : "";
      } catch (_) { return ""; }
    }

    fetch("/data/novedades.json", { cache: "no-store" })
      .then(response => response.ok ? response.json() : Promise.reject(new Error("news unavailable")))
      .then(data => {
        const items = (Array.isArray(data) ? data : data.novedades || [])
          .filter(item => item && item.published !== false)
          .filter(item => item.title && item.summary);
        if (!items.length) return;

        const fragment = document.createDocumentFragment();
        items.forEach(item => {
          const article = document.createElement("article");
          article.className = "news-card";

          const image = validUrl(item.image);
          if (image) {
            const media = document.createElement("div");
            media.className = "news-card__media";
            const img = document.createElement("img");
            img.src = image;
            img.alt = item.title;
            img.loading = "lazy";
            img.decoding = "async";
            media.append(img);
            article.append(media);
          }

          const body = document.createElement("div");
          body.className = "news-card__body";
          const meta = document.createElement("div");
          meta.className = "news-card__meta";
          const category = document.createElement("span");
          category.textContent = item.category || "Novedad";
          meta.append(category);
          if (item.date) {
            const date = document.createElement("time");
            date.dateTime = item.date;
            date.textContent = new Intl.DateTimeFormat("es-SV", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${item.date}T12:00:00`));
            meta.append(date);
          }
          const title = document.createElement("h3");
          title.textContent = item.title;
          const summary = document.createElement("p");
          summary.textContent = item.summary;
          body.append(meta, title, summary);
          const link = validUrl(item.url);
          if (link) {
            const open = document.createElement("a");
            open.className = "news-card__link";
            open.href = link;
            open.target = "_blank";
            open.rel = "noopener";
            open.textContent = "Ver más →";
            body.append(open);
          }
          article.append(body);
          fragment.append(article);
        });
        container.append(fragment);
        section.hidden = false;
      })
      .catch(() => {});
  })();

  const launch = document.getElementById("siteSearchLaunch");
  const dialog = document.getElementById("siteSearchDialog");
  const input = document.getElementById("siteSearchInput");
  const results = document.getElementById("siteSearchResults");
  const hint = document.getElementById("siteSearchHint");
  if (!launch || !dialog || !input || !results || !hint) return;

  const baseItems = [
    ["Himnario digital", "Busca por número, título o letra de un himno", "/himnario/inicio.html", "himnos alabanzas letras música"],
    ["Radio en vivo", "Escucha nuestra programación cristiana", "/#radio", "radio audio transmisión"],
    ["Filiales", "Iglesias, direcciones, circuitos y mapas", "/archivos/filiales.html", "iglesias departamentos mapas"],
    ["Videos", "Mensajes y contenido audiovisual", "/#videos", "videos predicas mensajes"],
    ["Eventos y galería", "Fotografías de actividades de la iglesia", "/#galeria", "fotos eventos galeria"],
    ["Estatutos", "Principios organizativos y normativos", "/archivos/estatutos.html", "documentos doctrina"],
    ["Manual doctrinal", "Orientación y enseñanza de la iglesia", "/archivos/manual.html", "manual doctrina documentos"],
    ["Plan maravilloso", "El plan de Dios para la humanidad", "/archivos/plan-maravilloso.html", "plan estudio recurso"],
    ["Comentarios", "Mensajes de nuestra comunidad", "/#comentarios", "comentarios comunidad"],
    ["Contacto", "Escríbenos o encuentra cómo visitarnos", "/#contacto", "contacto mensaje"],
  ].map(([title, description, url, keywords]) => ({ title, description, url, keywords, type: "Sección" }));
  let searchItems = [...baseItems];

  Promise.allSettled([
    fetch("/data/filiales.json").then(r => r.ok ? r.json() : null),
    fetch("/himnario/js/himnos_seccion_1.json").then(r => r.ok ? r.json() : null)
  ]).then(([filialesResult, hymnsResult]) => {
    const filialData = filialesResult.status === "fulfilled" ? filialesResult.value : null;
    const filiales = Array.isArray(filialData) ? filialData : filialData?.filiales;
    if (Array.isArray(filiales)) searchItems.push(...filiales.filter(item => item && item.published !== false).map(item => ({
      title: item.name || "Filial IADSDER",
      description: [item.address, item.zone, item.circuit ? `Circuito ${item.circuit}` : ""].filter(Boolean).join(" · "),
      url: `/archivos/filiales.html?q=${encodeURIComponent(item.name || "")}`,
      keywords: [item.address, item.zone, item.contact, item.schedule].filter(Boolean).join(" "),
      type: "Filial"
    })));
    const hymns = hymnsResult.status === "fulfilled" ? hymnsResult.value : null;
    if (Array.isArray(hymns)) searchItems.push(...hymns.map(item => ({
      title: `${item.number} — ${item.title}`,
      description: "Abrir letra del himno",
      url: `/himnario/himnos/${item.number}/`,
      keywords: `${item.number} ${item.title}`,
      type: "Himno"
    })));
  });

  function render(query) {
    const q = clean(query).trim();
    results.replaceChildren();
    if (!q) {
      hint.textContent = "Escribe para buscar en toda la página.";
      return;
    }
    const matches = searchItems.filter(item => clean(`${item.title} ${item.description} ${item.keywords}`).includes(q)).slice(0, 12);
    hint.textContent = matches.length ? `${matches.length} resultado${matches.length === 1 ? "" : "s"}` : "No encontramos resultados. Prueba con otra palabra.";
    matches.forEach(item => {
      const link = document.createElement("a");
      link.href = item.url;
      link.className = "site-search__result";
      const badge = document.createElement("span");
      badge.textContent = item.type;
      const body = document.createElement("div");
      const title = document.createElement("b");
      title.textContent = item.title;
      const description = document.createElement("small");
      description.textContent = item.description;
      body.append(title, description);
      link.append(badge, body);
      results.append(link);
    });
  }

  function setSearch(open) {
    dialog.hidden = !open;
    dialog.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("search-open", open);
    if (open) window.setTimeout(() => input.focus(), 30);
    else launch.focus({ preventScroll: true });
  }
  launch.addEventListener("click", () => setSearch(true));
  dialog.querySelectorAll("[data-search-close]").forEach(button => button.addEventListener("click", () => setSearch(false)));
  input.addEventListener("input", () => render(input.value));
  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearch(true); }
    if (event.key === "Escape" && !dialog.hidden) setSearch(false);
  });
})();
