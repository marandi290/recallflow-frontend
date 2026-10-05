"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, Bell, AlertTriangle, BookOpen, Layers, Plus } from "lucide-react";
import { api } from "../lib/api";

// Modal Wrapper
function ModalWrapper({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
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
