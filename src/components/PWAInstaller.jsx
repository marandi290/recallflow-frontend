"use client";

import { useState, useEffect } from "react";
import { Download, WifiOff, X } from "lucide-react";

export default function PWAInstaller() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isOffline, setIsOffline] = useState(false);
    const [showInstallBanner, setShowInstallBanner] = useState(false);

    useEffect(() => {
        // Register Service Worker
        if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
            window.addEventListener("load", () => {
                navigator.serviceWorker.register("/sw.js").then(
                    (registration) => {
                        console.log("PWA ServiceWorker registered with scope:", registration.scope);
                    },
                    (err) => {
                        console.log("PWA ServiceWorker registration failed:", err);
                    }
                );
            });
        }

        // Handle Offline / Online State
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        setIsOffline(!navigator.onLine);

        // Handle PWA Install Prompt
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBanner(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setShowInstallBanner(false);
        }
        setDeferredPrompt(null);
    };

    return (
        <>
            {/* Offline Alert Banner */}
            {isOffline && (
                <div className="bg-amber-600 text-white text-xs font-semibold px-4 py-2 text-center flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
                    <WifiOff className="w-4 h-4" />
                    <span>You are currently offline. Using cached data.</span>
                </div>
            )}

            {/* PWA Install Banner */}
            {showInstallBanner && deferredPrompt && (
                <div className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-slate-900 border border-indigo-500/30 p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm animate-in slide-in-from-bottom duration-300">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
                        <Download className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-white">Install RecallFlow</h4>
                        <p className="text-xs text-slate-400">Install app for fast offline study access.</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleInstallClick}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-md"
                        >
                            Install
                        </button>
                        <button
                            onClick={() => setShowInstallBanner(false)}
                            className="text-slate-400 hover:text-white p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
