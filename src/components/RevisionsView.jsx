"use client";

import { useState } from "react";
import { Clock, CheckCircle, AlertTriangle, Calendar, Award } from "lucide-react";

export default function RevisionsView({ todayRevisions, upcomingRevisions, missedRevisions, onCompleteRevision }) {
    const [subTab, setSubTab] = useState("today"); // 'today', 'upcoming', 'missed'

    const getActiveList = () => {
        if (subTab === "upcoming") return upcomingRevisions;
        if (subTab === "missed") return missedRevisions;
        return todayRevisions;
    };

    const activeList = getActiveList();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Revision Manager</h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Spaced repetition schedule calculated automatically for your study sessions.
                    </p>
                </div>

                {/* Sub Tab Switcher */}
                <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
                    <button
                        onClick={() => setSubTab("today")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            subTab === "today"
                                ? "bg-indigo-600 text-white shadow-md"
                                : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        <Clock className="w-3.5 h-3.5" />
                        Today ({todayRevisions.length})
                    </button>
                    <button
                        onClick={() => setSubTab("upcoming")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            subTab === "upcoming"
                                ? "bg-indigo-600 text-white shadow-md"
                                : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        Upcoming ({upcomingRevisions.length})
                    </button>
                    <button
                        onClick={() => setSubTab("missed")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            subTab === "missed"
                                ? "bg-amber-600 text-white shadow-md"
                                : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Overdue ({missedRevisions.length})
                    </button>
                </div>
            </div>

            {/* List View */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                {activeList.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-slate-700" />
                        <h3 className="text-lg font-bold text-slate-300">No revisions in this category</h3>
                        <p className="text-xs mt-1">Great job! All spaced repetition reviews for this section are up to date.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {activeList.map((rev) => {
                            const topicTitle = rev.studyEntry?.topic?.title || "Study Topic";
                            const courseTitle = rev.studyEntry?.topic?.course?.title || "Course";
                            const isCompleted = rev.status === "completed";

                            return (
                                <div
                                    key={rev.id}
                                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                                rev.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                                rev.status === "missed" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                                "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                            }`}>
                                                {rev.status}
                                            </span>
                                            <h4 className="text-sm font-semibold text-slate-200">{topicTitle}</h4>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                            <span>{courseTitle}</span>
                                            <span>•</span>
                                            <span>Revision #{rev.revision_number}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {rev.revision_date}
                                            </span>
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
                                                className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition shadow-md"
                                            >
                                                Complete Review
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
