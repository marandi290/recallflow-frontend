"use client";

import { useState } from "react";
import { Plus, BookOpen, Layers, Trash2, Calendar, Award } from "lucide-react";

export default function CoursesView({ courses, topicsMap, onOpenCourseModal, onOpenTopicModal, onDeleteCourse, onDeleteTopic }) {
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Courses & Topics</h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Manage your study courses, algorithm strategies, and subject topics.
                    </p>
                </div>
                <button
                    onClick={onOpenCourseModal}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20"
                >
                    <Plus className="w-4 h-4" />
                    Create Course
                </button>
            </div>

            {courses.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-700" />
                    <h3 className="text-lg font-bold text-slate-300">No courses created yet</h3>
                    <p className="text-sm mt-1 max-w-sm mx-auto">
                        Create your first study course to start organizing topics and automated spaced repetition revision schedules.
                    </p>
                    <button
                        onClick={onOpenCourseModal}
                        className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition shadow-md"
                    >
                        Create Course Now
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {courses.map((course) => {
                        const courseTopics = topicsMap[course.id] || [];
                        const isExpanded = selectedCourseId === course.id;

                        return (
                            <div
                                key={course.id}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                {course.category || "General"}
                                            </span>
                                            <h3 className="text-lg font-bold text-white mt-1">{course.title}</h3>
                                        </div>
                                        <button
                                            onClick={() => onDeleteCourse(course.id)}
                                            className="text-slate-500 hover:text-rose-400 p-1.5 transition"
                                            title="Delete course"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {course.goal && (
                                        <p className="text-xs text-slate-400 line-clamp-2">{course.goal}</p>
                                    )}

                                    <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-400 border-t border-slate-800">
                                        <span className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg">
                                            <Award className="w-3.5 h-3.5 text-amber-400" />
                                            Algo: <strong className="text-slate-200 capitalize">{course.algorithm.replace("_", " ")}</strong>
                                        </span>
                                        <span className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {course.duration_days} days
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Layers className="w-3.5 h-3.5 text-indigo-400" />
                                            {courseTopics.length} Topics
                                        </span>
                                        <button
                                            onClick={() => onOpenTopicModal(course.id)}
                                            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            Add Topic
                                        </button>
                                    </div>

                                    {/* Topic List */}
                                    {courseTopics.length > 0 && (
                                        <div className="space-y-1.5 pt-1">
                                            {courseTopics.slice(0, isExpanded ? 50 : 3).map((topic) => (
                                                <div
                                                    key={topic.id}
                                                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 text-xs text-slate-300"
                                                >
                                                    <span className="font-medium truncate max-w-[180px]">{topic.title}</span>
                                                    <button
                                                        onClick={() => onDeleteTopic(topic.id, course.id)}
                                                        className="text-slate-500 hover:text-rose-400 p-0.5 transition"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            {courseTopics.length > 3 && (
                                                <button
                                                    onClick={() => setSelectedCourseId(isExpanded ? null : course.id)}
                                                    className="text-[11px] font-medium text-slate-400 hover:text-slate-200"
                                                >
                                                    {isExpanded ? "Show less" : `+${courseTopics.length - 3} more topics...`}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
