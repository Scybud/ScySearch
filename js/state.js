export const state = {
  query: "",
  tab: "all",
  page: 1,
  results: [],
  loading: false,
  error: null,
  requestId: 0,
};

export function resetForNewSearch(query) {
  state.query = query;
  state.page = 1;
  state.results = [];
  state.loading = false;
  state.error = null;
}
