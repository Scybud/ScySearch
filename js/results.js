import { dom } from "./dom.js";
import { state } from "./state.js";
import { getKnowledgePanel } from "./knowledge.js";
import { RESULTS_PER_PAGE } from "./config.js";
import { magnifyImg } from "https://ui.scybud.com/js/ui.js";

const SOURCE_META = {
  stackoverflow: { label: "Stack Overflow", letter: "S", color: "#F0B255" },
  github: { label: "GitHub", letter: "G", color: "#8B7FFF" },
  mdn: { label: "MDN", letter: "M", color: "#21D6B5" },
  hackernews: { label: "Hacker News", letter: "H", color: "#F0655A" },
  reddit: { label: "Reddit", letter: "R", color: "#5B9FEF" },
  devto: { label: "DEV", letter: "D", color: "#4ADE80" },
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
  if (result.source === "hackernews") {
    return `${m.points ?? 0} points · ${m.comments ?? 0} comments`;
  }
  if (result.source === "reddit") {
    return `r/${m.subreddit ?? ""} · ${m.upvotes ?? 0} upvotes · ${m.comments ?? 0} comments`;
  }
  if (result.source === "devto") {
    return `${m.reactions ?? 0} reactions${m.tags ? ` · ${m.tags}` : ""}`;
  }
  return "";
}

export function renderLoading() {
  dom.resultsList.classList.remove("image-grid", "video-grid");
  dom.resultsList.innerHTML = `<div class="no-results fade-in"><div class="big">Searching…</div></div>`;
  dom.resultStats.textContent = "Searching…";
  dom.pagination.innerHTML = "";
  dom.knowledgePanel.style.display = "none";
}

export function renderError(message) {
  dom.resultsList.classList.remove("image-grid", "video-grid");
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
  const { results, query, tab } = state;

  dom.resultsList.classList.toggle("image-grid", tab === "images");
  dom.resultsList.classList.toggle("video-grid", tab === "videos");

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

  if (tab === "images") {
    renderImageResults(pageResults);
  } else if (tab === "videos") {
    renderVideoResults(pageResults);
  } else {
    renderTextResults(pageResults);
  }

  renderKnowledgePanel(query);
  renderPagination(totalPages);
}

function renderTextResults(pageResults) {
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
}

function renderImageResults(pageResults) {
  // Image itself triggers the Scybud UI lightbox (magnifyImg), the meta row
  // is a separate link so a click on the image never fights with navigation.
  dom.resultsList.innerHTML = pageResults
    .map((r) => {
      const sm = SOURCE_META[r.source] || { label: r.source, letter: "?", color: "#5B9FEF" };
      const imageUrl = r.meta?.imageUrl || "";
      if (!imageUrl) return "";
      return `
      <div class="image-card fade-in">
        <img src="${imageUrl}" alt="${escapeHtml(r.title)}" class="scybud-magnify" loading="lazy">
        <a class="image-card-meta" href="${r.url}" target="_blank" rel="noopener">
          <span class="favicon" style="background:${sm.color}">${sm.letter}</span>
          <span class="image-card-title">${escapeHtml(r.title)}</span>
        </a>
      </div>`;
    })
    .join("");

  dom.resultsList.querySelectorAll("img.scybud-magnify").forEach((img) => magnifyImg(img));
}

function renderVideoResults(pageResults) {
  const PROVIDER_LABEL = { youtube: "YouTube", vimeo: "Vimeo" };
  dom.resultsList.innerHTML = pageResults
    .map((r) => {
      const thumb = r.meta?.thumbnail || "";
      const channel = r.meta?.channel || "";
      const provider = PROVIDER_LABEL[r.meta?.provider] || "Video";
      return `
      <a class="video-card fade-in" href="${r.url}" target="_blank" rel="noopener">
        <div class="video-thumb-wrap">
          <img src="${thumb}" alt="${escapeHtml(r.title)}" loading="lazy">
          <span class="video-play">▶</span>
          <span class="video-provider">${provider}</span>
        </div>
        <div class="video-card-body">
          <div class="video-card-title">${escapeHtml(r.title)}</div>
          <div class="video-card-channel">${escapeHtml(channel)}</div>
        </div>
      </a>`;
    })
    .join("");
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

export function renderIndexedPanel(results) {
  if (!results.length) {
    dom.indexedPanel.style.display = "none";
    dom.indexedPanel.innerHTML = "";
    return;
  }
  dom.indexedPanel.style.display = "block";
  dom.indexedPanel.innerHTML = `
    <div class="indexed-panel-title">From Scybud's indexed docs</div>
    ${results
      .map(
        (r) => `
      <a href="${r.url}" target="_blank" rel="noopener" class="indexed-result">
        <div class="indexed-result-title">${escapeHtml(r.title)}</div>
        <div class="indexed-result-url">${escapeHtml(r.url)}</div>
      </a>`,
      )
      .join("")}`;
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