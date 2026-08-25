/* ---------------- Mock data ---------------- */
const TRENDING = [
  "vanilla js state management", "css container queries", "supabase edge functions",
  "dark mode color tokens", "arduino sensor debugging", "indie hacker launch checklist"
];

const RESULT_TOPICS = {
  "css grid": [
    ["MDN Web Docs", "developer.mozilla.org/CSS/grid", "CSS Grid Layout - a two-dimensional layout system for the web", "A complete guide to <mark>CSS grid</mark>, covering tracks, areas, and implicit sizing for building layouts without extra markup.", "M"],
    ["CSS-Tricks", "css-tricks.com/snippets/css/complete-guide-grid", "A Complete Guide to CSS Grid", "Every property explained with diagrams, from grid-template-columns to the often-confused fr unit and auto-placement rules.", "C"],
    ["web.dev", "web.dev/learn/css/grid", "Learn CSS: Grid", "An interactive course covering subgrid, named lines, and how <mark>grid</mark> compares to flexbox for two-axis layouts.", "W"],
    ["Josh Comeau", "joshwcomeau.com/css/grid-critical-guide", "An Interactive Guide to CSS Grid", "Visual, scroll-driven explanations of gap, minmax, and the repeat() function with live editable examples.", "J"],
    ["Smashing Magazine", "smashingmagazine.com/css-grid-patterns", "Common CSS Grid Layout Patterns", "Real layout recipes including holy-grail layouts, card grids, and responsive dashboards without media queries.", "S"],
    ["Kevin Powell", "youtube.com/kevinpowell/css-grid", "CSS Grid in 20 Minutes", "A fast-paced walkthrough of grid fundamentals aimed at developers coming from flexbox-only backgrounds.", "K"]
  ],
  "black holes": [
    ["NASA", "nasa.gov/black-holes", "Black Holes | Science", "A black hole is a region of spacetime where gravity is so strong that nothing, not even light, can escape once past the event horizon.", "N"],
    ["Event Horizon Telescope", "eventhorizontelescope.org", "First Image of a Black Hole", "In 2019 the EHT collaboration released the first-ever image of a <mark>black hole</mark>, located at the center of galaxy M87.", "E"],
    ["Wikipedia", "en.wikipedia.org/wiki/Black_hole", "Black hole - Wikipedia", "Covers formation from stellar collapse, the Schwarzschild radius, Hawking radiation, and open questions in the field.", "W"],
    ["Scientific American", "scientificamerican.com/black-hole-mergers", "How Black Holes Merge", "Gravitational wave detectors like LIGO have observed dozens of black hole collisions since the first detection in 2015.", "S"],
    ["Sixty Symbols", "youtube.com/sixtysymbols/black-holes-explained", "Black Holes Explained by Physicists", "University of Nottingham researchers break down spaghettification, singularities, and why black holes aren't actually holes.", "S"]
  ],
  "default": [
    ["Scybud UI", "ui.scybud.com", "Scybud UI - Component Library", "A shared design system of CSS custom properties and components used across every Scybud product, from LogHue to ZeFeed.", "S"],
    ["LogHue", "loghue.com", "LogHue - Productivity SaaS", "Track time, manage projects, and bill clients in one dashboard, built with the Scybud design language throughout.", "L"],
    ["GitHub", "github.com/abdulroqib123", "abdulroqib123 - Overview", "Repositories for Scybud products including ZeFeed, PropDek, and the Scybud UI component library, mostly vanilla JS.", "G"],
    ["ZeFeed", "zefeed.vercel.app", "ZeFeed - Tech News, Curated", "A minimal tech news reader with Home, Explore, and History pages, built on vanilla JS and Supabase.", "Z"],
    ["PropDek", "propdek.scybud.com", "PropDek - Property Management", "Agents manage assets, tenants, and clients in one place, with a public marketplace for sale and rental listings.", "P"],
    ["CanvArt", "canvart.scybud.com", "CanvArt - Dark Mode Art Sharing", "An art-sharing platform with an Explore gallery, uploads, and rate limiting, styled entirely in dark mode.", "C"],
    ["DakAt", "dakat.scybud.com", "DakAt - Universal Dark Mode", "A browser extension that forces a readable dark theme onto any site that doesn't ship one natively.", "D"],
    ["Scyflix", "scyflix.github.io", "Scyflix - Build in Public", "Progress logs and behind-the-scenes posts documenting the day-to-day of building the Scybud studio.", "S"]
  ]
};

const KNOWLEDGE = {
  "scybud": {
    title: "Scybud", category: "Software discovery platform", icon: "S",
    desc: "Scybud is a curated platform for discovering, launching, and managing indie software products, where every submission is reviewed before it goes live.",
    facts: [["Founded by", "Abdulroqib"], ["Based in", "Bremen, Germany"], ["Stack", "Vanilla HTML/CSS/JS + Supabase"], ["Design", "Dark mode first"]],
    links: ["scybud.com", "ui.scybud.com", "Scyflix"]
  },
  "black holes": {
    title: "Black Hole", category: "Astronomical object", icon: "●",
    desc: "A region of spacetime where gravity is strong enough that nothing, including light, can escape once past the event horizon.",
    facts: [["Discovered", "Predicted 1916"], ["First image", "2019, EHT"], ["Nearest known", "~1,560 light-years"], ["Type", "Stellar, supermassive, primordial"]],
    links: ["Event horizon", "Hawking radiation", "M87*"]
  },
  "css grid": {
    title: "CSS Grid", category: "Layout module", icon: "▦",
    desc: "A two-dimensional CSS layout system that lets you arrange elements into rows and columns without extra markup or floats.",
    facts: [["Introduced", "2017 (CSS3)"], ["Browser support", "97%+ global"], ["Related", "Flexbox, Subgrid"], ["Spec status", "W3C Candidate Rec"]],
    links: ["grid-template", "fr unit", "subgrid"]
  }
};

const FILTERS = ["Any time", "Past week", "Past month", "Past year"];

/* ---------------- State ---------------- */
let currentQuery = "";
let currentPage = 1;
let currentTab = "all";
let activeFilter = 0;
let activeSuggestIndex = -1;

const homeWrap = document.getElementById('homeWrap');
const resultsWrap = document.getElementById('resultsWrap');
const homeInput = document.getElementById('homeInput');
const resultsInput = document.getElementById('resultsInput');

const logos = document.querySelectorAll(".logo");
const feelingLuckyBtn = document.getElementById("feelingLuckyBtn");
const searchBtn = document.getElementById("searchBtn");

/* ---------------- Theme ---------------- */
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
});

/* ---------------- Trending chips ---------------- */
const trendingChips = document.getElementById('trendingChips');
TRENDING.forEach(t => {
  const chip = document.createElement('button');
  chip.className = 'chip';
  chip.innerHTML = `<span class="spark">↗</span>${t}`;
  chip.onclick = () => runSearch(t);
  trendingChips.appendChild(chip);
});

/* ---------------- Filter chips ---------------- */
const filterChips = document.getElementById('filterChips');
FILTERS.forEach((f, i) => {
  const chip = document.createElement('button');
  chip.className = 'filter-chip' + (i === 0 ? ' active' : '');
  chip.textContent = f;
  chip.onclick = () => {
    activeFilter = i;
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentPage = 1;
    renderResults();
  };
  filterChips.appendChild(chip);
});

/* ---------------- Suggestions ---------------- */
function buildSuggestions(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const pool = [...TRENDING, "scybud", "black holes", "css grid", "loghue pricing", "zefeed changelog", "propdek marketplace"];
  const matches = pool.filter(p => p.toLowerCase().includes(q));
  const unique = [...new Set(matches)].slice(0, 6);
  return unique.length ? unique : [q];
}

/* ---------------- Suggestions ---------------- */
function wireSuggestions(input, panel, clearBtn, bar) {
  function render() {
    const items = buildSuggestions(input.value);
    activeSuggestIndex = -1;

    if (!input.value.trim()) {
      panel.classList.remove('show');
      panel.innerHTML = '';
      return;
    }

    panel.innerHTML = items.map((item, i) => `
      <div class="suggest-item" data-idx="${i}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <span>${highlightMatch(item, input.value)}</span>
      </div>
    `).join('');

    panel.classList.add('show');
  }

  function highlightMatch(text, q) {
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return text.slice(0, idx) + '<b>' + text.slice(idx, idx + q.length) + '</b>' + text.slice(idx + q.length);
  }

  input.addEventListener('input', () => {
    clearBtn.classList.toggle('show', !!input.value);
    render();
  });

  input.addEventListener('focus', () => {
    bar.classList.add('focused');
    render();
  });

  input.addEventListener('blur', () => {
    bar.classList.remove('focused');
    setTimeout(() => panel.classList.remove('show'), 150);
  });

  input.addEventListener('keydown', (e) => {
    const items = panel.querySelectorAll('.suggest-item');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeSuggestIndex = Math.min(activeSuggestIndex + 1, items.length - 1);
      updateActive(items);

    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeSuggestIndex = Math.max(activeSuggestIndex - 1, -1);
      updateActive(items);

    } else if (e.key === 'Enter') {
      if (activeSuggestIndex >= 0 && items[activeSuggestIndex]) {
        runSearch(items[activeSuggestIndex].textContent.trim());
      } else {
        runSearch(input.value);
      }

    } else if (e.key === 'Escape') {
      panel.classList.remove('show');
    }
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.classList.remove('show');
    panel.classList.remove('show');
    input.focus();
  });

  panel.addEventListener('click', (e) => {
    const item = e.target.closest('.suggest-item');
    if (!item) return;
    runSearch(item.textContent.trim());
  });

  function updateActive(items) {
    items.forEach((it, i) => it.classList.toggle('active', i === activeSuggestIndex));
    if (items[activeSuggestIndex]) input.value = items[activeSuggestIndex].textContent.trim();
  }
}

wireSuggestions(homeInput, document.getElementById('homeSuggest'), document.getElementById('homeClear'), document.getElementById('homeSearchBar'));
wireSuggestions(resultsInput, document.getElementById('resultsSuggest'), document.getElementById('resultsClear'), document.getElementById('resultsSearchBar'));


/* ---------------- Tabs ---------------- */
document.getElementById('tabsRow').addEventListener('click', (e) => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  currentTab = tab.dataset.tab;
  currentPage = 1;
  renderResults();
});


/* ---------------- Search flow ---------------- */
function goHome() {
  resultsWrap.classList.remove('show');
  homeWrap.classList.remove('hidden');
  homeInput.value = '';
  document.getElementById('homeClear').classList.remove('show');
  homeInput.focus();
}

function feelingLucky() {
  const pick = TRENDING[Math.floor(Math.random() * TRENDING.length)];
  runSearch(pick);
}

function runSearch(query) {
  query = (query || '').trim();
  if (!query) return;

  currentQuery = query;
  currentPage = 1;
  currentTab = 'all';

  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === 'all'));

  homeWrap.classList.add('hidden');
  resultsWrap.classList.add('show');

  resultsInput.value = query;
  document.getElementById('resultsClear').classList.toggle('show', !!query);

  document.getElementById('homeSuggest').classList.remove('show');
  document.getElementById('resultsSuggest').classList.remove('show');

  renderResults();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

resultsInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && activeSuggestIndex === -1) runSearch(resultsInput.value);
});


/* ---------------- Rendering ---------------- */
function getResultsForQuery(q) {
  const key = q.toLowerCase().trim();
  if (RESULT_TOPICS[key]) return RESULT_TOPICS[key];
  return RESULT_TOPICS['default'];
}

function faviconColor(letter) {
  const colors = ['#21D6B5', '#8B7FFF', '#F0B255', '#F0655A', '#5B9FEF'];
  const idx = letter.charCodeAt(0) % colors.length;
  return colors[idx];
}

function renderResults() {
  const list = document.getElementById('resultsList');
  const kp = document.getElementById('knowledgePanel');
  const stats = document.getElementById('resultStats');
  const key = currentQuery.toLowerCase().trim();

  if (key === 'asdkfjhqwe' || key === 'xyzzynonsense') {
    list.innerHTML = `
      <div class="no-results fade-in">
        <div class="big">No results for "${escapeHtml(currentQuery)}"</div>
        <div>Try a different query, or check the spelling.</div>
      </div>
    `;
    stats.textContent = `0 results`;
    document.getElementById('pagination').innerHTML = '';
    kp.style.display = 'none';
    return;
  }

  let results = getResultsForQuery(key);

  if (currentTab === 'news') results = [...results].reverse();
  if (currentTab === 'videos') results = results.filter((_, i) => i % 2 === 0);
  if (currentTab === 'discussions') results = results.filter((_, i) => i % 2 === 1);
  if (currentTab === 'images') results = results.slice(0, 3);

  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(results.length / perPage));
  currentPage = Math.min(currentPage, totalPages);

  const pageResults = results.slice((currentPage - 1) * perPage, currentPage * perPage);

  const fakeCount = (1200 + key.length * 317 + currentTab.length * 41).toLocaleString();
  const fakeTime = (0.18 + (key.length % 5) * 0.07).toFixed(2);
  stats.textContent = `About ${fakeCount} results (${fakeTime} seconds)`;

  list.innerHTML = pageResults.map(([site, url, title, snippet, letter]) => `
    <div class="result-card fade-in">
      <div class="result-top">
        <div class="favicon" style="background:${faviconColor(letter)}">${letter}</div>
        <div>
          <div class="result-site">${site}</div>
          <div class="result-url">${url}</div>
        </div>
      </div>
      <a href="https://${url}" target="_blank" class="result-title">${title}</a>
      <p class="result-snippet">${snippet}</p>
    </div>
  `).join('');

  const kpData = KNOWLEDGE[key];
  if (kpData) {
    kp.style.display = 'block';
    kp.innerHTML = `
      <div class="kp-icon">${kpData.icon}</div>
      <div class="kp-title">${kpData.title}</div>
      <div class="kp-category">${kpData.category}</div>
      <p class="kp-desc">${kpData.desc}</p>
      <div class="kp-facts">
        ${kpData.facts.map(([l, v]) => `
          <div class="kp-fact">
            <span class="kp-fact-label">${l}</span>
            <span class="kp-fact-value">${v}</span>
          </div>
        `).join('')}
      </div>
      <div class="kp-links">
        ${kpData.links.map(l => `<span class="kp-link">${l}</span>`).join('')}
      </div>
    `;
  } else {
    kp.style.display = 'none';
  }

  renderPagination(totalPages);
}


/* ---------------- Pagination (rewritten) ---------------- */
function renderPagination(totalPages) {
  const el = document.getElementById('pagination');

  if (totalPages <= 1) {
    el.innerHTML = '';
    return;
  }

  let html = `
    <button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>‹</button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>
    `;
  }

  html += `
    <button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>›</button>
  `;

  el.innerHTML = html;
}

document.getElementById('pagination').addEventListener('click', (e) => {
  const btn = e.target.closest('.page-btn');
  if (!btn || btn.disabled) return;
  const p = Number(btn.dataset.page);
  changePage(p);
});

function changePage(p) {
  currentPage = p;
  renderResults();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ---------------- Utils ---------------- */
function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}


/* Keyboard: focus search with "/" from home */
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
    e.preventDefault();
    (homeWrap.classList.contains('hidden') ? resultsInput : homeInput).focus();
  }
});

homeInput.focus();


/* ---------------- DOMContentLoaded ---------------- */
window.addEventListener("DOMContentLoaded", () => {
  logos.forEach((logo) => {
    logo.addEventListener("click", () => {
      goHome();
    });
  });

  feelingLuckyBtn.addEventListener("click", () => {
    feelingLucky();
  });

  searchBtn.addEventListener("click", () => {
    runSearch(homeInput.value);
  });
});
