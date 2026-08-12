"use client";

import { Clock, Flame, CheckCircle, AlertTriangle, Calendar as CalendarIcon, BookOpen, Plus } from "lucide-react";

export default function DashboardView({ dashboardData, onCompleteRevision, onOpenStudyModal, onOpenCourseModal }) {
    if (!dashboardData) {
        return (
            <div className="p-8 text-center text-slate-400">
                <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p>Loading Dashboard...</p>
            </div>
        );
    }

    const {
        todayStudyEntriesCount,
        todayRevisionsCount,
        pendingRevisionsCount,
        missedRevisionsCount,
        upcomingRevisionsCount,
        dailyStudyTimeMinutes,
        todayStudyEntries = [],
        todayRevisions = [],
    } = dashboardData;

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Daily Study Dashboard</h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Track your progress, maintain your study streak, and review spaced repetition schedules.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onOpenStudyModal}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20"
                    >
                        <Plus className="w-4 h-4" />
                        Log Study Session
                    </button>
                    <button
                        onClick={onOpenCourseModal}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium px-4 py-2 rounded-xl border border-slate-700 transition"
                    >
                        <BookOpen className="w-4 h-4" />
                        Add Course
                    </button>
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Today's Study Time</p>
                        <h3 className="text-2xl font-bold text-white">{dailyStudyTimeMinutes} <span className="text-sm font-normal text-slate-400">mins</span></h3>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Due Today</p>
                        <h3 className="text-2xl font-bold text-white">{todayRevisionsCount} <span className="text-sm font-normal text-slate-400">revisions</span></h3>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Overdue / Missed</p>
                        <h3 className="text-2xl font-bold text-white">{missedRevisionsCount} <span className="text-sm font-normal text-slate-400">items</span></h3>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                        <Flame className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Upcoming Revisions</p>
                        <h3 className="text-2xl font-bold text-white">{upcomingRevisionsCount} <span className="text-sm font-normal text-slate-400">scheduled</span></h3>
                    </div>
                </div>
            </div>

            {/* Revisions Due Today */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white">Revisions Due Today</h3>
                        <p className="text-xs text-slate-400">Complete your scheduled spaced repetition reviews</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {todayRevisions.length} Total
                    </span>
                </div>

                {todayRevisions.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-500/50" />
                        <p className="font-medium text-slate-300">All caught up for today!</p>
                        <p className="text-xs mt-1">No pending revisions scheduled for today date.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {todayRevisions.map((rev) => {
                            const topicTitle = rev.studyEntry?.topic?.title || "Study Session";
                            const courseTitle = rev.studyEntry?.topic?.course?.title || "Course";
                            const isCompleted = rev.status === "completed";

                            return (
                                <div
                                    key={rev.id}
                                    className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-800 hover:border-slate-700 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${isCompleted ? "bg-emerald-500" : "bg-indigo-500 animate-pulse"}`} />
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-200">{topicTitle}</h4>
                                            <p className="text-xs text-slate-400">
                                                {courseTitle} • Revision #{rev.revision_number} ({rev.algorithm})
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        {isCompleted ? (
                                            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                Completed
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => onCompleteRevision(rev.id)}
                                                className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg transition shadow-md"
                                            >
                                                Mark Done
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Today's Logged Sessions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white">Today's Study Sessions</h3>
                        <p className="text-xs text-slate-400">Logged learning sessions for today</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                        {todayStudyEntries.length} Sessions
                    </span>
                </div>

                {todayStudyEntries.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <CalendarIcon className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                        <p className="font-medium text-slate-300">No study sessions logged today yet</p>
                        <button
                            onClick={onOpenStudyModal}
                            className="mt-3 text-xs font-medium text-indigo-400 hover:underline"
                        >
                            + Log a study session now
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {todayStudyEntries.map((entry) => (
                            <div key={entry.id} className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-slate-200">
                                        {entry.topic?.title || `Topic #${entry.topic_id}`}
                                    </h4>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                        entry.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400" :
                                        entry.difficulty === "medium" ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"
                                    }`}>
                                        {entry.difficulty}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {entry.duration_minutes} mins
                                    </span>
                                    <span>{entry.topic?.course?.title}</span>
                                </div>
                                {entry.study_notes && (
                                    <p className="text-xs text-slate-300 italic line-clamp-2 pt-1 border-t border-slate-800/80">
                                        "{entry.study_notes}"
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
