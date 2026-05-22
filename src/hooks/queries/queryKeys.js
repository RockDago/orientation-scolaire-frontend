export const normalizeSearch = (search = "") => String(search).trim();

const DEFAULT_LIST_PARAMS = { limit: 9999 };

export const normalizeListParams = (params = {}) => {
  const rawParams =
    typeof params === "string"
      ? { ...DEFAULT_LIST_PARAMS, search: normalizeSearch(params) }
      : { ...DEFAULT_LIST_PARAMS, ...(params || {}) };

  return Object.keys(rawParams)
    .sort()
    .reduce((normalized, key) => {
      const value = rawParams[key];
      if (value === undefined || value === null || value === "") return normalized;
      normalized[key] = typeof value === "string" ? normalizeSearch(value) : value;
      return normalized;
    }, {});
};

export const queryKeys = {
  dashboard: {
    all: ["dashboard"],
    detail: ({ period = "30j", startDate = "", endDate = "" } = {}) => [
      "dashboard",
      period || "30j",
      startDate || "",
      endDate || "",
    ],
  },
  domaines: {
    all: ["domaines"],
    lists: () => ["domaines", "list"],
    list: (params = {}) => ["domaines", "list", normalizeListParams(params)],
    detail: (id) => ["domaines", "detail", id],
  },
  mentions: {
    all: ["mentions"],
    lists: () => ["mentions", "list"],
    list: (params = {}) => ["mentions", "list", normalizeListParams(params)],
    detail: (id) => ["mentions", "detail", id],
  },
  parcours: {
    all: ["parcours"],
    lists: () => ["parcours", "list"],
    list: (params = {}) => ["parcours", "list", normalizeListParams(params)],
    detail: (id) => ["parcours", "detail", id],
  },
  series: {
    all: ["series"],
    lists: () => ["series", "list"],
    list: (params = {}) => ["series", "list", normalizeListParams(params)],
    detail: (id) => ["series", "detail", id],
  },
  metiers: {
    all: ["metiers"],
    lists: () => ["metiers", "list"],
    list: (params = {}) => ["metiers", "list", normalizeListParams(params)],
    detail: (id) => ["metiers", "detail", id],
  },
  etablissements: {
    all: ["etablissements"],
    lists: () => ["etablissements", "list"],
    list: (params = {}) => ["etablissements", "list", normalizeListParams(params)],
    detail: (id) => ["etablissements", "detail", id],
  },
  users: {
    all: ["users"],
    lists: () => ["users", "list"],
    list: (params = {}) => ["users", "list", normalizeListParams(params)],
    detail: (id) => ["users", "detail", id],
  },
  profile: {
    all: ["profile"],
    detail: () => ["profile", "detail"],
  },
};
