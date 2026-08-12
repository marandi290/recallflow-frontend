"use client";

import { BarChart3, Flame, Award, Clock, CheckCircle, Percent, Calendar } from "lucide-react";

export default function AnalyticsView({ overview, weekly, monthly }) {
    if (!overview) {
        return (
            <div className="p-8 text-center text-slate-400">
                <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p>Loading Analytics...</p>
            </div>
        );
    }

    const {
        totalCourses,
        completedCourses,
        totalTopics,
        totalStudyHours,
        totalStudyMinutes,
        learningStreakDays,
        completedRevisionsCount,
        missedRevisionsCount,
        revisionCompletionRate,
        missedRevisionRate,
    } = overview;

    const maxWeeklyMinutes = Math.max(...(weekly || []).map((d) => d.studyMinutes || 0), 60);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Analytics & Learning Streaks</h2>
                <p className="text-sm text-slate-400 mt-1">
                    Visual insights into your learning habits, retention rates, and daily consistency.
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                        <Flame className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Learning Streak</p>
                        <h3 className="text-2xl font-bold text-white">{learningStreakDays} <span className="text-sm font-normal text-slate-400">days</span></h3>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Study Time</p>
                        <h3 className="text-2xl font-bold text-white">{totalStudyHours} <span className="text-sm font-normal text-slate-400">hrs</span></h3>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Percent className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Completion Rate</p>
                        <h3 className="text-2xl font-bold text-white">{revisionCompletionRate}%</h3>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Courses Finished</p>
                        <h3 className="text-2xl font-bold text-white">{completedCourses} / {totalCourses}</h3>
                    </div>
                </div>
            </div>

            {/* 7-Day Weekly Breakdown Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">7-Day Study Minutes Breakdown</h3>
                        <p className="text-xs text-slate-400">Daily study duration over the past week</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Weekly Total: {(weekly || []).reduce((s, d) => s + d.studyMinutes, 0)} mins
                    </span>
                </div>

                <div className="h-48 flex items-end justify-between gap-2 pt-6 px-4">
                    {(weekly || []).map((day, idx) => {
                        const heightPct = Math.round((day.studyMinutes / maxWeeklyMinutes) * 100);
                        const dayLabel = new Date(day.date).toLocaleDateString("en-US", { weekday: "short" });

                        return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition">
                                    {day.studyMinutes}m
                                </div>
                                <div
                                    style={{ height: `${Math.max(heightPct, 8)}%` }}
                                    className="w-full max-w-[36px] bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-300 group-hover:brightness-125"
                                />
                                <span className="text-xs text-slate-400 font-medium">{dayLabel}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 30-Day Activity Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white">30-Day Activity Grid</h3>
                        <p className="text-xs text-slate-400">Daily learning activity heatmap for the past month</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">30 Days</span>
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 pt-2">
                    {(monthly || []).map((day, idx) => {
                        const mins = day.studyMinutes || 0;
                        const level = mins === 0 ? "bg-slate-800" : mins < 30 ? "bg-indigo-900 text-indigo-200" : mins < 60 ? "bg-indigo-700 text-white" : "bg-indigo-500 text-white font-bold";

                        return (
                            <div
                                key={idx}
                                title={`${day.date}: ${mins} mins studied, ${day.revisionsCompleted} revisions completed`}
                                className={`h-9 rounded-lg flex items-center justify-center text-[10px] ${level} transition cursor-pointer hover:ring-2 hover:ring-indigo-400`}
                            >
                                {new Date(day.date).getDate()}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
