"use client";

import { useState } from "react";
import { Sparkles, Brain, Download, Upload, HelpCircle, CheckCircle2, RotateCcw, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { api } from "../lib/api";

export default function FlashcardQuizView({ userId, courses, topicsMap }) {
    const [subTab, setSubTab] = useState("flashcards"); // 'flashcards', 'quiz', 'backup'
    const [selectedTopicTitle, setSelectedTopicTitle] = useState("Spaced Repetition & Memory Retention");
    const [studyNotes, setStudyNotes] = useState("");

    // AI States
    const [flashcardsData, setFlashcardsData] = useState(null);
    const [cardIndex, setCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [backupMessage, setBackupMessage] = useState(null);

    // Generate Flashcards
    const handleGenerateFlashcards = async () => {
        setLoading(true);
        try {
            const res = await api.generateFlashcards({
                topic_title: selectedTopicTitle,
                study_notes: studyNotes,
            });
            setFlashcardsData(res.data);
            setCardIndex(0);
            setIsFlipped(false);
        } catch (err) {
            alert(err.message || "Failed to generate AI flashcards");
        } finally {
            setLoading(false);
        }
    };

    // Generate Quiz
    const handleGenerateQuiz = async () => {
        setLoading(true);
        try {
            const res = await api.generateQuiz({
                topic_title: selectedTopicTitle,
                study_notes: studyNotes,
            });
            setQuizData(res.data);
            setSelectedAnswers({});
            setIsQuizSubmitted(false);
        } catch (err) {
            alert(err.message || "Failed to generate AI quiz");
        } finally {
            setLoading(false);
        }
    };

    // Export Data Backup
    const handleExportBackup = async () => {
        try {
            const res = await api.exportData(userId);
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
            const downloadAnchor = document.createElement("a");
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `recallflow-backup-${Date.now()}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            setBackupMessage("Backup exported successfully!");
        } catch (err) {
            alert(err.message || "Failed to export data");
        }
    };

    // Import Data Backup
    const handleImportBackup = (e) => {
        const fileReader = new FileReader();
        if (e.target.files[0]) {
            fileReader.readAsText(e.target.files[0], "UTF-8");
            fileReader.onload = async (event) => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    const res = await api.importData(userId, parsed);
                    setBackupMessage(`Backup imported! ${res.data.importedCoursesCount} course(s) and ${res.data.importedTopicsCount} topic(s) restored.`);
                } catch (err) {
                    alert("Invalid JSON backup file or import error: " + err.message);
                }
            };
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-amber-400" />
                        AI Flashcards, Quizzes & Backup
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Active recall tools, AI question generation, and complete data backup/restore.
                    </p>
                </div>

                <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
                    <button
                        onClick={() => setSubTab("flashcards")}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                            subTab === "flashcards" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        <Brain className="w-3.5 h-3.5" />
                        AI Flashcards
                    </button>
                    <button
                        onClick={() => setSubTab("quiz")}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                            subTab === "quiz" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        <HelpCircle className="w-3.5 h-3.5" />
                        AI Quiz
                    </button>
                    <button
                        onClick={() => setSubTab("backup")}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                            subTab === "backup" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        <Download className="w-3.5 h-3.5" />
                        Backup & Restore
                    </button>
                </div>
            </div>

            {/* Input Config Bar for AI */}
            {subTab !== "backup" && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Topic Title</label>
                            <input
                                type="text"
                                value={selectedTopicTitle}
                                onChange={(e) => setSelectedTopicTitle(e.target.value)}
                                placeholder="e.g. Node.js Event Loop & Microtasks"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Study Notes (optional for AI context)</label>
                            <input
                                type="text"
                                value={studyNotes}
                                onChange={(e) => setStudyNotes(e.target.value)}
                                placeholder="e.g. Call stack, process.nextTick, Promise resolution..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={subTab === "flashcards" ? handleGenerateFlashcards : handleGenerateQuiz}
                            disabled={loading || !selectedTopicTitle.trim()}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20"
                        >
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            {loading ? "Generating with AI..." : subTab === "flashcards" ? "Generate AI Flashcards" : "Generate AI Quiz"}
                        </button>
                    </div>
                </div>
            )}

            {/* SubTab 1: AI Flashcards */}
            {subTab === "flashcards" && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[320px]">
                    {!flashcardsData ? (
                        <div className="text-slate-500 space-y-2">
                            <Brain className="w-12 h-12 mx-auto text-indigo-500/40 animate-pulse" />
                            <h3 className="text-lg font-bold text-slate-300">Ready to test your memory?</h3>
                            <p className="text-xs max-w-md mx-auto">
                                Click "Generate AI Flashcards" above to parse your study notes and generate interactive flashcards.
                            </p>
                        </div>
                    ) : (
                        <div className="w-full max-w-xl space-y-6">
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span>Card {cardIndex + 1} of {flashcardsData.flashcards.length}</span>
                                <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                                    {flashcardsData.flashcards[cardIndex].difficulty}
                                </span>
                            </div>

                            {/* Flip Flashcard */}
                            <div
                                onClick={() => setIsFlipped(!isFlipped)}
                                className={`w-full min-h-[200px] p-8 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-center items-center shadow-xl ${
                                    isFlipped
                                        ? "bg-slate-800/90 border-emerald-500/40 text-emerald-100"
                                        : "bg-slate-800/50 border-slate-700 text-slate-100 hover:border-indigo-500"
                                }`}
                            >
                                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-2">
                                    {isFlipped ? "Answer" : "Question (Click to flip)"}
                                </span>
                                <p className="text-lg font-bold leading-relaxed">
                                    {isFlipped ? flashcardsData.flashcards[cardIndex].answer : flashcardsData.flashcards[cardIndex].question}
                                </p>
                            </div>

                            {/* Card Navigation Controls */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => {
                                        setIsFlipped(false);
                                        setCardIndex(Math.max(0, cardIndex - 1));
                                    }}
                                    disabled={cardIndex === 0}
                                    className="flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Previous
                                </button>

                                <button
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    className="flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition"
                                >
                                    <RotateCcw className="w-4 h-4" /> Flip Card
                                </button>

                                <button
                                    onClick={() => {
                                        setIsFlipped(false);
                                        setCardIndex(Math.min(flashcardsData.flashcards.length - 1, cardIndex + 1));
                                    }}
                                    disabled={cardIndex === flashcardsData.flashcards.length - 1}
                                    className="flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* SubTab 2: AI Quiz */}
            {subTab === "quiz" && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    {!quizData ? (
                        <div className="text-center py-12 text-slate-500 space-y-2">
                            <HelpCircle className="w-12 h-12 mx-auto text-indigo-500/40" />
                            <h3 className="text-lg font-bold text-slate-300">Generate AI Self-Test Quiz</h3>
                            <p className="text-xs max-w-md mx-auto">
                                Click "Generate AI Quiz" above to test your recall accuracy.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <h3 className="text-lg font-bold text-white">Quiz: {quizData.topic_title}</h3>
                                <span className="text-xs text-slate-400">{quizData.questions.length} Questions</span>
                            </div>

                            <div className="space-y-6">
                                {quizData.questions.map((q, qIdx) => (
                                    <div key={q.id} className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl space-y-3">
                                        <h4 className="text-sm font-semibold text-slate-200">
                                            {qIdx + 1}. {q.question}
                                        </h4>
                                        <div className="space-y-2">
                                            {q.options.map((opt, optIdx) => {
                                                const isSelected = selectedAnswers[q.id] === optIdx;
                                                const isCorrect = q.correctAnswer === optIdx;

                                                let btnStyle = "bg-slate-800/80 border-slate-700 text-slate-300 hover:border-indigo-500";
                                                if (isQuizSubmitted) {
                                                    if (isCorrect) btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold";
                                                    else if (isSelected && !isCorrect) btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300 font-semibold";
                                                } else if (isSelected) {
                                                    btnStyle = "bg-indigo-600/30 border-indigo-500 text-white font-semibold";
                                                }

                                                return (
                                                    <button
                                                        key={optIdx}
                                                        disabled={isQuizSubmitted}
                                                        onClick={() => setSelectedAnswers({ ...selectedAnswers, [q.id]: optIdx })}
                                                        className={`w-full text-left p-3 rounded-lg border text-xs transition ${btnStyle}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {isQuizSubmitted && (
                                            <p className="text-xs text-indigo-300 italic pt-1">
                                                💡 Explanation: {q.explanation}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {!isQuizSubmitted ? (
                                <button
                                    onClick={() => setIsQuizSubmitted(true)}
                                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg"
                                >
                                    Submit Quiz Answers
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsQuizSubmitted(false);
                                        setSelectedAnswers({});
                                    }}
                                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
                                >
                                    Retake Quiz
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* SubTab 3: Data Backup & Restore */}
            {subTab === "backup" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Export Backup Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <Download className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Export Full Data Backup</h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Download a complete JSON snapshot of your courses, topics, study entries, and revision schedules.
                            </p>
                        </div>
                        <button
                            onClick={handleExportBackup}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-md"
                        >
                            <Download className="w-4 h-4" /> Download Backup JSON
                        </button>
                    </div>

                    {/* Import Backup Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Upload className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Restore / Import Data</h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Upload a previously exported `.json` file to restore your study data.
                            </p>
                        </div>
                        <label className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 cursor-pointer transition">
                            <Upload className="w-4 h-4 text-emerald-400" />
                            Select Backup JSON File
                            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                        </label>
                    </div>

                    {backupMessage && (
                        <div className="col-span-full p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{backupMessage}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
