"use client";

import * as React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { User, Lock, Bell, Shield, MapPin, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

export default function SettingsPage() {
    const { t, language } = useTranslation();
    const [activeTab, setActiveTab] = React.useState("profile");
    const [user, setUser] = React.useState<any>(null);
    const [isSaving, setIsSaving] = React.useState(false);
    const [saveMessage, setSaveMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Profile state
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");

    // Security state
    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setName(userData.name || "");
            setEmail(userData.email || "");
            setPhone(userData.phone || "");
        }
    }, []);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSaving(true);
        setSaveMessage(null);

        try {
            const { updateUser } = await import("@/services/userService");
            const updatedUser = await updateUser(user._id, { name, email, phone });
            
            // Update local storage
            const newUser = { ...user, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);
            
            setSaveMessage({ type: 'success', text: "Profile updated successfully! Refreshing..." });
            
            // Force reload to sync Header/Sidebar in parent Layout
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            console.error(err);
            setSaveMessage({ type: 'error', text: "Failed to update profile. Please try again." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        if (newPassword !== confirmPassword) {
            setSaveMessage({ type: 'error', text: "New passwords do not match." });
            return;
        }

        setIsSaving(true);
        setSaveMessage(null);

        try {
            const { updateUser } = await import("@/services/userService");
            await updateUser(user._id, { password: newPassword });
            setSaveMessage({ type: 'success', text: "Password updated successfully!" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error(err);
            setSaveMessage({ type: 'error', text: "Failed to update password." });
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: "profile", label: t('account_profile'), icon: User },
        { id: "security", label: t('security_password'), icon: Lock },
        { id: "notifications", label: t('notifications_settings'), icon: Bell },
        { id: "country", label: t('country_zones'), icon: MapPin },
    ];

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">{t('system_settings')}</h1>
                    <p className="text-text-secondary">{t('settings_description_all')}</p>
                </div>

                {saveMessage && (
                    <div className={cn(
                        "rounded-xl p-4 text-sm font-bold border animate-in slide-in-from-top duration-300",
                        saveMessage.type === 'success' ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"
                    )}>
                        {saveMessage.text}
                    </div>
                )}

                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Navigation Sidebar */}
                    <div className="w-full lg:w-64 shrink-0 overflow-x-hidden">
                        <div className="flex flex-row lg:flex-col gap-1 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-black/5 overflow-x-auto no-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setSaveMessage(null);
                                    }}
                                    className={cn(
                                        "flex items-center gap-2 sm:gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all whitespace-nowrap",
                                        activeTab === tab.id
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "text-text-secondary hover:bg-background-alt hover:text-text-primary"
                                    )}
                                >
                                    <tab.icon size={18} className="shrink-0" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Settings Content */}
                    <div className="flex-1 rounded-3xl bg-white p-4 sm:p-8 shadow-sm ring-1 ring-black/5">
                        {activeTab === "profile" && (
                            <form className="space-y-8 animate-in fade-in duration-500" onSubmit={handleSaveProfile}>
                                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                    <div className="relative group">
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary text-3xl font-bold border-4 border-white shadow-xl ring-1 ring-gray-100 overflow-hidden">
                                            {user?.avatar ? (
                                                <img 
                                                    src={user.avatar.startsWith('http') ? user.avatar : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.avatar}`} 
                                                    alt={name} 
                                                    className="h-full w-full object-cover"
                                                    key={user.avatar} // Force re-render if URL changes
                                                />
                                            ) : (
                                                name ? name.charAt(0).toUpperCase() : "U"
                                            )}
                                        </div>
                                        <button type="button" className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-text-secondary shadow-lg border border-gray-100 hover:text-primary transition-all">
                                            <Globe size={14} />
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-text-primary">{t('profile_picture')}</h3>
                                        <p className="text-sm text-text-secondary">{t('jpg_gif_png')}</p>
                                        <div className="mt-3 flex gap-2">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const formData = new FormData();
                                                        formData.append('image', file);
                                                        
                                                        try {
                                                            setIsSaving(true);
                                                            const api = (await import("@/services/api")).default;
                                                            const response = await api.post('/upload/avatar', formData, {
                                                                headers: { 'Content-Type': 'multipart/form-data' }
                                                            });
                                                            
                                                            const newUser = { ...user, avatar: response.data.avatar };
                                                            localStorage.setItem('user', JSON.stringify(newUser));
                                                            setUser(newUser);
                                                            setSaveMessage({ type: 'success', text: "Avatar updated successfully!" });
                                                        } catch (err) {
                                                            console.error(err);
                                                            setSaveMessage({ type: 'error', text: "Failed to upload avatar." });
                                                        } finally {
                                                            setIsSaving(false);
                                                        }
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="h-9 px-4"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                {t('upload_new')}
                                            </Button>
                                            <Button type="button" variant="ghost" size="sm" className="h-9 px-4 text-status-rejected">{t('remove')}</Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <Input label={t('full_name')} value={name} onChange={(e) => setName(e.target.value)} />
                                    <Input label={t('email_address')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <Input label={t('phone_number')} value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-text-primary">{t('system_language')}</label>
                                        <select className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary">
                                            <option>{language === 'fr' ? 'Français' : 'French (Français)'}</option>
                                            <option>{language === 'en' ? 'English' : 'English'}</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex justify-end">
                                    <Button type="submit" className="gap-2 px-8 shadow-lg shadow-primary/20" isLoading={isSaving}>
                                        <Save size={18} />
                                        {t('save_profile')}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {activeTab === "security" && (
                            <form className="max-w-md space-y-8 animate-in fade-in duration-500" onSubmit={handleUpdatePassword}>
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                                        <Lock size={20} className="text-primary" /> {t('update_password')}
                                    </h3>
                                    <p className="text-sm text-text-secondary">{t('password_desc')}</p>
                                </div>

                                <div className="space-y-4">
                                    <Input label={t('current_password')} type="password" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                    <Input label={t('new_password')} type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                    <Input label={t('confirm_new_password')} type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>
                                <div className="rounded-xl bg-amber-50 p-4 border border-amber-100 flex gap-3 text-amber-800">
                                    <Shield size={20} className="shrink-0" />
                                    <div className="text-sm">
                                        <p className="font-bold">{t('two_factor_auth')}</p>
                                        <p className="opacity-90">{t('two_factor_desc')}</p>
                                        <button type="button" className="mt-2 font-bold underline">{t('setup_2fa_now')}</button>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <Button type="submit" className="w-full" isLoading={isSaving}>{t('update_password')}</Button>
                                </div>
                            </form>
                        )}

                        {activeTab === "notifications" && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-text-primary">{t('communication_prefs')}</h3>
                                    <p className="text-sm text-text-secondary">{t('comm_prefs_desc')}</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { icon: Bell, label: t('order_status_updates'), desc: t('order_status_desc'), default: true },
                                        { icon: MapPin, label: t('country_alerts'), desc: t('country_alerts_desc'), default: true },
                                        { icon: Shield, label: t('security_login'), desc: t('security_login_desc'), default: false },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start justify-between rounded-2xl border border-gray-100 p-6 transition-all hover:bg-background-alt">
                                            <div className="flex gap-4">
                                                <div className="rounded-xl bg-primary/5 p-2 text-primary">
                                                    <item.icon size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-text-primary text-sm">{item.label}</p>
                                                    <p className="text-xs text-text-secondary max-w-sm">{item.desc}</p>
                                                </div>
                                            </div>
                                            <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-primary transition-all">
                                                <div className="ml-5 h-5 w-5 rounded-full bg-white shadow-sm" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex justify-end">
                                    <Button 
                                        className="gap-2 px-8" 
                                        onClick={() => {
                                            setSaveMessage({ type: "success", text: "Notification preferences saved successfully!" });
                                            setTimeout(() => setSaveMessage(null), 3000);
                                        }}
                                    >
                                        {t('save_preferences')}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === "country" && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-text-primary">{t('country_assignment')}</h3>
                                        <p className="text-sm text-text-secondary">{t('country_assignment_desc')}</p>
                                    </div>
                                    <Badge status="approved">{t('active_zone')}</Badge>
                                </div>

                                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 flex flex-col items-center text-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-xl">
                                        <MapPin size={32} />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-extrabold text-text-primary">{user?.country || "Burkina Faso"}</h4>
                                        <p className="text-sm font-semibold text-primary">Assigned Country ID: BF-OUA-01</p>
                                    </div>
                                    <div className="flex gap-4 text-xs font-bold text-text-secondary uppercase tracking-widest mt-2">
                                        <span>325 {t('farmers')}</span>
                                        <span>•</span>
                                        <span>12 {t('distribution_points')}</span>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-gray-100 p-6 flex items-center justify-between text-sm">
                                    <p className="text-text-secondary">{t('need_change_country')}</p>
                                    <Button variant="outline" size="sm">{t('request_transfer')}</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
