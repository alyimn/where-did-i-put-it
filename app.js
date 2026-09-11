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
const key="where-did-i-put-it-items";const read=()=>JSON.parse(localStorage.getItem(key)||"{}");const clean=v=>v.trim().toLowerCase();const esc=v=>{const n=document.createElement("span");n.textContent=v;return n.innerHTML};const screens=document.querySelectorAll(".screen");function show(id){screens.forEach(s=>s.classList.toggle("hidden",s.id!==id));document.querySelector(`#${id} input`)?.focus()}function say(el,text,type){el.className=`message ${type}`;el.textContent=text}document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>show(b.dataset.open));document.querySelectorAll("[data-home]").forEach(b=>b.onclick=()=>show("home-screen"));
const findForm=document.querySelector("#find-form"),findResult=document.querySelector("#find-result"),addForm=document.querySelector("#add-form"),addResult=document.querySelector("#add-result"),dialog=document.querySelector("#duplicate-dialog");findForm.onsubmit=e=>{e.preventDefault();const q=findForm.item.value.trim();if(!q)return say(findResult,"Please enter an item name to search.","error");const saved=read()[clean(q)];if(!saved){findResult.className="message error";findResult.innerHTML=`Item not found. Would you like to add it?<button class="inline-action" id="add-searched-item" type="button">Add ${esc(q)}</button>`;document.querySelector("#add-searched-item").onclick=()=>{show("add-screen");addForm.item.value=q;addForm.location.focus()};return}findResult.className="message result";findResult.innerHTML=`<b>${esc(saved.name)} — ${esc(saved.location)}</b>`};let pending;addForm.onsubmit=e=>{e.preventDefault();const name=addForm.item.value.trim(),location=addForm.location.value.trim();if(!name)return say(addResult,"Please enter the item name.","error");if(!location)return say(addResult,"Please enter where you put it.","error");pending={name,location,id:clean(name)};const old=read()[pending.id];if(old){document.querySelector("#duplicate-copy").textContent=`${old.name} is currently saved in ${old.location}. Replace it with ${location}?`;dialog.showModal()}else save()};function save(){const all=read();all[pending.id]={name:pending.name,location:pending.location};localStorage.setItem(key,JSON.stringify(all));say(addResult,`${pending.name} saved in ${pending.location}.`,"success");addForm.reset();pending=null}document.querySelector("#replace-location").onclick=()=>{dialog.close();save()};document.querySelector("#keep-old").onclick=()=>{dialog.close();say(addResult,"Your old location was kept.","result");pending=null};
