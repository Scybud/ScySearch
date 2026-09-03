import { dom } from "./dom.js";
import { state, resetForNewSearch } from "./state.js";
import { fetchResults, fetchIndexedResults } from "./api.js";
import {
  renderResults,
  renderLoading,
  renderError,
  setStats,
  renderIndexedPanel,
} from "./results.js";
import { TRENDING } from "./trending.js";

export function goHome() {
  dom.resultsWrap.classList.remove("show");
  dom.homeWrap.classList.remove("hidden");
  dom.homeInput.value = "";
  dom.homeClear.classList.remove("show");
  dom.homeInput.focus();
}

export function feelingLucky() {
  const pick = TRENDING[Math.floor(Math.random() * TRENDING.length)];
  runSearch(pick);
}

export async function runSearch(query, tab = "all") {
  query = (query || "").trim();
  if (!query) return;

  resetForNewSearch(query);
  state.tab = tab;
  const requestId = ++state.requestId;

  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.toggle("active", t.dataset.tab === tab));

  dom.homeWrap.classList.add("hidden");
  dom.resultsWrap.classList.add("show");
  dom.resultsInput.value = query;
  dom.resultsClear.classList.toggle("show", !!query);
  dom.homeSuggest.classList.remove("show");
  dom.resultsSuggest.classList.remove("show");

  window.scrollTo({ top: 0, behavior: "smooth" });

  state.loading = true;
  renderLoading();
  dom.indexedPanel.style.display = "none";

  fetchIndexedResults(query).then((indexed) => {
    if (state.requestId === requestId) renderIndexedPanel(indexed);
  });

  try {
    const data = await fetchResults(query, tab);
    if (state.requestId !== requestId) return;
    state.results = data.results || [];
    state.loading = false;
    setStats(data.count ?? state.results.length, data.took_ms ?? 0);
    renderResults();
  } catch (err) {
    if (err.name === "AbortError") return console.log("aborted:", tab);
    if (state.requestId !== requestId) return;
    state.loading = false;
    state.error = err.message;
    renderError(err.message);
  }
}

export function changeTab(tab) {
  if (!state.query) return;
  runSearch(state.query, tab);
}

export function changePage(page) {
  state.page = page;
  renderResults();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
