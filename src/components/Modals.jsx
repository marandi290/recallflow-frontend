"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, Bell, AlertTriangle, BookOpen, Layers, Plus, User, Mail, Calendar, Flame, Clock, LogOut, Shield, Sparkles, Zap } from "lucide-react";
import { api } from "../lib/api";
import { loadRazorpayScript } from "../lib/razorpay";

// Modal Wrapper
function ModalWrapper({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] my-auto animate-in fade-in zoom-in duration-200">
                <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between shrink-0">
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 transition cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">{children}</div>
            </div>
        </div>
    );
}

// Log Study Session Modal
export function StudyLoggerModal({ isOpen, onClose, courses, topicsMap, onSubmit }) {
    const [courseId, setCourseId] = useState("");
    const [topicId, setTopicId] = useState("");
    const [durationMinutes, setDurationMinutes] = useState(45);
    const [difficulty, setDifficulty] = useState("medium");
    const [studyNotes, setStudyNotes] = useState("");
    const [studyDate, setStudyDate] = useState(new Date().toISOString().split("T")[0]);

    useEffect(() => {
        if (courses.length > 0 && !courseId) {
            setCourseId(courses[0].id);
        }
    }, [courses, courseId]);

    const availableTopics = topicsMap[courseId] || [];

    useEffect(() => {
        if (availableTopics.length > 0) {
            setTopicId(availableTopics[0].id);
        } else {
            setTopicId("");
        }
    }, [courseId, availableTopics]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!topicId) return alert("Please select or create a topic first.");
        onSubmit({
            topic_id: Number(topicId),
            study_date: studyDate,
            duration_minutes: Number(durationMinutes),
            difficulty,
            study_notes: studyNotes,
        });
        onClose();
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Log Study Session">
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Course</label>
                    <select
                        value={courseId}
                        onChange={(e) => setCourseId(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                    >
                        {courses.map((c) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Topic</label>
                    {availableTopics.length === 0 ? (
                        <p className="text-xs text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                            No topics found for this course. Please add a topic first.
                        </p>
                    ) : (
                        <select
                            value={topicId}
                            onChange={(e) => setTopicId(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                        >
                            {availableTopics.map((t) => (
                                <option key={t.id} value={t.id}>{t.title}</option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Duration (minutes)</label>
                        <input
                            type="number"
                            min="1"
                            value={durationMinutes}
                            onChange={(e) => setDurationMinutes(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Difficulty</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Study Date</label>
                    <input
                        type="date"
                        value={studyDate}
                        onChange={(e) => setStudyDate(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Study Notes (optional)</label>
                    <textarea
                        rows="3"
                        value={studyNotes}
                        onChange={(e) => setStudyNotes(e.target.value)}
                        placeholder="Key concepts learned, flashcard notes, or summary..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                    />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!topicId}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-medium shadow-md shadow-indigo-600/20"
                    >
                        Save & Auto-Schedule Revisions
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
}

// Create Course Modal
export function CourseModal({ isOpen, onClose, onSubmit, userId }) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Computer Science");
    const [goal, setGoal] = useState("");
    const [durationDays, setDurationDays] = useState(90);
    const [algorithm, setAlgorithm] = useState("three_month");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            user_id: userId,
            title,
            category,
            goal,
            duration_days: Number(durationDays),
            algorithm,
            start_date: new Date().toISOString().split("T")[0],
        });
        onClose();
        setTitle("");
        setGoal("");
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Create New Study Course">
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Course Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. System Design & Distributed Systems"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Category"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Target Duration (days)</label>
                        <input
                            type="number"
                            value={durationDays}
                            onChange={(e) => setDurationDays(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Spaced Repetition Algorithm Strategy</label>
                    <select
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none font-medium"
                    >
                        <option value="quick">Quick Course (1, 3, 7 days)</option>
                        <option value="three_month">Three Month Standard (3, 7, 15, 30, 60 days)</option>
                        <option value="six_month">Six Month Mastery (3, 7, 15, 30, 60, 120, 180 days)</option>
                        <option value="one_year">One Year Mastery (Up to 365 days)</option>
                        <option value="two_year">Two Year Deep Retention (Up to 730 days)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Course Goal / Objective (optional)</label>
                    <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g. Pass senior backend interviews"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                    />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-md"
                    >
                        Create Course
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
}

// Add Topic Modal
export function TopicModal({ isOpen, onClose, onSubmit, courseId }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            course_id: courseId,
            title,
            description,
        });
        onClose();
        setTitle("");
        setDescription("");
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Add Topic to Course">
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Topic Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Express Router & Sub-routers"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Description (optional)</label>
                    <textarea
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Key subtopics or overview notes..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                    />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-md"
                    >
                        Add Topic
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
}

// Complete Revision Modal
export function CompleteRevisionModal({ isOpen, onClose, onSubmit, revisionId }) {
    const [revisionNotes, setRevisionNotes] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(revisionId, { revision_notes: revisionNotes });
        onClose();
        setRevisionNotes("");
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Complete Spaced Revision">
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <p className="text-xs text-slate-400">
                    Mark this revision session as completed and add optional notes on your recall quality.
                </p>

                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Revision Notes (optional)</label>
                    <textarea
                        rows="3"
                        value={revisionNotes}
                        onChange={(e) => setRevisionNotes(e.target.value)}
                        placeholder="e.g. Recalled 90% of concepts easily, reviewed flashcard #4..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                    />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium shadow-md"
                    >
                        Mark Revision Done
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
}

// Auth Modal
export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = isLogin
                ? await api.login({ email, password })
                : await api.register({ name, email, password });

            onAuthSuccess(data.data);
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title={isLogin ? "Sign In to RecallFlow" : "Create Account"}>
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                        {error}
                    </div>
                )}

                {!isLogin && (
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Prakash"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                            required
                        />
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="prakash@example.com"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                        required
                    />
                </div>

                <div className="pt-2 space-y-3">
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-md shadow-indigo-600/20"
                    >
                        {isLogin ? "Sign In" : "Create Account"}
                    </button>
                    <p className="text-center text-xs text-slate-400">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-indigo-400 hover:underline font-semibold"
                        >
                            {isLogin ? "Register" : "Sign In"}
                        </button>
                    </p>
                </div>
            </form>
        </ModalWrapper>
    );
}

// Notifications Modal
export function NotificationsModal({ isOpen, onClose, notificationsData }) {
    if (!isOpen) return null;

    const list = notificationsData?.notifications || [];

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Daily Notifications & Reminders">
            <div className="space-y-3 text-sm max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                {list.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <Bell className="w-10 h-10 mx-auto mb-2 text-slate-700" />
                        <p>No notifications for today!</p>
                    </div>
                ) : (
                    list.map((n) => (
                        <div
                            key={n.id}
                            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                                n.severity === "warning" ? "bg-amber-500/10 border-amber-500/20 text-amber-300" :
                                "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                            }`}
                        >
                            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-white text-xs">{n.title}</h4>
                                <p className="text-xs text-slate-300 mt-0.5">{n.message}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </ModalWrapper>
    );
}

// User Profile Modal
export function UserProfileModal({
    isOpen,
    onClose,
    user,
    analytics,
    coursesCount,
    subscriptionStatus,
    onOpenPaywall,
    onLogout,
}) {
    if (!isOpen || !user) return null;

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const formattedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "Active Member";

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="User Profile">
            <div className="space-y-6">
                {/* Profile Header Card */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-800/60 to-slate-900 border border-slate-800">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-600/30 shrink-0">
                        {getInitials(user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white truncate">{user.name}</h3>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Active
                            </span>
                        </div>
                        <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1 truncate">
                            <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            {user.email}
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            Joined {formattedDate}
                        </p>
                    </div>
                </div>

                {/* Subscription Tier Card */}
                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            Subscription Status
                        </span>
                        {subscriptionStatus?.isSubscriptionActive ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Pro Active (₹5/mo)
                            </span>
                        ) : subscriptionStatus?.isTrialActive ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Free Trial ({subscriptionStatus?.daysRemainingInTrial} days left)
                            </span>
                        ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                Trial Expired
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>
                            {subscriptionStatus?.isSubscriptionActive && subscriptionStatus?.subscriptionEndsAt
                                ? `Valid until: ${new Date(subscriptionStatus.subscriptionEndsAt).toLocaleDateString()}`
                                : subscriptionStatus?.trialEndsAt
                                ? `Trial ends: ${new Date(subscriptionStatus.trialEndsAt).toLocaleDateString()}`
                                : "Rs. 5/month"}
                        </span>
                        <button
                            onClick={() => {
                                onClose();
                                if (onOpenPaywall) onOpenPaywall();
                            }}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 cursor-pointer"
                        >
                            {subscriptionStatus?.isSubscriptionActive ? "Extend (+30d)" : "Upgrade for ₹5"}
                        </button>
                    </div>
                </div>

                {/* Learning Stats Grid */}
                <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                        Learning Overview
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                                <Flame className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400">Current Streak</p>
                                <p className="text-sm font-bold text-white">
                                    {analytics?.learningStreakDays || 0} <span className="text-[10px] text-slate-400 font-normal">days</span>
                                </p>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400">Courses</p>
                                <p className="text-sm font-bold text-white">
                                    {coursesCount || 0} <span className="text-[10px] text-slate-400 font-normal">active</span>
                                </p>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400">Revisions Done</p>
                                <p className="text-sm font-bold text-white">
                                    {analytics?.completedRevisionsCount || 0} <span className="text-[10px] text-slate-400 font-normal">reviewed</span>
                                </p>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400">Study Time</p>
                                <p className="text-sm font-bold text-white">
                                    {analytics?.totalStudyHours || 0} <span className="text-[10px] text-slate-400 font-normal">hrs</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Details */}
                <div className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-indigo-400" />
                            Authentication
                        </span>
                        <span className="text-slate-300 font-medium">JWT Secure Session</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                        <span>User ID</span>
                        <span className="font-mono text-slate-300">#{user.id}</span>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition cursor-pointer"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
}

// Paywall & Razorpay Checkout Modal
export function PaywallModal({
    isOpen,
    onClose,
    user,
    subscriptionStatus,
    onSubscriptionSuccess,
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const isExpired = subscriptionStatus?.plan === "expired";
    const daysLeft = subscriptionStatus?.daysRemainingInTrial || 0;

    const handlePayment = async () => {
        setLoading(true);
        setError(null);
        try {
            await loadRazorpayScript();
            const userId = user?.id || 1;
            const res = await api.createPaymentOrder(userId, { amount: 500, currency: "INR" });
            const orderData = res.data || res;

            if (typeof window === "undefined" || !window.Razorpay) {
                throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
            }

            const options = {
                key: orderData.key_id || orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TkA6xE3MDke4M1",
                amount: orderData.amount, // in paise (e.g. 500 paise = Rs. 5)
                currency: orderData.currency || "INR",
                name: "RecallFlow Pro",
                description: "Monthly Study Subscription - Rs. 5/month",
                order_id: orderData.order_id || orderData.orderId,
                handler: async function (response) {
                    try {
                        const verifyRes = await api.verifyPayment(userId, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        if (onSubscriptionSuccess) onSubscriptionSuccess(verifyRes.data);
                        alert("🎉 Payment successful! RecallFlow Pro subscription is now active.");
                        onClose();
                    } catch (verifyErr) {
                        setError(verifyErr.message || "Payment verification failed");
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user?.name || "Student",
                    email: user?.email || "student@recallflow.com",
                },
                notes: {
                    userId: String(userId),
                    plan: "monthly_rs_5",
                },
                theme: {
                    color: "#4f46e5",
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (resp) {
                setError(resp.error?.description || "Payment failed or was cancelled.");
                setLoading(false);
            });
            rzp.open();
        } catch (err) {
            setError(err.message || "Unable to initiate payment");
            setLoading(false);
        }
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="RecallFlow Pro Subscription">
            <div className="space-y-6">
                {/* Hero / Pricing Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 border border-indigo-500/30 p-5 text-center shadow-lg">
                    <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-indigo-500/20 blur-xl pointer-events-none" />
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        PREMIUM STUDY ENGINE
                    </span>
                    <h3 className="text-3xl font-black text-white">
                        ₹5 <span className="text-sm font-normal text-slate-400">/ month</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                        Only Rs. 5 per month. Cancel or renew anytime.
                    </p>
                </div>

                {/* Status Notice */}
                {isExpired ? (
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                        <div>
                            <p className="font-semibold text-rose-200">7-Day Free Trial Expired</p>
                            <p className="mt-0.5 text-rose-300/90">
                                Your free trial has completed. Subscribe to unlock courses, revision schedules, and AI tools.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
                        <Clock className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
                        <div>
                            <p className="font-semibold text-indigo-200">
                                {daysLeft > 0 ? `${daysLeft} Days Left in Free Trial` : "Free Trial Active"}
                            </p>
                            <p className="mt-0.5 text-indigo-300/90">
                                Upgrade to Pro early to lock in your spaced repetition streak without interruptions.
                            </p>
                        </div>
                    </div>
                )}

                {/* Features List */}
                <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Everything Included in Pro:
                    </p>
                    <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2.5 text-slate-200">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-3.5 h-3.5" />
                            </div>
                            <span><strong>Unlimited Courses & Topics:</strong> Add as many study subjects as you need</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-200">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-3.5 h-3.5" />
                            </div>
                            <span><strong>5 Spaced Algorithms:</strong> Quick, 3-Month, 6-Month, 1-Year & 2-Year</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-200">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-3.5 h-3.5" />
                            </div>
                            <span><strong>AI Flashcards & Quizzes:</strong> Instant memory testing on your notes</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-200">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-3.5 h-3.5" />
                            </div>
                            <span><strong>Retention Analytics & Streaks:</strong> Track study hours & review performance</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-200">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-3.5 h-3.5" />
                            </div>
                            <span><strong>Automated Reminders:</strong> Missed revision tracking & daily schedule</span>
                        </div>
                    </div>
                </div>

                {/* Supported Payment Channels */}
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-300">
                        <Shield className="w-3.5 h-3.5 text-indigo-400" />
                        Secured by Razorpay
                    </span>
                    <span>UPI • Cards • NetBanking</span>
                </div>

                {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                        {error}
                    </div>
                )}

                {/* Pay Action Button */}
                <div className="space-y-2 pt-1">
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                    >
                        <Zap className="w-4 h-4 fill-white" />
                        {loading ? "Processing..." : "Pay ₹5 with Razorpay"}
                    </button>
                    <p className="text-[10px] text-center text-slate-500">
                        Instant activation. 100% money back guarantee if not satisfied.
                    </p>
                </div>
            </div>
        </ModalWrapper>
    );
}
