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
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && help?.hidden === false) setHelp(false);
    });
    window.addEventListener("online", setConnectionState);
    window.addEventListener("offline", setConnectionState);
    window.addEventListener("hashchange", markCurrentRoute);

    setConnectionState();
    markCurrentRoute();
  });
})();
