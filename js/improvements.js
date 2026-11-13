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

  (function loadFacebookPosts() {
    const section = document.getElementById("facebook");
    const container = document.getElementById("facebookPosts");
    const pageLink = document.getElementById("facebookPageLink");
    if (!section || !container) return;

    function validFacebookUrl(value) {
      try {
        const url = new URL(String(value || "").trim());
        const host = url.hostname.toLowerCase();
        return (host === "facebook.com" || host.endsWith(".facebook.com")) ? url.href : "";
      } catch (_) { return ""; }
    }

    fetch("/data/facebook.json", { cache: "no-store" })
      .then(response => response.ok ? response.json() : Promise.reject(new Error("facebook unavailable")))
      .then(data => {
        const items = (Array.isArray(data) ? data : data.publicaciones || [])
          .filter(item => item && item.published !== false)
          .map(item => ({ ...item, url: validFacebookUrl(item.url) }))
          .filter(item => item.url);
        if (!items.length) return;

        const configuredPage = validFacebookUrl(data.pageUrl);
        if (pageLink && configuredPage) pageLink.href = configuredPage;
        else if (pageLink) pageLink.hidden = true;

        const fragment = document.createDocumentFragment();
        items.forEach(item => {
          const article = document.createElement("article");
          article.className = "facebook-post-card";

          const heading = document.createElement("div");
          heading.className = "facebook-post-card__head";
          const title = document.createElement("h3");
          title.textContent = item.title || "Publicación de Facebook";
          const open = document.createElement("a");
          open.href = item.url;
          open.target = "_blank";
          open.rel = "noopener";
          open.textContent = "Abrir en Facebook";
          heading.append(title, open);

          const frameWrap = document.createElement("div");
          frameWrap.className = "facebook-post-card__embed";
          const frame = document.createElement("iframe");
          frame.title = item.title || "Publicación de Facebook";
          const itemPath = new URL(item.url).pathname.toLowerCase();
          const isVideo = itemPath.includes("/reel/") || itemPath.includes("/videos/") || itemPath.includes("/watch/");
          const plugin = isVideo ? "video.php" : "post.php";
          frame.src = `https://www.facebook.com/plugins/${plugin}?href=${encodeURIComponent(item.url)}&show_text=true&width=500`;
          frame.width = "500";
          frame.height = String(Number(item.height) || 680);
          frame.loading = "lazy";
          frame.allow = "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share";
          frame.allowFullscreen = true;
          frameWrap.append(frame);
          article.append(heading, frameWrap);
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
