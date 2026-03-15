"use client";

import * as React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { UserPlus, Search, Shield, User, MoreVertical, Edit2, Power, Phone, Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { Table } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

import { getUsers, updateUserStatus, deleteUser, createUser, updateUser, User as APIUser } from "@/services/userService";
import { getCurrentUser, AuthResponse } from "@/services/authService";

export default function UserManagementPage() {
    const [activeTab, setActiveTab] = React.useState("all");
    const [users, setUsers] = React.useState<APIUser[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState<AuthResponse | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const [editingUser, setEditingUser] = React.useState<APIUser | null>(null);
    const [selectedCountry, setSelectedCountry] = React.useState("All Countries");
    const [selectedStatus, setSelectedStatus] = React.useState("Status: All");

    const [newUserName, setNewUserName] = React.useState("");
    const [newUserEmail, setNewUserEmail] = React.useState(""); // Kept this line to maintain syntactic correctness
    const [newUserRole, setNewUserRole] = React.useState<"admin" | "distributor" | "farmer">("admin");
    const [newUserCountry, setNewUserCountry] = React.useState("Burkina Faso");
    const [newUserPhone, setNewUserPhone] = React.useState("");
    const [isCreating, setIsCreating] = React.useState(false);
    const [createError, setCreateError] = React.useState<string | null>(null);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError(null);
        setIsCreating(true);

        try {
            if (editingUser) {
                await updateUser(editingUser._id, {
                    name: newUserName,
                    email: newUserEmail,
                    role: newUserRole,
                    region: newUserCountry,
                    phone: newUserPhone
                });
            } else {
                await createUser({
                    name: newUserName,
                    email: newUserEmail,
                    password: "password123",
                    role: newUserRole,
                    region: newUserCountry,
                    phone: newUserPhone
                });
            }
            setIsModalOpen(false);
            setEditingUser(null);
            resetForm();
            fetchUsers();
        } catch (err: unknown) {
            console.error(err);
            const error = err as { response?: { data?: { message?: string } } };
            setCreateError(error.response?.data?.message || `Failed to ${editingUser ? 'update' : 'create'} user. Please try again.`);
        } finally {
            setIsCreating(false);
        }
    };

    const resetForm = () => {
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPhone("");
        setNewUserRole("admin");
        setNewUserCountry("Burkina Faso");
    };

    const openEditModal = (user: APIUser) => {
        setEditingUser(user);
        setNewUserName(user.name);
        setNewUserEmail(user.email);
        setNewUserRole(user.role as any);
        setNewUserCountry(user.region || "Burkina Faso");
        setNewUserPhone(user.phone || "");
        setIsModalOpen(true);
    };

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const data = await getUsers();
            setUsers(data);
            setError(null);
        } catch (err: unknown) {
            console.error("Failed to fetch users:", err);
            setError("Could not load users. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        setUser(getCurrentUser());
        fetchUsers();
    }, []);

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === "active" ? "inactive" : "active";
            await updateUserStatus(id, newStatus);
            fetchUsers();
        } catch (err) {
            console.error("Failed to toggle user status:", err);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(id);
            fetchUsers();
        } catch (err) {
            console.error("Failed to delete user:", err);
        }
    };

    const tabs = [
        { id: "all", label: "All Users" },
        { id: "admin", label: "Admins" },
        { id: "distributor", label: "Distributors" },
        { id: "farmer", label: "Farmers" },
    ];

    const filteredUsers = users.filter(user => {
        const matchesTab = activeTab === "all" || user.role === activeTab;
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.phone && user.phone.includes(searchQuery));
        
        const matchesRegion = selectedCountry === "All Countries" || user.region === selectedCountry;
        const matchesStatus = selectedStatus === "Status: All" || 
            (selectedStatus === "Active" && user.status === "active") ||
            (selectedStatus === "Inactive" && user.status === "inactive");

        return matchesTab && matchesSearch && matchesRegion && matchesStatus;
    });

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
                        <p className="text-text-secondary text-sm sm:text-base">Control system access and manage country zone assignments.</p>
                    </div>
                    {user?.role === 'admin' && (
                        <Button onClick={() => setIsModalOpen(true)} className="gap-2 w-full sm:w-auto shadow-lg shadow-primary/20">
                            <UserPlus size={18} />
                            Add New User
                        </Button>
                    )}
                </div>

                {/* Tabs & Search */}
                <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                    <div className="flex items-center gap-1 border-b border-gray-100 pb-0 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-4 sm:px-6 py-4 text-sm font-bold transition-all whitespace-nowrap",
                                    activeTab === tab.id
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-text-secondary hover:text-text-primary"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[300px]">
                            <Input
                                placeholder="Search by name, email or phone..."
                                icon={<Search size={18} />}
                                className="h-10 border-none bg-background-alt"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select 
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-bold text-text-secondary outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option>All Countries</option>
                                <option>Burkina Faso</option>
                                <option>Sénégal</option>
                                <option>Côte d'Ivoire</option>
                                <option>Mali</option>
                                <option>Ghana</option>
                                <option>Bénin</option>
                                <option>Nigéria</option>
                                <option>Togo</option>
                            </select>
                            <select 
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-bold text-text-secondary outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option>Status: All</option>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <p className="animate-pulse text-text-secondary">Loading users...</p>
                        </div>
                    ) : error ? (
                        <div className="flex h-64 items-center justify-center text-status-rejected">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <Table
                            columns={[
                                {
                                    header: "User",
                                    accessor: (item: APIUser) => (
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-sm border",
                                                item.role === "admin" ? "bg-purple-50 text-purple-600 border-purple-100" :
                                                    item.role === "distributor" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                        "bg-green-50 text-green-600 border-green-100"
                                            )}>
                                                {item.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-text-primary leading-tight">{item.name}</p>
                                                <p className="text-xs text-text-secondary font-medium lowercase">{item.email}</p>
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    header: "Role",
                                    accessor: (item: APIUser) => (
                                        <div className="flex items-center gap-2">
                                            <Shield size={14} className={cn(
                                                item.role === "admin" ? "text-purple-500" :
                                                    item.role === "distributor" ? "text-blue-500" : "text-green-500"
                                            )} />
                                            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">{item.role}</span>
                                        </div>
                                    ),
                                    hiddenOnMobile: true
                                },
                                { header: "Country", accessor: (item: APIUser) => item.region || "N/A", className: "text-text-secondary font-medium", hiddenOnMobile: true },
                                { header: "Phone", accessor: (item: APIUser) => item.phone || "N/A", className: "text-text-secondary tabular-nums", hiddenOnMobile: true },
                                {
                                    header: "Status",
                                    accessor: (item: APIUser) => (
                                        <div className="flex items-center gap-2">
                                            <div className={cn("h-2 w-2 rounded-full", item.status === "active" ? "bg-green-500" : "bg-gray-300")} />
                                            <span className={cn("text-xs font-bold", item.status === "active" ? "text-green-600" : "text-gray-400")}>
                                                {item.status === "active" ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    )
                                },
                                ...(user?.role === 'admin' ? [{
                                    header: "Actions",
                                    accessor: (item: APIUser) => (
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => openEditModal(item)}
                                                className="rounded-lg p-2 text-text-secondary hover:bg-background-alt transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(item._id, item.status)}
                                                className={cn(
                                                    "rounded-lg p-2 transition-colors",
                                                    item.status === "active" ? "text-text-secondary hover:bg-gray-100" : "text-primary hover:bg-primary/10"
                                                )}
                                            >
                                                <Power size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(item._id)}
                                                className="rounded-lg p-2 text-text-secondary hover:bg-red-50 hover:text-status-rejected transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )
                                }] : []),
                            ]}
                            data={filteredUsers}
                        />
                    )}
                </div>

                {/* Add User Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingUser(null);
                        resetForm();
                    }}
                    title={editingUser ? "Edit Team Member" : "Add New Team Member"}
                >
                    <form className="space-y-4 py-2" onSubmit={handleCreateUser}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Full Name*"
                                placeholder="e.g. Jean Dupont"
                                required
                                icon={<User size={16} />}
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                            />
                            <Input
                                label="Email address*"
                                type="email"
                                placeholder="jean@fids.com"
                                required
                                icon={<Mail size={16} />}
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-text-primary">Role*</label>
                                <select
                                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value as "admin" | "distributor" | "farmer")}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="distributor">Distributor</option>
                                    <option value="farmer">Farmer</option>
                                </select>
                            </div>
                             <div className="space-y-1.5">
                                <label className="text-sm font-bold text-text-primary">Country*</label>
                                <select
                                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                    value={newUserCountry}
                                    onChange={(e) => setNewUserCountry(e.target.value)}
                                >
                                    <option value="Burkina Faso">Burkina Faso</option>
                                    <option value="Sénégal">Sénégal</option>
                                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                                    <option value="Mali">Mali</option>
                                    <option value="Ghana">Ghana</option>
                                    <option value="Bénin">Bénin</option>
                                    <option value="Nigéria">Nigéria</option>
                                    <option value="Togo">Togo</option>
                                </select>
                            </div>
                        </div>
                        <Input
                            label="Phone Number"
                            placeholder="+221 ..."
                            icon={<Phone size={16} />}
                            value={newUserPhone}
                            onChange={(e) => setNewUserPhone(e.target.value)}
                        />

                        <div className="rounded-lg bg-primary/5 p-4 border border-primary/10 text-primary text-xs font-medium leading-relaxed">
                            {editingUser ? "Updating this account will save the new details immediately." : "Creating a new account will generate a default password \"password123\". The user can change it later."}
                        </div>

                        {createError && (
                            <div className="rounded-lg bg-status-rejected/10 p-3 text-center text-sm font-semibold text-status-rejected ring-1 ring-status-rejected/20">
                                {createError}
                            </div>
                        )}

                        <div className="flex flex-col gap-2 pt-4">
                            <Button type="submit" className="font-bold py-6 text-lg shadow-lg shadow-primary/20" isLoading={isCreating}>
                                {editingUser ? "Save Changes" : "Create User & Send Invite"}
                            </Button>
                            <Button 
                                type="button" 
                                variant="ghost" 
                                className="font-bold" 
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingUser(null);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </DashboardLayout>
    );
}
