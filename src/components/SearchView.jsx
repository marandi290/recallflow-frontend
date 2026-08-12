"use client";

import { useState } from "react";
import { Search, BookOpen, Layers, Clock, FileText } from "lucide-react";

export default function SearchView({ onSearch, searchResults }) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Global Keyword Search</h2>
                <p className="text-sm text-slate-400 mt-1">
                    Search across your courses, topics, study notes, and revision notes.
                </p>
            </div>

            {/* Search Input Bar */}
            <form onSubmit={handleSubmit} className="relative max-w-2xl">
                <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search keywords (e.g. Node, Algorithms, Express, SQL)..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-12 pr-28 py-3 text-sm text-white placeholder-slate-500 outline-none transition shadow-lg"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition"
                >
                    Search
                </button>
            </form>

            {/* Results Section */}
            {searchResults && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Found <strong className="text-white">{searchResults.totalResults}</strong> result(s) for "{searchResults.query}"</span>
                    </div>

                    {/* Courses Results */}
                    {searchResults.courses?.length > 0 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                            <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-indigo-400" />
                                Matching Courses ({searchResults.courses.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {searchResults.courses.map((c) => (
                                    <div key={c.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                                        <h4 className="text-sm font-semibold text-white">{c.title}</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">{c.category || "General"} • {c.algorithm}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Topics Results */}
                    {searchResults.topics?.length > 0 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                            <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                                <Layers className="w-4 h-4 text-indigo-400" />
                                Matching Topics ({searchResults.topics.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {searchResults.topics.map((t) => (
                                    <div key={t.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                                        <h4 className="text-sm font-semibold text-white">{t.title}</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">{t.course?.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Study Notes Results */}
                    {searchResults.studyEntries?.length > 0 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                            <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-400" />
                                Matching Study Notes ({searchResults.studyEntries.length})
                            </h3>
                            <div className="space-y-2">
                                {searchResults.studyEntries.map((se) => (
                                    <div key={se.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs">
                                        <p className="text-slate-200 italic">"{se.study_notes}"</p>
                                        <p className="text-slate-400 mt-1 font-medium">{se.topic?.title} ({se.duration_minutes} mins)</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
