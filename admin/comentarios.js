(function () {
  const list = document.getElementById("moderationList");
  const message = document.getElementById("moderationMessage");
  const pendingCount = document.getElementById("pendingCount");
  const approvedCount = document.getElementById("approvedCount");
  const rejectedCount = document.getElementById("rejectedCount");
  const updated = document.getElementById("moderationUpdated");
  const refreshButton = document.getElementById("refreshComments");
  const template = document.getElementById("commentCardTemplate");
  const filters = Array.from(document.querySelectorAll("[data-status]"));
  let comments = [];
  let activeStatus = "pending";
  let loading = false;

  function setMessage(value, isError) {
    message.textContent = value;
    message.classList.toggle("is-error", Boolean(isError));
  }
  function formatDate(value) {
    return new Intl.DateTimeFormat("es-SV", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  }
  function render() {
    const visible = comments.filter(item => item.status === activeStatus);
    pendingCount.textContent = comments.filter(item => item.status === "pending").length;
    approvedCount.textContent = comments.filter(item => item.status === "approved").length;
    rejectedCount.textContent = comments.filter(item => item.status === "rejected").length;
    list.replaceChildren();
    if (!visible.length) {
      const empty = document.createElement("p");
      empty.className = "moderation-empty";
      empty.textContent = activeStatus === "pending" ? "No hay comentarios pendientes." : "No hay comentarios en esta lista.";
      list.append(empty);
      return;
    }
    visible.forEach(item => {
      const card = template.content.firstElementChild.cloneNode(true);
      card.dataset.id = item.id;
      card.dataset.status = item.status;
      card.querySelector('[data-field="status"]').textContent = {
        pending: "Pendiente",
        approved: "Publicado",
        rejected: "Rechazado"
      }[item.status] || item.status;
      card.querySelector('[data-field="nombre"]').textContent = item.nombre;
      card.querySelector('[data-field="meta"]').textContent = item.filial || "Lugar no indicado";
      card.querySelector('[data-field="date"]').textContent = formatDate(item.created_at);
      card.querySelector('[data-field="comentario"]').textContent = item.comentario;
      if (item.status !== "pending") card.querySelector(".moderation-actions").hidden = true;
      list.append(card);
    });
  }
  async function authorizedFetch(url, options) {
    const user = window.netlifyIdentity && window.netlifyIdentity.currentUser();
    if (!user) throw new Error("AUTH");
    const token = await user.jwt();
    return fetch(url, { ...options, headers: { ...(options && options.headers), Authorization: `Bearer ${token}` } });
  }
  async function loadComments(options = {}) {
    if (loading) return;
    loading = true;
    refreshButton.disabled = true;
    refreshButton.classList.add("is-loading");
    if (!options.silent) setMessage("Cargando comentarios…");
    try {
      const response = await authorizedFetch("/api/comments-admin");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudieron cargar los comentarios.");
      comments = Array.isArray(data.comments) ? data.comments : [];
      setMessage("");
      updated.textContent = `Actualizado ${new Intl.DateTimeFormat("es-SV", { hour: "numeric", minute: "2-digit", second: "2-digit" }).format(new Date())}`;
      render();
    } catch (error) {
      if (error.message === "AUTH") {
        setMessage("Inicia sesión para moderar comentarios.", true);
        window.netlifyIdentity.open("login");
      } else setMessage(error.message, true);
    } finally {
      loading = false;
      refreshButton.disabled = false;
      refreshButton.classList.remove("is-loading");
    }
  }
  async function moderate(id, status, button) {
    button.disabled = true;
    setMessage(status === "approved" ? "Publicando comentario…" : "Rechazando comentario…");
    try {
      const response = await authorizedFetch("/api/comments-admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo guardar el cambio.");
      setMessage(status === "approved" ? "Comentario publicado sin hacer un despliegue." : "Comentario rechazado.");
      await loadComments({ silent: true });
    } catch (error) {
      button.disabled = false;
      setMessage(error.message, true);
    }
  }
  filters.forEach(button => button.addEventListener("click", () => {
    activeStatus = button.dataset.status;
    filters.forEach(item => item.classList.toggle("is-active", item === button));
    render();
  }));
  refreshButton.addEventListener("click", () => loadComments());
  list.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    const card = event.target.closest("[data-id]");
    if (button && card) moderate(card.dataset.id, button.dataset.action, button);
  });
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => user ? loadComments() : window.netlifyIdentity.open("login"));
    window.netlifyIdentity.on("login", () => { window.netlifyIdentity.close(); loadComments(); });
    window.netlifyIdentity.init();
  }

  // Mantiene el panel sincronizado sin recargar la página ni crear despliegues.
  window.setInterval(() => {
    if (!document.hidden && window.netlifyIdentity && window.netlifyIdentity.currentUser()) {
      loadComments({ silent: true });
    }
  }, 10000);
  window.addEventListener("focus", () => loadComments({ silent: true }));
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) loadComments({ silent: true });
  });
})();
