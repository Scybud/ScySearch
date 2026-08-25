import { dom } from "./dom.js";
import { initTheme } from "./theme.js";
import { renderTrendingChips } from "./trending.js";
import { wireSuggestions } from "./suggestions.js";
import { runSearch, goHome, feelingLucky, changeTab, changePage } from "./search.js";

initTheme();
renderTrendingChips(runSearch);

wireSuggestions(dom.homeInput, dom.homeSuggest, dom.homeClear, dom.homeSearchBar, runSearch);
wireSuggestions(dom.resultsInput, dom.resultsSuggest, dom.resultsClear, dom.resultsSearchBar, (q) => runSearch(q));

dom.logos.forEach((logo) => logo.addEventListener("click", goHome));
dom.feelingLuckyBtn.addEventListener("click", feelingLucky);
dom.searchBtn.addEventListener("click", () => runSearch(dom.homeInput.value));

dom.tabsRow.addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  changeTab(tab.dataset.tab);
});

dom.pagination.addEventListener("click", (e) => {
  const btn = e.target.closest(".page-btn");
  if (!btn || btn.disabled) return;
  changePage(Number(btn.dataset.page));
});

dom.resultsInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") runSearch(dom.resultsInput.value, "all");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
    e.preventDefault();
    (dom.homeWrap.classList.contains("hidden") ? dom.resultsInput : dom.homeInput).focus();
  }
});

dom.homeInput.focus();
