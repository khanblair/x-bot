'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Check if user has dismissed the prompt before
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed) {
            const dismissedTime = parseInt(dismissed);
            const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

            // Show again after 7 days
            if (daysSinceDismissed < 7) {
                return;
            }
        }

        // Listen for the beforeinstallprompt event
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Show prompt after a short delay (3 seconds)
            setTimeout(() => {
                setShowPrompt(true);
            }, 3000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Listen for successful installation
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowPrompt(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for the user's response
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // Clear the deferred prompt
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    };

    // Don't show if already installed or no prompt available
    if (isInstalled || !showPrompt || !deferredPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-[100] animate-slide-up">
            <GlassCard className="p-4 sm:p-5 border-2 border-twitter-blue/30 shadow-2xl">
                <div className="flex items-start gap-3 sm:gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-twitter-blue to-purple-500 flex items-center justify-center">
                            <Smartphone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold mb-1">Install X-Bot</h3>
                        <p className="text-xs sm:text-sm text-muted mb-3 sm:mb-4">
                            Install our app for a faster, offline-ready experience with AI tweet generation!
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-2 sm:gap-3">
                            <button
                                onClick={handleInstall}
                                className="flex-1 btn-primary px-3 sm:px-4 py-2 flex items-center justify-center gap-2 text-sm"
                            >
                                <Download className="w-4 h-4" />
                                <span>Install</span>
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="btn-secondary px-3 sm:px-4 py-2 text-sm"
                            >
                                Later
                            </button>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={handleDismiss}
                        className="flex-shrink-0 p-1 rounded-full hover:bg-muted/20 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Features List */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-muted/20">
                    <ul className="space-y-1.5 text-xs sm:text-sm text-muted">
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>Works offline</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>Faster loading</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>AI tweet generation</span>
                        </li>
                    </ul>
                </div>
            </GlassCard>
        </div>
    );
}
