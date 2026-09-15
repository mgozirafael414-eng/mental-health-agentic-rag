// Use Vite's same-origin proxy in development and allow deployments to provide
// their backend URL without changing the existing API route contract.
const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

// ========================================
// HELPER: GET TOKEN
// ========================================

const getToken = () => {
  return localStorage.getItem("mental_health_token");
};

// ========================================
// HELPER: API REQUEST
// ========================================

const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  if (!token && endpoint.startsWith("/admin")) {
    throw new Error("Authentication session is missing. Please log out and log in again.");
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }


  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    const connectionError = new Error(
      "Unable to connect to MindCare. Make sure the backend is running on port 5000 and try again."
    );
    connectionError.cause = error;
    throw connectionError;
  }

  const responseText = await response.text();
  let data = null;

  if (responseText.trim()) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const serverMessage = data?.message || responseText.trim();
    throw new Error(
      serverMessage
        ? `${serverMessage} (HTTP ${response.status})`
        : `MindCare server error (HTTP ${response.status}).`
    );
  }

  if (!data) {
    throw new Error(
      `MindCare returned an invalid response (HTTP ${response.status}). Check that the backend API is running on port 5000.`
    );
  }

  return data;
};

// ========================================
// AUTH
// ========================================

export const loginUser = async (email, password) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  });
};

export const registerUser = async (
  name,
  email,
  password
) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password
    })
  });
};

// ========================================
// CONVERSATIONS
// ========================================

export const createConversation = async (
  title = "New Conversation"
) => {
  return apiRequest("/conversations", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
};

export const getConversations = async ({
  archived = false,
  sort = "newest",
} = {}) => {
  const params = new URLSearchParams();
  params.set("archived", String(archived));
  params.set("sort", sort);
  return apiRequest(`/conversations?${params.toString()}`, {
    method: "GET",
  });
};

export const getConversation = async (conversationId) => {
  return apiRequest(`/conversations/${conversationId}`, {
    method: "GET",
  });
};

export const renameConversation = async (conversationId, title) => {
  return apiRequest(`/conversations/${conversationId}/rename`, {
    method: "PATCH",
    body: JSON.stringify({ title }),
  });
};

export const togglePinConversation = async (conversationId) => {
  return apiRequest(`/conversations/${conversationId}/pin`, {
    method: "PATCH",
  });
};

export const toggleArchiveConversation = async (conversationId) => {
  return apiRequest(`/conversations/${conversationId}/archive`, {
    method: "PATCH",
  });
};

export const clearConversationMessages = async (conversationId) => {
  return apiRequest(`/conversations/${conversationId}/messages`, {
    method: "DELETE",
  });
};

export const deleteConversation = async (conversationId) => {
  return apiRequest(`/conversations/${conversationId}`, {
    method: "DELETE",
  });
};

// ========================================
// CHAT
// ========================================

export const sendChatMessage = async (
  conversationId,
  message
) => {
  return apiRequest(
    `/chat/${conversationId}`,
    {
      method: "POST",
      body: JSON.stringify({
        message
      })
    }
  );
};

// ========================================
// RESOURCES
// ========================================

export const getResources = async ({
  search = "",
  category = "",
  page = 1,
  limit = 9,
} = {}) => {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  params.set("page", String(page));
  params.set("limit", String(limit));

  return apiRequest(`/resources?${params.toString()}`, {
    method: "GET",
  });
};

export const getResource = async (id) => {
  return apiRequest(`/resources/${id}`, {
    method: "GET",
  });
};

export const getResourceCategories = async () => {
  return apiRequest("/resources/categories", {
    method: "GET",
  });
};

export const toggleResourceBookmark = async (id) => {
  return apiRequest(`/resources/${id}/bookmark`, {
    method: "POST",
  });
};

export const getBookmarkedResources = async () => {
  return apiRequest("/resources/bookmarks", {
    method: "GET",
  });
};

export const getRecentlyViewedResources = async (ids) => {
  return apiRequest("/resources/recently-viewed", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
};

// ========================================
// APPOINTMENTS
// ========================================

export const getAppointments = async () => apiRequest("/appointments");
export const createAppointment = async (appointment) => apiRequest("/appointments", {
  method: "POST",
  body: JSON.stringify(appointment),
});
export const getAppointment = async (id) => apiRequest(`/appointments/${id}`);
export const deleteAppointment = async (id) => apiRequest(`/appointments/${id}`, { method: "DELETE" });
export const updateAppointment = async (id, appointment) => apiRequest(`/appointments/${id}`, {
  method: "PATCH",
  body: JSON.stringify(appointment),
});
export const cancelAppointment = async (id) => updateAppointment(id, { status: "Cancelled" });

// ========================================
// NOTIFICATIONS
// ========================================

export const getNotifications = async () => apiRequest("/notifications");
export const getUnreadNotificationCount = async () => apiRequest("/notifications/unread-count");
export const markNotificationRead = async (id) => apiRequest(`/notifications/${id}/read`, { method: "PATCH" });
export const markAllNotificationsRead = async () => apiRequest("/notifications/read-all", { method: "PATCH" });
export const deleteNotification = async (id) => apiRequest(`/notifications/${id}`, { method: "DELETE" });

// ========================================
// SETTINGS / PROFILE
// ========================================

export const getUserProfile = async () => apiRequest("/users/me");
export const updateUserProfile = async (profile) => apiRequest("/users/me", {
  method: "PATCH",
  body: JSON.stringify(profile),
});
export const changeUserPassword = async (currentPassword, newPassword) => apiRequest("/users/me/password", {
  method: "PATCH",
  body: JSON.stringify({ currentPassword, newPassword }),
});
export const updateNotificationPreferences = async (preferences) => apiRequest("/users/me/preferences", {
  method: "PATCH",
  body: JSON.stringify(preferences),
});

// ========================================
// ADMIN / OWNER
// ========================================

export const getAdminDashboard = async () => apiRequest("/admin/dashboard");
export const getAdminUsers = async (params = {}) => apiRequest(`/admin/users?${new URLSearchParams(params).toString()}`);
export const getAdminProfessionals = async (params = {}) => apiRequest(`/admin/professionals?${new URLSearchParams(params).toString()}`);
export const updateAdminUser = async (id, data) => apiRequest(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const getAdminAppointments = async (params = {}) => apiRequest(`/admin/appointments?${new URLSearchParams(params).toString()}`);
export const updateAdminAppointment = async (id, data) => apiRequest(`/admin/appointments/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const getAdminNotifications = async () => apiRequest("/admin/notifications");
export const createAdminNotification = async (data) => apiRequest("/admin/notifications", { method: "POST", body: JSON.stringify(data) });
export const getAuditLogs = async () => apiRequest("/admin/audit-logs");
export const getOwnerAdmins = async () => apiRequest("/admin/owner/admins");
export const createOwnerAdmin = async (userId) => apiRequest("/admin/owner/admins", { method: "POST", body: JSON.stringify({ userId }) });

// PROFESSIONAL
export const getProfessionalOverview = async () => apiRequest("/professional/overview");
export const getProfessionalAppointments = async () => apiRequest("/professional/appointments");
export const updateProfessionalAppointment = async (id, status) => apiRequest(`/professional/appointments/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
export const getProfessionalPatients = async () => apiRequest("/professional/patients");
export const getProfessionalConsultations = async () => apiRequest("/professional/consultations");
export const getProfessionalAvailability = async () => apiRequest("/professional/availability");
export const getProfessionalNotifications = async () => apiRequest("/professional/notifications");

// ========================================
// LOGOUT
// ========================================

export const logoutUser = () => {
  localStorage.removeItem("mental_health_token");
  localStorage.removeItem("mental_health_user");
};

// ========================================
// CURRENT USER
// ========================================

export const getStoredUser = () => {
  const user = localStorage.getItem(
    "mental_health_user"
  );

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

// ========================================
// AUTH CHECK
// ========================================

export const isAuthenticated = () => {
  return Boolean(
    localStorage.getItem("mental_health_token")
  );
};