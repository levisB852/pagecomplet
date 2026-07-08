const schemas = {
  videos: {
    file: "videos.json",
    fields: [
      ["id", "ID de YouTube"],
      ["title", "Título"],
      ["description", "Descripción"]
    ],
    empty: { id: "", title: "", description: "" }
  },
  eventos: {
    file: "eventos.json",
    fields: [
      ["title", "Título"],
      ["type", "Tipo"],
      ["date", "Fecha"],
      ["time", "Hora"],
      ["place", "Lugar"]
    ],
    empty: { title: "", type: "culto", date: "", time: "", place: "" }
  }
};

let current = "videos";
let items = [];

const listEl = document.getElementById("adminList");
const outputEl = document.getElementById("adminOutput");
const statusEl = document.getElementById("adminStatus");

async function loadContent(type) {
  current = type;
  try {
    const res = await fetch(`data/${schemas[type].file}`);
    items = res.ok ? await res.json() : [];
  } catch {
    items = [];
  }
  render();
}

function render() {
  const schema = schemas[current];
  listEl.innerHTML = "";

  items.forEach((item, index) => {
    const box = document.createElement("div");
    box.className = "admin-item";
    box.innerHTML = schema.fields.map(([key, label]) => `
      <label class="field">
        <span>${label}</span>
        <input class="input" data-index="${index}" data-key="${key}" value="${escapeAttr(item[key] || "")}">
      </label>
    `).join("") + `
      <button class="btn btn-ghost" type="button" data-remove="${index}">Eliminar</button>
    `;
    listEl.appendChild(box);
  });

  updateOutput();
}

function updateOutput() {
  outputEl.value = JSON.stringify(items, null, 2);
}

function escapeAttr(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

listEl.addEventListener("input", (event) => {
  const input = event.target.closest("[data-index][data-key]");
  if (!input) return;
  items[Number(input.dataset.index)][input.dataset.key] = input.value;
  updateOutput();
});

listEl.addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove]");
  if (!remove) return;
  items.splice(Number(remove.dataset.remove), 1);
  render();
});

document.getElementById("addItem").addEventListener("click", () => {
  items.push({ ...schemas[current].empty });
  render();
});

document.querySelectorAll("[data-admin-tab]").forEach(button => {
  button.addEventListener("click", () => loadContent(button.dataset.adminTab));
});

document.getElementById("copyJson").addEventListener("click", async () => {
  await navigator.clipboard.writeText(outputEl.value);
  statusEl.textContent = "JSON copiado.";
});

document.getElementById("downloadJson").addEventListener("click", () => {
  const blob = new Blob([outputEl.value], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = schemas[current].file;
  link.click();
  URL.revokeObjectURL(link.href);
});

loadContent(current);
