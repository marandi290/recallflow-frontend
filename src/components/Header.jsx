"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Plus, User, LogOut, BookOpen } from "lucide-react";
import { getCurrentUser, setAuthToken, setCurrentUser } from "../lib/api";

export default function Header({
    onOpenAuth,
    onOpenStudyModal,
    onOpenCourseModal,
    onOpenSearch,
    onOpenNotifications,
    notificationCount,
    user: propUser,
    onOpenProfile,
    onLogout: propOnLogout,
}) {
    const [user, setUser] = useState(propUser || null);

    useEffect(() => {
        if (propUser !== undefined) {
            setUser(propUser);
        } else {
            setUser(getCurrentUser());
        }
    }, [propUser]);

    const handleLogout = () => {
        if (propOnLogout) {
            propOnLogout();
        } else {
            setAuthToken(null);
            setCurrentUser(null);
            setUser(null);
            window.location.reload();
        }
    };

    return (
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                    <BookOpen className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        RecallFlow
                    </h1>
                    <p className="text-xs text-slate-400">Spaced Repetition Study Engine</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenSearch}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-slate-400 text-sm px-3 py-1.5 rounded-lg border border-slate-700 transition"
                >
                    <Search className="w-4 h-4 text-slate-400" />
                    <span className="hidden sm:inline">Search courses, topics, notes...</span>
                </button>

                <button
                    onClick={onOpenStudyModal}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-3.5 py-1.5 rounded-lg transition shadow-md shadow-indigo-600/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>Log Session</span>
                </button>

                <button
                    onClick={onOpenCourseModal}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium px-3.5 py-1.5 rounded-lg border border-slate-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden md:inline">Add Course</span>
                </button>

                <button
                    onClick={onOpenNotifications}
                    className="relative p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
                >
                    <Bell className="w-5 h-5" />
                    {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                            {notificationCount}
                        </span>
                    )}
                </button>

                <div className="h-6 w-px bg-slate-800 mx-1" />

                {user ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onOpenProfile}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer group"
                            title="View your profile & learning statistics"
                        >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
                                {user.name?.slice(0, 1).toUpperCase() || "U"}
                            </div>
                            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition">
                                {user.name}
                            </span>
                        </button>
                        <button
                            onClick={handleLogout}
                            title="Log out"
                            className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onOpenAuth}
                        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 font-medium text-sm px-3.5 py-1.5 rounded-lg border border-slate-700 transition"
                    >
                        <User className="w-4 h-4" />
                        <span>Sign In</span>
                    </button>
                )}
            </div>
        </header>
    );
}
