(function () {
  "use strict";

  const form = document.getElementById("uploadForm");
  const input = document.getElementById("photos");
  const preview = document.getElementById("preview");
  const selection = document.getElementById("selection");
  const submit = document.getElementById("uploadButton");
  const loginPanel = document.getElementById("loginPanel");
  const progressPanel = document.getElementById("progressPanel");
  const progress = document.getElementById("progress");
  const status = document.getElementById("status");
  const counter = document.getElementById("counter");
  const result = document.getElementById("result");
  let selectedFiles = [];

  function showAuthenticated(user) {
    form.hidden = !user;
    loginPanel.hidden = Boolean(user);
  }

  function safeName(name, index) {
    const extension = (name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const base = name.replace(/\.[^.]+$/, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 45) || "foto";
    return `${Date.now()}-${index + 1}-${base}.${extension}`;
  }

  function readBase64(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () { resolve(String(reader.result).split(",")[1]); };
      reader.onerror = function () { reject(new Error(`No se pudo leer ${file.name}`)); };
      reader.readAsDataURL(file);
    });
  }

  async function gateway(path, options, token) {
    const response = await fetch(`/.netlify/git/github/contents/${path}`, {
      ...options,
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", ...(options.headers || {}) }
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Error ${response.status}: ${detail.slice(0, 180)}`);
    }
    return response.json();
  }

  input.addEventListener("change", function () {
    selectedFiles = Array.from(input.files || []);
    selection.textContent = selectedFiles.length ? `${selectedFiles.length} ${selectedFiles.length === 1 ? "foto seleccionada" : "fotos seleccionadas"}` : "Ninguna foto seleccionada";
    submit.disabled = !selectedFiles.length;
    preview.replaceChildren();
    selectedFiles.slice(0, 24).forEach(function (file) {
      const image = document.createElement("img");
      image.alt = file.name;
      image.src = URL.createObjectURL(file);
      image.onload = function () { URL.revokeObjectURL(image.src); };
      preview.appendChild(image);
    });
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!selectedFiles.length) return;
    const user = window.netlifyIdentity && window.netlifyIdentity.currentUser();
    if (!user) { showAuthenticated(null); return; }

    submit.disabled = true;
    input.disabled = true;
    progressPanel.hidden = false;
    result.hidden = true;

    try {
      const token = await user.jwt();
      status.textContent = "Leyendo galería…";
      const galleryFile = await gateway("data/galeria.json?ref=main", { method: "GET", headers: { "Accept": "application/vnd.github+json" } }, token);
      const current = JSON.parse(atob(String(galleryFile.content).replace(/\s/g, "")));
      const images = Array.isArray(current.imagenes) ? current.imagenes.slice() : [];
      const uploaded = [];

      for (let index = 0; index < selectedFiles.length; index += 1) {
        const file = selectedFiles[index];
        const filename = safeName(file.name, index);
        const repoPath = `img/galeria/uploads/${filename}`;
        status.textContent = `Subiendo ${file.name}`;
        counter.textContent = `${index + 1} / ${selectedFiles.length}`;
        progress.value = Math.round((index / (selectedFiles.length + 1)) * 100);
        const content = await readBase64(file);
        await gateway(repoPath, { method: "PUT", body: JSON.stringify({ message: `Agregar foto ${filename}`, content: content, branch: "main" }) }, token);
        uploaded.push(`/${repoPath}`);
      }

      status.textContent = "Publicando galería…";
      images.unshift(...uploaded);
      const json = JSON.stringify({ ...current, imagenes: images }, null, 2) + "\n";
      const encoded = btoa(unescape(encodeURIComponent(json)));
      await gateway("data/galeria.json", { method: "PUT", body: JSON.stringify({ message: `Agregar ${uploaded.length} fotos a la galería`, content: encoded, sha: galleryFile.sha, branch: "main" }) }, token);

      progress.value = 100;
      status.textContent = "¡Listo!";
      counter.textContent = `${uploaded.length} subidas`;
      result.className = "bulk__result bulk__result--success";
      result.innerHTML = `<strong>Se agregaron ${uploaded.length} fotos.</strong><br>Netlify las mostrará en la página cuando termine de publicar.`;
      result.hidden = false;
      selectedFiles = [];
      input.value = "";
      preview.replaceChildren();
      selection.textContent = "Ninguna foto seleccionada";
    } catch (error) {
      result.className = "bulk__result bulk__result--error";
      result.textContent = `No se completó la carga. ${error.message}`;
      result.hidden = false;
    } finally {
      input.disabled = false;
      submit.disabled = !selectedFiles.length;
    }
  });

  document.getElementById("loginButton").addEventListener("click", function () { window.netlifyIdentity.open("login"); });
  window.netlifyIdentity.on("init", showAuthenticated);
  window.netlifyIdentity.on("login", function (user) { showAuthenticated(user); window.netlifyIdentity.close(); });
  window.netlifyIdentity.on("logout", function () { showAuthenticated(null); });
  window.netlifyIdentity.init();
})();
