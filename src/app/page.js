"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DashboardView from "../components/DashboardView";
import CoursesView from "../components/CoursesView";
import RevisionsView from "../components/RevisionsView";
import AnalyticsView from "../components/AnalyticsView";
import CalendarView from "../components/CalendarView";
import SearchView from "../components/SearchView";
import FlashcardQuizView from "../components/FlashcardQuizView";
import {
    StudyLoggerModal,
    CourseModal,
    TopicModal,
    CompleteRevisionModal,
    AuthModal,
    NotificationsModal,
    UserProfileModal,
    PaywallModal,
} from "../components/Modals";
import MobileNav from "../components/MobileNav";

import { api, getCurrentUser, setAuthToken, setCurrentUser } from "../lib/api";

export default function Home() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(1); // Default user ID for single-user MVP

    // Data States
    const [courses, setCourses] = useState([]);
    const [topicsMap, setTopicsMap] = useState({});
    const [dashboardData, setDashboardData] = useState(null);
    const [todayRevisions, setTodayRevisions] = useState([]);
    const [upcomingRevisions, setUpcomingRevisions] = useState([]);
    const [missedRevisions, setMissedRevisions] = useState([]);
    const [analyticsOverview, setAnalyticsOverview] = useState(null);
    const [analyticsWeekly, setAnalyticsWeekly] = useState([]);
    const [analyticsMonthly, setAnalyticsMonthly] = useState([]);
    const [calendarData, setCalendarData] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [notificationsData, setNotificationsData] = useState(null);

    // Modal States
    const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [activeCourseForTopic, setActiveCourseForTopic] = useState(null);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [activeRevisionId, setActiveRevisionId] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isPaywallOpen, setIsPaywallOpen] = useState(false);
    const [subscriptionStatus, setSubscriptionStatus] = useState(null);

    // Load User
    useEffect(() => {
        const storedUser = getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
            setUserId(storedUser.id);
        }
    }, []);

    // Fetch All Data
    const loadAllData = useCallback(async () => {
        try {
            const [
                coursesRes,
                dashRes,
                todayRevRes,
                upRevRes,
                missedRevRes,
                anaOverRes,
                anaWeekRes,
                anaMonthRes,
                calRes,
                notifRes,
                subRes,
            ] = await Promise.allSettled([
                api.getCourses(userId),
                api.getTodayDashboard(userId),
                api.getTodayRevisions(userId),
                api.getUpcomingRevisions(userId),
                api.getMissedRevisions(userId),
                api.getAnalyticsOverview(userId),
                api.getWeeklyAnalytics(userId),
                api.getMonthlyAnalytics(userId),
                api.getCalendar(userId, new Date().getFullYear(), new Date().getMonth() + 1),
                api.getNotifications(userId),
                api.getSubscriptionStatus(userId),
            ]);

            if (coursesRes.status === "fulfilled") {
                const fetchedCourses = coursesRes.value.data || [];
                setCourses(fetchedCourses);

                // Fetch topics for each course
                const tMap = {};
                for (const c of fetchedCourses) {
                    try {
                        const topRes = await api.getTopics(c.id);
                        tMap[c.id] = topRes.data || [];
                    } catch (e) {
                        tMap[c.id] = [];
                    }
                }
                setTopicsMap(tMap);
            }

            const defaultDashboard = {
                todayStudyEntriesCount: 0,
                todayRevisionsCount: 0,
                pendingRevisionsCount: 0,
                missedRevisionsCount: 0,
                upcomingRevisionsCount: 0,
                dailyStudyTimeMinutes: 0,
                todayStudyEntries: [],
                todayRevisions: [],
            };
            setDashboardData(
                dashRes.status === "fulfilled" && dashRes.value?.data
                    ? dashRes.value.data
                    : defaultDashboard
            );

            if (todayRevRes.status === "fulfilled") setTodayRevisions(todayRevRes.value.data || []);
            if (upRevRes.status === "fulfilled") setUpcomingRevisions(upRevRes.value.data || []);
            if (missedRevRes.status === "fulfilled") setMissedRevisions(missedRevRes.value.data || []);

            const defaultAnalytics = {
                totalCourses: 0,
                completedCourses: 0,
                totalTopics: 0,
                totalStudyHours: 0,
                totalStudyMinutes: 0,
                learningStreakDays: 0,
                completedRevisionsCount: 0,
                missedRevisionsCount: 0,
                revisionCompletionRate: 0,
                missedRevisionRate: 0,
            };
            setAnalyticsOverview(
                anaOverRes.status === "fulfilled" && anaOverRes.value?.data
                    ? anaOverRes.value.data
                    : defaultAnalytics
            );

            if (anaWeekRes.status === "fulfilled") setAnalyticsWeekly(anaWeekRes.value.data || []);
            if (anaMonthRes.status === "fulfilled") setAnalyticsMonthly(anaMonthRes.value.data || []);
            if (calRes.status === "fulfilled") setCalendarData(calRes.value.data);
            if (notifRes.status === "fulfilled") setNotificationsData(notifRes.value.data);
            if (subRes && subRes.status === "fulfilled" && subRes.value?.data) {
                const subData = subRes.value.data;
                setSubscriptionStatus(subData);
                if (subData.plan === "expired") {
                    setIsPaywallOpen(true);
                }
            }
        } catch (error) {
            console.error("Error loading RecallFlow backend data:", error);
        }
    }, [userId]);

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    // Handlers
    const handleCreateCourse = async (courseData) => {
        try {
            await api.createCourse(courseData);
            await loadAllData();
        } catch (err) {
            alert(err.message || "Failed to create course");
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!confirm("Are you sure you want to delete this course and all its topics?")) return;
        try {
            await api.deleteCourse(courseId);
            await loadAllData();
        } catch (err) {
            alert(err.message || "Failed to delete course");
        }
    };

    const handleCreateTopic = async (topicData) => {
        try {
            await api.createTopic(topicData);
            await loadAllData();
        } catch (err) {
            alert(err.message || "Failed to create topic");
        }
    };

    const handleDeleteTopic = async (topicId) => {
        if (!confirm("Are you sure you want to delete this topic?")) return;
        try {
            await api.deleteTopic(topicId);
            await loadAllData();
        } catch (err) {
            alert(err.message || "Failed to delete topic");
        }
    };

    const handleCreateStudyEntry = async (entryData) => {
        try {
            await api.createStudyEntry(entryData);
            await loadAllData();
        } catch (err) {
            alert(err.message || "Failed to log study session");
        }
    };

    const handleCompleteRevision = async (revisionId, notesData) => {
        try {
            await api.completeRevision(revisionId, notesData);
            await loadAllData();
        } catch (err) {
            alert(err.message || "Failed to complete revision");
        }
    };

    const handleSearch = async (query) => {
        try {
            const res = await api.search(userId, query);
            setSearchResults(res.data);
            setActiveTab("search");
        } catch (err) {
            alert(err.message || "Search failed");
        }
    };

    const handleCalendarMonthChange = async (year, month) => {
        try {
            const res = await api.getCalendar(userId, year, month);
            setCalendarData(res.data);
        } catch (err) {
            console.error("Failed to load calendar for month:", err);
        }
    };

    const handleAuthSuccess = (authData) => {
        setAuthToken(authData.token);
        setCurrentUser(authData.user);
        setUser(authData.user);
        setUserId(authData.user.id);
    };

    const handleLogout = () => {
        setAuthToken(null);
        setCurrentUser(null);
        setUser(null);
        setUserId(1);
        setIsProfileModalOpen(false);
        window.location.reload();
    };

    const guardPaywall = (action) => {
        if (subscriptionStatus?.plan === "expired") {
            setIsPaywallOpen(true);
            return;
        }
        action();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Header
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onOpenStudyModal={() => guardPaywall(() => setIsStudyModalOpen(true))}
                onOpenCourseModal={() => guardPaywall(() => setIsCourseModalOpen(true))}
                onOpenSearch={() => setActiveTab("search")}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                notificationCount={notificationsData?.unreadCount || 0}
                user={user}
                subscriptionStatus={subscriptionStatus}
                onOpenProfile={() => setIsProfileModalOpen(true)}
                onOpenPaywall={() => setIsPaywallOpen(true)}
                onLogout={handleLogout}
            />

            <div className="flex flex-1">
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    user={user}
                    subscriptionStatus={subscriptionStatus}
                    onOpenProfile={() => setIsProfileModalOpen(true)}
                    onOpenPaywall={() => setIsPaywallOpen(true)}
                />

                <main className="flex-1 p-6 lg:p-8 max-w-7xl">
                    {activeTab === "dashboard" && (
                        <DashboardView
                            dashboardData={dashboardData}
                            onCompleteRevision={(revId) => {
                                guardPaywall(() => {
                                    setActiveRevisionId(revId);
                                    setIsCompleteModalOpen(true);
                                });
                            }}
                            onOpenStudyModal={() => guardPaywall(() => setIsStudyModalOpen(true))}
                            onOpenCourseModal={() => guardPaywall(() => setIsCourseModalOpen(true))}
                        />
                    )}

                    {activeTab === "courses" && (
                        <CoursesView
                            courses={courses}
                            topicsMap={topicsMap}
                            onOpenCourseModal={() => setIsCourseModalOpen(true)}
                            onOpenTopicModal={(courseId) => {
                                setActiveCourseForTopic(courseId);
                                setIsTopicModalOpen(true);
                            }}
                            onDeleteCourse={handleDeleteCourse}
                            onDeleteTopic={handleDeleteTopic}
                        />
                    )}

                    {activeTab === "revisions" && (
                        <RevisionsView
                            todayRevisions={todayRevisions}
                            upcomingRevisions={upcomingRevisions}
                            missedRevisions={missedRevisions}
                            onCompleteRevision={(revId) => {
                                setActiveRevisionId(revId);
                                setIsCompleteModalOpen(true);
                            }}
                        />
                    )}

                    {activeTab === "ai" && (
                        <FlashcardQuizView
                            userId={userId}
                            courses={courses}
                            topicsMap={topicsMap}
                        />
                    )}

                    {activeTab === "analytics" && (
                        <AnalyticsView
                            overview={analyticsOverview}
                            weekly={analyticsWeekly}
                            monthly={analyticsMonthly}
                        />
                    )}

                    {activeTab === "calendar" && (
                        <CalendarView
                            calendarData={calendarData}
                            onMonthChange={handleCalendarMonthChange}
                        />
                    )}

                    {activeTab === "search" && (
                        <SearchView
                            onSearch={handleSearch}
                            searchResults={searchResults}
                        />
                    )}
                </main>
            </div>

            {/* Modals */}
            <StudyLoggerModal
                isOpen={isStudyModalOpen}
                onClose={() => setIsStudyModalOpen(false)}
                courses={courses}
                topicsMap={topicsMap}
                onSubmit={handleCreateStudyEntry}
            />

            <CourseModal
                isOpen={isCourseModalOpen}
                onClose={() => setIsCourseModalOpen(false)}
                onSubmit={handleCreateCourse}
                userId={userId}
            />

            <TopicModal
                isOpen={isTopicModalOpen}
                onClose={() => setIsTopicModalOpen(false)}
                onSubmit={handleCreateTopic}
                courseId={activeCourseForTopic}
            />

            <CompleteRevisionModal
                isOpen={isCompleteModalOpen}
                onClose={() => setIsCompleteModalOpen(false)}
                onSubmit={handleCompleteRevision}
                revisionId={activeRevisionId}
            />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onAuthSuccess={handleAuthSuccess}
            />

            <NotificationsModal
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                notificationsData={notificationsData}
            />

            <UserProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={user}
                analytics={analyticsOverview}
                coursesCount={courses.length}
                subscriptionStatus={subscriptionStatus}
                onOpenPaywall={() => setIsPaywallOpen(true)}
                onLogout={handleLogout}
            />

            <PaywallModal
                isOpen={isPaywallOpen}
                onClose={() => setIsPaywallOpen(false)}
                user={user}
                subscriptionStatus={subscriptionStatus}
                onSubscriptionSuccess={(newSub) => {
                    setSubscriptionStatus(newSub);
                    loadAllData();
                }}
            />

            <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}
