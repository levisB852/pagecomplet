(function registerPwa() {
  // Elimina preferencias del panel de accesibilidad retirado.
  localStorage.removeItem("access-font");
  localStorage.removeItem("access-options");

  function updateConnectionNotice() {
    document.getElementById("offlineNotice")?.remove();
    if (navigator.onLine || !document.body) return;

    const english = localStorage.getItem("iadsder-language") === "en";
    const notice = document.createElement("div");
    notice.id = "offlineNotice";
    notice.textContent = english
      ? "Offline · showing saved content"
      : "Sin conexión · usando contenido guardado";
    notice.style.cssText = "position:fixed;top:0;left:50%;z-index:9999;transform:translateX(-50%);padding:7px 14px;border-radius:0 0 12px 12px;background:#8a5a00;color:#fff;font:700 .82rem system-ui";
    document.body.appendChild(notice);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateConnectionNotice);
  } else {
    updateConnectionNotice();
  }
  window.addEventListener("online", updateConnectionNotice);
  window.addEventListener("offline", updateConnectionNotice);

  // Chrome y otros navegadores mostrarán su opción nativa de instalación.
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/service-worker.js").catch(function (error) {
      console.warn("No se pudo activar el modo offline:", error);
    });
  });
})();
