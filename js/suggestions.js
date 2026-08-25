import { TRENDING } from "./trending.js";
import { KNOWLEDGE } from "./knowledge.js";

function buildSuggestions(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const pool = [...TRENDING, ...Object.keys(KNOWLEDGE)];
  const matches = pool.filter((p) => p.toLowerCase().includes(q));
  const unique = [...new Set(matches)].slice(0, 6);
  return unique.length ? unique : [q];
}

function highlightMatch(text, q) {
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return text.slice(0, idx) + "<b>" + text.slice(idx, idx + q.length) + "</b>" + text.slice(idx + q.length);
}

export function wireSuggestions(input, panel, clearBtn, bar, onSelect) {
  let activeIndex = -1;

  function render() {
    const items = buildSuggestions(input.value);
    activeIndex = -1;
    if (!input.value.trim()) {
      panel.classList.remove("show");
      panel.innerHTML = "";
      return;
    }
    panel.innerHTML = items
      .map(
        (item, i) => `
      <div class="suggest-item" data-idx="${i}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <span>${highlightMatch(item, input.value)}</span>
      </div>`
      )
      .join("");
    panel.classList.add("show");
  }

  function updateActive(items) {
    items.forEach((it, i) => it.classList.toggle("active", i === activeIndex));
    if (items[activeIndex]) input.value = items[activeIndex].textContent.trim();
  }

  input.addEventListener("input", () => {
    clearBtn.classList.toggle("show", !!input.value);
    render();
  });

  input.addEventListener("focus", () => {
    bar.classList.add("focused");
    render();
  });

  input.addEventListener("blur", () => {
    bar.classList.remove("focused");
    setTimeout(() => panel.classList.remove("show"), 150);
  });

  input.addEventListener("keydown", (e) => {
    const items = panel.querySelectorAll(".suggest-item");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      updateActive(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, -1);
      updateActive(items);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && items[activeIndex]) {
        onSelect(items[activeIndex].textContent.trim());
      } else {
        onSelect(input.value);
      }
    } else if (e.key === "Escape") {
      panel.classList.remove("show");
    }
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    clearBtn.classList.remove("show");
    panel.classList.remove("show");
    input.focus();
  });

  panel.addEventListener("click", (e) => {
    const item = e.target.closest(".suggest-item");
    if (!item) return;
    onSelect(item.textContent.trim());
  });
}
