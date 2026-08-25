import { dom } from "./dom.js";

export const TRENDING = [
  "css grid",
  "supabase edge functions",
  "vanilla js state management",
  "css container queries",
  "dark mode color tokens",
  "github actions cache",
];

export function renderTrendingChips(onSelect) {
  dom.trendingChips.innerHTML = "";
  TRENDING.forEach((t) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.innerHTML = `<span class="spark">↗</span>${t}`;
    chip.addEventListener("click", () => onSelect(t));
    dom.trendingChips.appendChild(chip);
  });
}
