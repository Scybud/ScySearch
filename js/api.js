import { API_BASE_URL } from "./config.js";

let activeController = null;

/**
 * Calls the ScySearch edge function.
 * @param {string} query
 * @param {"all"|"stackoverflow"|"github"|"mdn"} source
 * @returns {Promise<{query: string, count: number, took_ms: number, results: Array}>}
 */
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
    } catch {
      // response wasn't JSON, keep the default message
    }
    throw new Error(message);
  }

  return res.json();
}
