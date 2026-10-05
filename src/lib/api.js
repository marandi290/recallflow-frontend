const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("recallflow_token");
    }
    return null;
};

export const setAuthToken = (token) => {
    if (typeof window !== "undefined") {
        if (token) {
            localStorage.setItem("recallflow_token", token);
        } else {
            localStorage.removeItem("recallflow_token");
        }
    }
};

export const getCurrentUser = () => {
    if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("recallflow_user");
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            return null;
        }
    }
    return null;
};

export const setCurrentUser = (user) => {
    if (typeof window !== "undefined") {
        if (user) {
            localStorage.setItem("recallflow_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("recallflow_user");
        }
    }
};

const request = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const token = getAuthToken();

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
    };

    if (config.body && typeof config.body === "object") {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Request failed with status ${response.status}`);
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const api = {
    // Auth
    register: (userData) => request("/auth/register", { method: "POST", body: userData }),
    login: (credentials) => request("/auth/login", { method: "POST", body: credentials }),
    getProfile: () => request("/auth/me"),

    // Courses
    getCourses: (userId) => request(`/courses?user_id=${userId}`),
    getCourseById: (courseId) => request(`/courses/${courseId}`),
    createCourse: (courseData) => request("/courses", { method: "POST", body: courseData }),
    updateCourse: (courseId, updateData) => request(`/courses/${courseId}`, { method: "PUT", body: updateData }),
    deleteCourse: (courseId) => request(`/courses/${courseId}`, { method: "DELETE" }),

    // Topics
    getTopics: (courseId) => request(`/topics?course_id=${courseId}`),
    getTopicById: (topicId) => request(`/topics/${topicId}`),
    createTopic: (topicData) => request("/topics", { method: "POST", body: topicData }),
    updateTopic: (topicId, updateData) => request(`/topics/${topicId}`, { method: "PUT", body: updateData }),
    deleteTopic: (topicId) => request(`/topics/${topicId}`, { method: "DELETE" }),

    // Study Entries
    getStudyEntries: (topicId) => request(`/study-entries?topic_id=${topicId}`),
    getStudyEntryById: (entryId) => request(`/study-entries/${entryId}`),
    createStudyEntry: (entryData) => request("/study-entries", { method: "POST", body: entryData }),
    updateStudyEntry: (entryId, updateData) => request(`/study-entries/${entryId}`, { method: "PUT", body: updateData }),
    deleteStudyEntry: (entryId) => request(`/study-entries/${entryId}`, { method: "DELETE" }),

    // Revisions
    getTodayRevisions: (userId) => request(`/revisions/today?user_id=${userId}`),
    getUpcomingRevisions: (userId) => request(`/revisions/upcoming?user_id=${userId}`),
    getMissedRevisions: (userId) => request(`/revisions/missed?user_id=${userId}`),
    getRevisionById: (revisionId) => request(`/revisions/${revisionId}`),
    completeRevision: (revisionId, notesData) => request(`/revisions/${revisionId}/complete`, { method: "PATCH", body: notesData }),

    // Dashboard
    getTodayDashboard: (userId) => request(`/dashboard/today?user_id=${userId}`),

    // Analytics
    getAnalyticsOverview: (userId) => request(`/analytics/overview?user_id=${userId}`),
    getWeeklyAnalytics: (userId) => request(`/analytics/weekly?user_id=${userId}`),
    getMonthlyAnalytics: (userId) => request(`/analytics/monthly?user_id=${userId}`),

    // Calendar
    getCalendar: (userId, year, month) => request(`/calendar?user_id=${userId}&year=${year}&month=${month}`),

    // Search
    search: (userId, query) => request(`/search?user_id=${userId}&q=${encodeURIComponent(query)}`),

    // Notifications
    getNotifications: (userId) => request(`/notifications?user_id=${userId}`),

    // AI Features (Phase 14)
    generateFlashcards: (data) => request("/ai/flashcards", { method: "POST", body: data }),
    generateQuiz: (data) => request("/ai/quiz", { method: "POST", body: data }),
    generateSummary: (data) => request("/ai/summary", { method: "POST", body: data }),

    // Data Backup & Restore (Phase 14)
    exportData: (userId) => request(`/data/export?user_id=${userId}`),
    importData: (userId, backupPayload) => request(`/data/import?user_id=${userId}`, { method: "POST", body: backupPayload }),

    // Payments & Subscriptions (Rs. 5/month Paywall)
    getSubscriptionStatus: (userId) => request(`/payments/status?userId=${userId}`),
    createPaymentOrder: (userId) => request("/payments/create-order", { method: "POST", body: { userId } }),
    verifyPayment: (userId, paymentData) => request("/payments/verify", { method: "POST", body: { userId, ...paymentData } }),
    getPaymentHistory: (userId) => request(`/payments/history?userId=${userId}`),
};
