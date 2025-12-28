'use client';

import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { User, Bell, Shield, Key, HelpCircle, ChevronRight, Laptop, LogOut } from 'lucide-react';

export default function SettingsPage() {
    return (
        <PageLayout showNavigation={true} currentPage="settings" showComposeFAB={true} showFooter={true}>
            <main className="container mx-auto px-4 pt-24 pb-20 max-w-3xl">
                <div className="space-y-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Settings</h1>
                        <p className="text-muted">Manage your account preferences and app settings</p>
                    </div>

                    {/* Profile Section */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 px-1">Account</h2>
                        <GlassCard className="divide-y divide-white/10 dark:divide-white/5">
                            <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Profile Information</p>
                                        <p className="text-sm text-muted">Update your name and personal details</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
                            </div>

                            <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <Key className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Security & Passwords</p>
                                        <p className="text-sm text-muted">Manage your login methods</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
                            </div>
                        </GlassCard>
                    </section>

                    {/* App Settings */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 px-1">App Preferences</h2>
                        <GlassCard className="divide-y divide-white/10 dark:divide-white/5">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                        <Bell className="w-5 h-5 text-yellow-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Push Notifications</p>
                                        <p className="text-sm text-muted">Receive alerts for new drafts and posts</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <Laptop className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">System Theme</p>
                                        <p className="text-sm text-muted">Sync with your device's appearance</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </GlassCard>
                    </section>

                    {/* Integrations */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 px-1">Integrations</h2>
                        <GlassCard className="divide-y divide-white/10 dark:divide-white/5">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
                                        {/* Replace with Twitter/X icon if needed, using general Shield for now as placeholder for 'API Key' */}
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Twitter API</p>
                                        <p className="text-sm text-green-500">Connected</p>
                                    </div>
                                </div>
                                <button className="text-sm font-medium text-blue-500 hover:text-blue-400">Configure</button>
                            </div>

                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-pink-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">APIFreeLLM</p>
                                        <p className="text-sm text-green-500">Active</p>
                                    </div>
                                </div>
                                <button className="text-sm font-medium text-blue-500 hover:text-blue-400">Configure</button>
                            </div>
                        </GlassCard>
                    </section>

                    {/* About */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 px-1">Resources</h2>
                        <GlassCard className="divide-y divide-white/10 dark:divide-white/5">
                            <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center">
                                        <HelpCircle className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Help & Support</p>
                                        <p className="text-sm text-muted">Guides and FAQs</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
                            </div>
                        </GlassCard>
                    </section>

                    <div className="pt-4 flex justify-center">
                        <button className="text-red-500 flex items-center gap-2 hover:bg-red-500/10 px-4 py-2 rounded-full transition-colors">
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>

                    <div className="text-center text-xs text-muted pb-8">
                        <p>X-Bot v1.0.0</p>
                        <p>© 2025 All rights reserved</p>
                    </div>

                </div>
            </main>
        </PageLayout>
    );
}
