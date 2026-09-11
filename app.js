const STORAGE_KEY = "where-did-i-put-it-items";
const readItems = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
const normalise = (value) => value.trim().toLocaleLowerCase();
const escapeHtml = (value) => { const node = document.createElement("span"); node.textContent = value; return node.innerHTML; };

const screens = document.querySelectorAll(".screen");
const show = (id) => {
  screens.forEach((screen) => screen.classList.toggle("hidden", screen.id !== id));
  document.querySelector(`#${id} input`)?.focus();
};
const message = (element, text, type) => {
  element.className = `message ${type}`;
  element.textContent = text;
};
document.querySelectorAll("[data-open]").forEach((button) => button.addEventListener("click", () => show(button.dataset.open)));
document.querySelectorAll("[data-home]").forEach((button) => button.addEventListener("click", () => show("home-screen")));

const findForm = document.querySelector("#find-form");
const findResult = document.querySelector("#find-result");
findForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = findForm.item.value.trim();
  if (!query) return message(findResult, "Please enter an item name to search.", "error");
  const saved = readItems()[normalise(query)];
  if (!saved) return message(findResult, "Item not found. Would you like to add it?", "error");
  findResult.className = "message result";
  findResult.innerHTML = `<strong class="result-item">${escapeHtml(saved.name)} — ${escapeHtml(saved.location)}</strong>Your saved location.`;
});

const addForm = document.querySelector("#add-form");
const addResult = document.querySelector("#add-result");
const dialog = document.querySelector("#duplicate-dialog");
let pending;
addForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = addForm.item.value.trim();
  const location = addForm.location.value.trim();
  if (!name) return message(addResult, "Please enter the item name.", "error");
  if (!location) return message(addResult, "Please enter where you put it.", "error");
  pending = { name, location, key: normalise(name) };
  const existing = readItems()[pending.key];
  if (existing) {
    document.querySelector("#duplicate-copy").textContent = `${existing.name} is currently saved in ${existing.location}. Replace it with ${location}?`;
    dialog.showModal();
  } else savePending();
});
function savePending() {
  const saved = readItems();
  saved[pending.key] = { name: pending.name, location: pending.location };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  message(addResult, `${pending.name} saved in ${pending.location}.`, "success");
  addForm.reset();
  pending = undefined;
}
document.querySelector("#replace-location").addEventListener("click", () => { dialog.close(); savePending(); });
document.querySelector("#keep-old").addEventListener("click", () => { dialog.close(); message(addResult, "Your old location was kept.", "result"); pending = undefined; });
