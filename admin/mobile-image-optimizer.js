(function () {
  "use strict";

  var MAX_SIDE = 1400;
  var JPEG_QUALITY = 0.78;
  var MIN_SIZE_TO_OPTIMIZE = 350 * 1024;
  var redispatchedInputs = new WeakSet();
  var noticeTimer;

  function showNotice(message, kind) {
    var notice = document.getElementById("mobileImageOptimizerNotice");
    if (!notice) {
      notice = document.createElement("div");
      notice.id = "mobileImageOptimizerNotice";
      notice.setAttribute("role", "status");
      notice.setAttribute("aria-live", "polite");
      Object.assign(notice.style, {
        position: "fixed",
        left: "50%",
        bottom: "22px",
        zIndex: "100000",
        maxWidth: "calc(100% - 32px)",
        padding: "12px 16px",
        borderRadius: "12px",
        color: "#fff",
        font: "600 14px/1.4 system-ui, sans-serif",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,.28)",
        transform: "translateX(-50%)"
      });
      document.body.appendChild(notice);
    }

    notice.style.background = kind === "error" ? "#a52a2a" : "#174b35";
    notice.textContent = message;
    notice.hidden = false;
    window.clearTimeout(noticeTimer);
    noticeTimer = window.setTimeout(function () {
      notice.hidden = true;
    }, kind === "working" ? 120000 : 5000);
  }

  function loadImage(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var image = new Image();
      image.onload = function () {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error("No se pudo leer la imagen"));
      };
      image.src = url;
    });
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        if (blob) resolve(blob);
        else reject(new Error("No se pudo reducir la imagen"));
      }, type, quality);
    });
  }

  function safeFileName(name) {
    var base = name.replace(/\.[^.]+$/, "");
    return base + "-optimizada.jpg";
  }

  async function optimizeFile(file) {
    if (!file.type.startsWith("image/") || /svg|gif/i.test(file.type)) return file;
    if (file.size < MIN_SIZE_TO_OPTIMIZE) return file;

    var image = await loadImage(file);
    var scale = Math.min(1, MAX_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
    var width = Math.max(1, Math.round(image.naturalWidth * scale));
    var height = Math.max(1, Math.round(image.naturalHeight * scale));
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    var context = canvas.getContext("2d", { alpha: false });
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    var blob = await canvasToBlob(canvas, "image/jpeg", JPEG_QUALITY);
    if (blob.size >= file.size) return file;

    return new File([blob], safeFileName(file.name), {
      type: "image/jpeg",
      lastModified: Date.now()
    });
  }

  document.addEventListener("change", async function (event) {
    var input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== "file" || !input.files?.length) return;
    if (redispatchedInputs.has(input)) {
      redispatchedInputs.delete(input);
      return;
    }

    var files = Array.from(input.files);
    var candidates = files.filter(function (file) {
      return file.type.startsWith("image/") && file.size >= MIN_SIZE_TO_OPTIMIZE && !/svg|gif/i.test(file.type);
    });
    if (!candidates.length) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    showNotice(candidates.length === 1 ? "Preparando la fotografía…" : "Preparando las fotografías…", "working");

    try {
      var optimized = [];
      for (var index = 0; index < files.length; index += 1) {
        optimized.push(await optimizeFile(files[index]));
      }
      var transfer = new DataTransfer();
      optimized.forEach(function (file) { transfer.items.add(file); });
      input.files = transfer.files;
      redispatchedInputs.add(input);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      showNotice("Fotografía lista. Ya puedes guardar los cambios.", "success");
    } catch (error) {
      redispatchedInputs.add(input);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      showNotice("No se pudo reducir esta imagen; se intentará subir la original.", "error");
    }
  }, true);
})();
