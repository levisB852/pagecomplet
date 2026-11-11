(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", callback, { once: true });
    else callback();
  }

  ready(function () {
    var dock = document.getElementById("adminDock");
    var connection = document.getElementById("adminConnection");
    var connectionText = document.getElementById("adminConnectionText");
    var help = document.getElementById("adminHelp");
    var helpToggle = document.getElementById("adminHelpToggle");
    var helpClose = document.getElementById("adminHelpClose");
    var overview = document.getElementById("adminOverview");
    var overviewToggle = document.getElementById("adminOverviewToggle");
    var overviewClose = document.getElementById("adminOverviewClose");

    function setOverview(open) {
      if (!overview) return;
      overview.hidden = !open;
      document.body.classList.toggle("admin-overview-open", open);
      if (open) loadOverview();
    }

    async function loadOverview() {
      function set(id, value) { var element = document.getElementById(id); if (element) element.textContent = value; }
      Promise.allSettled([
        fetch("/data/filiales.json", { cache: "no-store" }).then(function (r) { return r.json(); }),
        fetch("/data/galeria.json", { cache: "no-store" }).then(function (r) { return r.json(); }),
        fetch("/data/versiculo.json", { cache: "no-store" }).then(function (r) { return r.json(); })
      ]).then(function (values) {
        var filialData = values[0].status === "fulfilled" ? values[0].value : null;
        var galleryData = values[1].status === "fulfilled" ? values[1].value : null;
        var verseData = values[2].status === "fulfilled" ? values[2].value : null;
        var filiales = Array.isArray(filialData) ? filialData : filialData && filialData.filiales;
        var photos = Array.isArray(galleryData) ? galleryData : galleryData && (galleryData.imagenes || galleryData.images || galleryData.galeria);
        set("overviewFiliales", Array.isArray(filiales) ? filiales.length : "—");
        set("overviewPhotos", Array.isArray(photos) ? photos.filter(function (item) { return item && item.published !== false; }).length : "—");
        set("overviewVerse", verseData && verseData.published !== false ? "Activo" : "Oculto");
      });

      var user = window.netlifyIdentity && window.netlifyIdentity.currentUser();
      if (!user) return;
      try {
        var token = await user.jwt();
        var response = await fetch("/api/comments-admin?fresh=" + Date.now(), { cache: "no-store", headers: { Authorization: "Bearer " + token } });
        var data = await response.json();
        if (response.ok && Array.isArray(data.comments)) set("overviewComments", data.comments.filter(function (item) { return item.status === "pending"; }).length);
      } catch (_) {}
    }
    window.__loadAdminOverview = loadOverview;

    function setConnectionState() {
      var online = navigator.onLine;
      if (!connection || !connectionText) return;
      connection.classList.toggle("is-offline", !online);
      connectionText.textContent = online ? "En línea" : "Sin conexión";
    }

    function setHelp(open) {
      if (!help || !helpToggle) return;
      help.hidden = !open;
      helpToggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("admin-help-open", open);
      if (open) helpClose?.focus();
    }

    function markCurrentRoute() {
      if (!dock) return;
      var onDashboard = !location.hash || location.hash === "#/";
      dock.querySelectorAll("a,button").forEach(function (item) {
        item.classList.remove("is-current");
        item.removeAttribute("aria-current");
      });
      if (onDashboard) {
        var home = dock.querySelector('[data-admin-route="home"]');
        home?.classList.add("is-current");
        home?.setAttribute("aria-current", "page");
      }
    }

    helpToggle?.addEventListener("click", function () {
      setHelp(help?.hidden !== false);
    });
    helpClose?.addEventListener("click", function () { setHelp(false); });
    overviewToggle?.addEventListener("click", function () { setOverview(true); });
    overviewClose?.addEventListener("click", function () { setOverview(false); });
    overview?.querySelectorAll("[data-overview-route]").forEach(function (link) {
      link.addEventListener("click", function () { setOverview(false); });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && help?.hidden === false) setHelp(false);
    });
    window.addEventListener("online", setConnectionState);
    window.addEventListener("offline", setConnectionState);
    window.addEventListener("hashchange", markCurrentRoute);

    setConnectionState();
    markCurrentRoute();
    if (overview?.hidden === false) loadOverview();
    if (window.netlifyIdentity) {
      window.netlifyIdentity.on("init", function () { if (overview?.hidden === false) loadOverview(); });
      window.netlifyIdentity.on("login", function () { if (overview?.hidden === false) loadOverview(); });
    }
  });
})();
