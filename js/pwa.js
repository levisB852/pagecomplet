(function registerPwa() {
  const english = localStorage.getItem("iadsder-language") === "en";
  const text = (es, en) => english ? en : es;

  function addGlobalTools() {
    if (document.getElementById("siteTools")) return;

    const style = document.createElement("style");
    style.textContent = `
      .site-tools{position:fixed;left:max(12px,env(safe-area-inset-left));bottom:max(12px,env(safe-area-inset-bottom));z-index:8500;font-family:system-ui,sans-serif}
      .site-tools__toggle{width:43px;height:43px;border:1px solid #ffffff38;border-radius:50%;background:#174b35;color:#fff;box-shadow:0 7px 22px #0004;font-size:20px;cursor:pointer}
      .site-tools__panel{position:absolute;left:0;bottom:52px;width:min(286px,calc(100vw - 24px));padding:14px;border:1px solid #8fa99d55;border-radius:16px;background:#fff;color:#14251d;box-shadow:0 15px 40px #0004}
      .site-tools__panel[hidden]{display:none}.site-tools__panel h2{font-size:1rem;margin:0 0 10px}.site-tools__row{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}
      .site-tools__panel button{border:1px solid #174b3540;border-radius:10px;background:#edf7f1;color:#174b35;padding:8px 10px;font-weight:700;cursor:pointer}
      .site-tools__panel button:hover,.site-tools__panel button:focus-visible{background:#dcefe3;outline:2px solid #4e9f72}
      .site-tools__install{width:100%;margin-top:10px;background:#174b35!important;color:#fff!important}.site-tools__status{font-size:.78rem;margin:8px 0 0;color:#52645b}
      .offline-notice{position:fixed;top:0;left:50%;z-index:9999;transform:translateX(-50%);padding:7px 14px;border-radius:0 0 12px 12px;background:#8a5a00;color:#fff;font:700 .82rem system-ui}
      html.access-large{font-size:112.5%}html.access-larger{font-size:125%}
      html.access-contrast{filter:contrast(1.22)}html.access-links a{text-decoration:underline!important;text-underline-offset:3px}
      html.access-motion *,html.access-motion *::before,html.access-motion *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}
      @media(prefers-color-scheme:dark){.site-tools__panel{background:#13251d;color:#f3fff7}.site-tools__panel button{background:#1d392b;color:#effff5}.site-tools__status{color:#b9cfc2}}
    `;
    document.head.appendChild(style);

    const tools = document.createElement("div");
    tools.id = "siteTools";
    tools.className = "site-tools";
    tools.innerHTML = `
      <button class="site-tools__toggle" type="button" aria-expanded="false" aria-controls="siteToolsPanel" aria-label="${text("Opciones de accesibilidad", "Accessibility options")}">♿</button>
      <section class="site-tools__panel" id="siteToolsPanel" hidden>
        <h2>${text("Accesibilidad y aplicación", "Accessibility and app")}</h2>
        <div class="site-tools__row">
          <button type="button" data-access="font">${text("Texto", "Text")} A+</button>
          <button type="button" data-access="contrast">${text("Contraste", "Contrast")}</button>
          <button type="button" data-access="links">${text("Enlaces", "Links")}</button>
          <button type="button" data-access="motion">${text("Sin animación", "Reduce motion")}</button>
          <button type="button" data-access="reset">${text("Restablecer", "Reset")}</button>
        </div>
        <button class="site-tools__install" id="installSite" type="button">${text("Instalar aplicación", "Install app")}</button>
        <p class="site-tools__status" id="siteToolsStatus"></p>
      </section>`;
    document.body.appendChild(tools);

    const root = document.documentElement;
    const panel = tools.querySelector("#siteToolsPanel");
    const toggle = tools.querySelector(".site-tools__toggle");
    const status = tools.querySelector("#siteToolsStatus");
    let deferredInstall;
    let fontLevel = Number(localStorage.getItem("access-font") || 0);
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem("access-options") || "{}"); } catch { saved = {}; }

    function applyAccess() {
      root.classList.toggle("access-large", fontLevel === 1);
      root.classList.toggle("access-larger", fontLevel === 2);
      ["contrast", "links", "motion"].forEach(key => root.classList.toggle(`access-${key}`, Boolean(saved[key])));
      localStorage.setItem("access-font", fontLevel);
      localStorage.setItem("access-options", JSON.stringify(saved));
    }
    applyAccess();

    toggle.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
      toggle.setAttribute("aria-expanded", String(!panel.hidden));
    });
    panel.addEventListener("click", event => {
      const key = event.target.closest("[data-access]")?.dataset.access;
      if (!key) return;
      if (key === "font") fontLevel = (fontLevel + 1) % 3;
      else if (key === "reset") { fontLevel = 0; Object.keys(saved).forEach(item => delete saved[item]); }
      else saved[key] = !saved[key];
      applyAccess();
    });

    window.addEventListener("beforeinstallprompt", event => {
      event.preventDefault();
      deferredInstall = event;
    });
    tools.querySelector("#installSite").addEventListener("click", async () => {
      if (matchMedia("(display-mode: standalone)").matches || navigator.standalone) {
        status.textContent = text("La aplicación ya está instalada.", "The app is already installed.");
      } else if (deferredInstall) {
        deferredInstall.prompt();
        await deferredInstall.userChoice;
        deferredInstall = null;
      } else if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
        status.textContent = text("En Safari toca Compartir y luego ‘Agregar a inicio’.", "In Safari tap Share, then ‘Add to Home Screen’.");
      } else {
        status.textContent = text("Abre el menú del navegador y elige ‘Instalar aplicación’.", "Open the browser menu and choose ‘Install app’.");
      }
    });

    function updateConnection() {
      document.getElementById("offlineNotice")?.remove();
      if (navigator.onLine) return;
      const notice = document.createElement("div");
      notice.id = "offlineNotice";
      notice.className = "offline-notice";
      notice.textContent = text("Sin conexión · usando contenido guardado", "Offline · showing saved content");
      document.body.appendChild(notice);
    }
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);
    updateConnection();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addGlobalTools);
  else addGlobalTools();

  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/service-worker.js").catch(function (error) {
      console.warn("No se pudo activar el modo offline:", error);
    });
  });
})();
