(function () {
  const list = document.getElementById("moderationList");
  const message = document.getElementById("moderationMessage");
  const pendingCount = document.getElementById("pendingCount");
  const template = document.getElementById("commentCardTemplate");
  const filters = Array.from(document.querySelectorAll("[data-status]"));
  let comments = [];
  let activeStatus = "pending";

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
      card.querySelector('[data-field="nombre"]').textContent = item.nombre;
      card.querySelector('[data-field="meta"]').textContent = item.filial || "Sin filial indicada";
      card.querySelector('[data-field="date"]').textContent = formatDate(item.created_at);
      card.querySelector('[data-field="comentario"]').textContent = item.comentario;
      if (activeStatus !== "pending") card.querySelector(".moderation-actions").hidden = true;
      list.append(card);
    });
  }
  async function authorizedFetch(url, options) {
    const user = window.netlifyIdentity && window.netlifyIdentity.currentUser();
    if (!user) throw new Error("AUTH");
    const token = await user.jwt();
    return fetch(url, { ...options, headers: { ...(options && options.headers), Authorization: `Bearer ${token}` } });
  }
  async function loadComments() {
    setMessage("Cargando comentarios…");
    try {
      const response = await authorizedFetch("/api/comments-admin");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudieron cargar los comentarios.");
      comments = Array.isArray(data.comments) ? data.comments : [];
      setMessage("");
      render();
    } catch (error) {
      if (error.message === "AUTH") {
        setMessage("Inicia sesión para moderar comentarios.", true);
        window.netlifyIdentity.open("login");
      } else setMessage(error.message, true);
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
      comments = comments.map(item => item.id === id ? data.comment : item);
      setMessage(status === "approved" ? "Comentario publicado sin hacer un despliegue." : "Comentario rechazado.");
      render();
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
  document.getElementById("refreshComments").addEventListener("click", loadComments);
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
})();
