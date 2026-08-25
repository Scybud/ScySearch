import { dom } from "./dom.js";
import { state } from "./state.js";
import { getKnowledgePanel } from "./knowledge.js";
import { RESULTS_PER_PAGE } from "./config.js";

const SOURCE_META = {
  stackoverflow: { label: "Stack Overflow", letter: "S", color: "#F0B255" },
  github: { label: "GitHub", letter: "G", color: "#8B7FFF" },
  mdn: { label: "MDN", letter: "M", color: "#21D6B5" },
};

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s ?? "";
  return div.innerHTML;
}

function metaLine(result) {
  const m = result.meta || {};
  if (result.source === "stackoverflow") {
    const answered = m.answered === "yes" ? " · answered" : "";
    return `${m.votes ?? 0} votes · ${m.answers ?? 0} answers${answered}`;
  }
  if (result.source === "github") {
    return `${m.stars ?? 0} stars · ${m.language ?? "unknown"}`;
  }
  if (result.source === "mdn") {
    return "MDN Reference";
  }
  return "";
}

export function renderLoading() {
  dom.resultsList.innerHTML = `<div class="no-results fade-in"><div class="big">Searching…</div></div>`;
  dom.resultStats.textContent = "Searching…";
  dom.pagination.innerHTML = "";
  dom.knowledgePanel.style.display = "none";
}

export function renderError(message) {
  dom.resultsList.innerHTML = `
    <div class="no-results fade-in">
      <div class="big">Search failed</div>
      <div>${escapeHtml(message)}</div>
    </div>`;
  dom.resultStats.textContent = "—";
  dom.pagination.innerHTML = "";
  dom.knowledgePanel.style.display = "none";
}

export function setStats(count, tookMs) {
  dom.resultStats.textContent = `${count} result${count === 1 ? "" : "s"} (${(tookMs / 1000).toFixed(2)} seconds)`;
}

export function renderResults() {
  const { results, query } = state;

  if (!results.length) {
    dom.resultsList.innerHTML = `
      <div class="no-results fade-in">
        <div class="big">No results for "${escapeHtml(query)}"</div>
        <div>Try a different query, or search a different source tab.</div>
      </div>`;
    dom.pagination.innerHTML = "";
    dom.knowledgePanel.style.display = "none";
    return;
  }

  const totalPages = Math.max(1, Math.ceil(results.length / RESULTS_PER_PAGE));
  state.page = Math.min(state.page, totalPages);
  const pageResults = results.slice((state.page - 1) * RESULTS_PER_PAGE, state.page * RESULTS_PER_PAGE);

  dom.resultsList.innerHTML = pageResults
    .map((r) => {
      const sm = SOURCE_META[r.source] || { label: r.source, letter: "?", color: "#5B9FEF" };
      return `
      <div class="result-card fade-in">
        <div class="result-top">
          <div class="favicon" style="background:${sm.color}">${sm.letter}</div>
          <div>
            <div class="result-site">${sm.label}</div>
            <div class="result-url">${escapeHtml(r.url)}</div>
          </div>
        </div>
        <a href="${r.url}" target="_blank" rel="noopener" class="result-title">${escapeHtml(r.title)}</a>
        <p class="result-snippet">${escapeHtml(r.snippet)}</p>
        <div class="result-metaline">${metaLine(r)}</div>
      </div>`;
    })
    .join("");

  renderKnowledgePanel(query);
  renderPagination(totalPages);
}

function renderKnowledgePanel(query) {
  const kp = getKnowledgePanel(query);
  if (!kp) {
    dom.knowledgePanel.style.display = "none";
    return;
  }
  dom.knowledgePanel.style.display = "block";
  dom.knowledgePanel.innerHTML = `
    <div class="kp-icon">${kp.icon}</div>
    <div class="kp-title">${kp.title}</div>
    <div class="kp-category">${kp.category}</div>
    <p class="kp-desc">${kp.desc}</p>
    <div class="kp-facts">
      ${kp.facts.map(([l, v]) => `<div class="kp-fact"><span class="kp-fact-label">${l}</span><span class="kp-fact-value">${v}</span></div>`).join("")}
    </div>
    <div class="kp-links">
      ${kp.links.map((l) => `<span class="kp-link">${l}</span>`).join("")}
    </div>`;
}

function renderPagination(totalPages) {
  if (totalPages <= 1) {
    dom.pagination.innerHTML = "";
    return;
  }
  let html = `<button class="page-btn" data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""}>‹</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === state.page ? "active" : ""}" data-page="${i}">${i}</button>`;
  }
  html += `<button class="page-btn" data-page="${state.page + 1}" ${state.page === totalPages ? "disabled" : ""}>›</button>`;
  dom.pagination.innerHTML = html;
}
