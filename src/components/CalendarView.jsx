"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export default function CalendarView({ calendarData, onMonthChange }) {
    const today = new Date();
    const [year, setYear] = useState(calendarData?.year || today.getFullYear());
    const [month, setMonth] = useState(calendarData?.month || today.getMonth() + 1);

    const handlePrevMonth = () => {
        let newMonth = month - 1;
        let newYear = year;
        if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        }
        setMonth(newMonth);
        setYear(newYear);
        onMonthChange(newYear, newMonth);
    };

    const handleNextMonth = () => {
        let newMonth = month + 1;
        let newYear = year;
        if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        }
        setMonth(newMonth);
        setYear(newYear);
        onMonthChange(newYear, newMonth);
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const days = calendarData?.days || [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Monthly Calendar Grid</h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Comprehensive calendar overview of study sessions and spaced revisions.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
                    <button
                        onClick={handlePrevMonth}
                        className="text-slate-400 hover:text-white p-1 transition"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold text-slate-200 min-w-[120px] text-center">
                        {monthNames[month - 1]} {year}
                    </span>
                    <button
                        onClick={handleNextMonth}
                        className="text-slate-400 hover:text-white p-1 transition"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {days.map((dayObj, idx) => {
                        const dayNum = new Date(dayObj.date).getDate();
                        const hasActivity = dayObj.studyEntriesCount > 0 || dayObj.revisionsCount > 0;

                        return (
                            <div
                                key={idx}
                                className={`min-h-[90px] p-2 rounded-xl border transition flex flex-col justify-between ${
                                    hasActivity
                                        ? "bg-slate-800/60 border-slate-700/80 hover:border-indigo-500"
                                        : "bg-slate-900/40 border-slate-800/60 text-slate-600"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-bold ${hasActivity ? "text-white" : "text-slate-500"}`}>
                                        {dayNum}
                                    </span>
                                    {dayObj.studyMinutes > 0 && (
                                        <span className="text-[10px] font-medium text-indigo-400">
                                            {dayObj.studyMinutes}m
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-1 my-1">
                                    {dayObj.completedRevisionsCount > 0 && (
                                        <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                            <CheckCircle className="w-3 h-3" />
                                            <span>{dayObj.completedRevisionsCount} Done</span>
                                        </div>
                                    )}
                                    {dayObj.missedRevisionsCount > 0 && (
                                        <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                            <AlertTriangle className="w-3 h-3" />
                                            <span>{dayObj.missedRevisionsCount} Missed</span>
                                        </div>
                                    )}
                                    {dayObj.pendingRevisionsCount > 0 && (
                                        <div className="flex items-center gap-1 text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                            <Clock className="w-3 h-3" />
                                            <span>{dayObj.pendingRevisionsCount} Due</span>
                                        </div>
                                    )}
                                </div>

                                {dayObj.studyEntriesCount > 0 && (
                                    <div className="text-[10px] text-slate-400 font-medium truncate">
                                        {dayObj.studyEntriesCount} study session(s)
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
