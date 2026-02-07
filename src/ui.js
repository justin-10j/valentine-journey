const storyUI = document.getElementById("storyUI");
const cardTitle = document.getElementById("cardTitle");
const cardText = document.getElementById("cardText");
const okBtn = document.getElementById("okBtn");
const countdownEl = document.getElementById("countdown");

okBtn.addEventListener("click", () => hideCard());

export function showCard({ title, text, showCountdown=false }) {
  cardTitle.textContent = title;
  cardText.textContent = text;
  countdownEl.classList.toggle("hidden", !showCountdown);
  storyUI.classList.remove("hidden");
}
export function hideCard() {
  storyUI.classList.add("hidden");
}
export function setCountdown(text) {
  countdownEl.textContent = text;
}
export function showCountdown() {
  countdownEl.classList.remove("hidden");
}
export function hideCountdown() {
  countdownEl.classList.add("hidden");
}
