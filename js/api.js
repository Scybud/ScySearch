import { API_BASE_URL, INDEXED_API_URL } from "./config.js";

let activeController = null;
let indexedController = null;

export async function fetchResults(query, source = "all") {
  if (activeController) activeController.abort();
  activeController = new AbortController();

  const params = new URLSearchParams({ q: query });
  if (source !== "all") params.set("sources", source);

  const res = await fetch(`${API_BASE_URL}?${params.toString()}`, {
    signal: activeController.signal,
  });

  if (!res.ok) {
    let message = `Search failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.error) message = body.error;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

export async function fetchIndexedResults(query) {
  if (indexedController) indexedController.abort();
  indexedController = new AbortController();

  const params = new URLSearchParams({ q: query });

  try {
    const res = await fetch(`${INDEXED_API_URL}?${params.toString()}`, {
      signal: indexedController.signal,
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    if (err.name === "AbortError") return [];
    return [];
  }
}
