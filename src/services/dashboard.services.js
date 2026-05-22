import API from "../api/axios";

const getVisitorId = () => {
  if (typeof window === "undefined") return null;

  let visitorId = sessionStorage.getItem("osp_visitor_id");
  if (!visitorId) {
    visitorId = `v_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
    sessionStorage.setItem("osp_visitor_id", visitorId);
  }

  return visitorId;
};

const buildClientInfo = () => {
  if (typeof window === "undefined") return {};

  const nav = window.navigator || {};
  const screen = window.screen || {};
  let connectionType = null;

  try {
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    connectionType = connection?.effectiveType || null;
  } catch {
    connectionType = null;
  }

  return {
    language: nav.language || null,
    screen: { width: screen.width || null, height: screen.height || null },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    connection_type: connectionType,
  };
};

const trackedPages = new Set();

export const trackPageView = async (page, metierId = null) => {
  if (typeof window === "undefined") return null;
  if (trackedPages.has(page)) return null;
  trackedPages.add(page);

  try {
    const response = await API.post("/track-view", {
      page,
      metier_id: metierId,
      visitor_id: getVisitorId(),
      client_info: buildClientInfo(),
    });
    return response.data;
  } catch (error) {
    trackedPages.delete(page);
    console.error("trackPageView error:", error);
    return null;
  }
};

export const trackMetierSearch = async (metierId, metierLabel) => {
  try {
    const response = await API.post("/track-search", {
      metier_id: metierId,
      metier_label: metierLabel,
      visitor_id: getVisitorId(),
      client_info: buildClientInfo(),
    });
    return response.data;
  } catch (error) {
    console.error("trackMetierSearch error:", error);
    return null;
  }
};

export const getMostSearchedMetiers = async (limit = 10) => {
  const response = await API.get("/top-metiers", { params: { limit } });
  return response.data;
};

export const getMetiersByMention = async (mention) => {
  const response = await API.get("/metiers", {
    params: { mention, limit: 9999 },
  });
  return response.data;
};

export const getAllMentions = async () => {
  const response = await API.get("/mentions", { params: { limit: 9999 } });
  return response.data;
};

export const getDashboardData = async (period = "30j", start = null, end = null) => {
  const params = { period };
  if (period === "custom" && start) params.start = start;
  if (period === "custom" && end) params.end = end;

  const response = await API.get("/dashboard", { params });
  return response.data;
};
