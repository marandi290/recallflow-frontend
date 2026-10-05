"use client";

import { LayoutDashboard, BookOpen, Clock, Calendar, BarChart3, Search, Sparkles } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, user, onOpenProfile }) {
    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "courses", label: "Courses & Topics", icon: BookOpen },
        { id: "revisions", label: "Revision Manager", icon: Clock },
        { id: "ai", label: "AI Flashcards & Quiz", icon: Sparkles },
        { id: "analytics", label: "Analytics & Streaks", icon: BarChart3 },
        { id: "calendar", label: "Monthly Calendar", icon: Calendar },
        { id: "search", label: "Global Search", icon: Search },
    ];

    return (
        <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
            <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
                    Navigation
                </p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                                isActive
                                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-sm"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="space-y-3">
                {user && (
                    <button
                        onClick={onOpenProfile}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/40 transition text-left cursor-pointer group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
                            {user.name?.slice(0, 1).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                                {user.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                        </div>
                    </button>
                )}

                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-300">RecallFlow Spaced Engine</p>
                    <p>Algorithms: Quick, 3-Mo, 6-Mo, 1-Yr, 2-Yr</p>
                    <div className="pt-1.5 flex items-center justify-between text-[11px] text-indigo-400 font-medium">
                        <span>API: Connected</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                </div>
            </div>
        </aside>
    );
}
