"use client";

import { LayoutDashboard, BookOpen, Clock, BarChart3, Calendar, Search, Sparkles } from "lucide-react";

export default function MobileNav({ activeTab, setActiveTab }) {
    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "courses", label: "Courses", icon: BookOpen },
        { id: "revisions", label: "Revisions", icon: Clock },
        { id: "ai", label: "AI Flashcards", icon: Sparkles },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "calendar", label: "Calendar", icon: Calendar },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800 py-1 px-2 md:hidden">
            <div className="flex items-center justify-around">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition ${
                                isActive ? "text-indigo-400" : "text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
