"use client";

import * as React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Plus, Search, Filter, AlertCircle, Edit2, Trash2, Box, Beaker, Sprout } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

import { getProducts, createProduct, updateProduct, deleteProduct, Product as APIProduct } from "@/services/productService";
import { getCurrentUser, AuthResponse } from "@/services/authService";

export default function InventoryPage() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [products, setProducts] = React.useState<APIProduct[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [user, setUser] = React.useState<AuthResponse | null>(null);
    const [editingProduct, setEditingProduct] = React.useState<APIProduct | null>(null);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedCategory, setSelectedCategory] = React.useState("All Categories");
    const [selectedStatus, setSelectedStatus] = React.useState("All Status");
    const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);

    const [newItemName, setNewItemName] = React.useState("");
    const [newItemCategory, setNewItemCategory] = React.useState("Fertilizer");
    const [newItemUnit, setNewItemUnit] = React.useState("");
    const [newItemInitialQuantity, setNewItemInitialQuantity] = React.useState("");
    const [newItemThreshold, setNewItemThreshold] = React.useState("");
    const [newItemPrice, setNewItemPrice] = React.useState("");
    const [isCreating, setIsCreating] = React.useState(false);
    const [createError, setCreateError] = React.useState<string | null>(null);

    const handleCreateItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError(null);
        setIsCreating(true);

        try {
            const productData = {
                name: newItemName,
                description: "New Item",
                category: newItemCategory || "Fertilizer",
                price: parseFloat(newItemPrice) || 0,
                stockQuantity: parseInt(newItemInitialQuantity) || 0,
                minThreshold: parseInt(newItemThreshold) || 0,
                unit: newItemUnit,
                imageUrl: "",
            };

            if (editingProduct) {
                await updateProduct(editingProduct._id, productData);
            } else {
                await createProduct(productData);
            }

            setIsModalOpen(false);
            setEditingProduct(null);
            resetForm();
            fetchItems();
        } catch (err: unknown) {
            console.error(err);
            const error = err as { response?: { data?: { message?: string } } };
            setCreateError(error.response?.data?.message || `Failed to ${editingProduct ? 'update' : 'create'} product. Please try again.`);
        } finally {
            setIsCreating(false);
        }
    };

    const resetForm = () => {
        setNewItemName("");
        setNewItemCategory("Fertilizer");
        setNewItemUnit("");
        setNewItemInitialQuantity("");
        setNewItemThreshold("");
        setNewItemPrice("");
    };

    const openEditModal = (product: APIProduct) => {
        setEditingProduct(product);
        setNewItemName(product.name);
        setNewItemCategory(product.category);
        setNewItemUnit(product.unit);
        setNewItemInitialQuantity(product.stockQuantity.toString());
        setNewItemThreshold(product.minThreshold.toString());
        setNewItemPrice(product.price.toString());
        setIsModalOpen(true);
    };

    const fetchItems = async () => {
        try {
            setIsLoading(true);
            const data = await getProducts();
            setProducts(data);
            setError(null);
        } catch (err: unknown) {
            console.error("Failed to fetch products:", err);
            setError("Could not load inventory items. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        setUser(getCurrentUser());
        fetchItems();
    }, []);

    const handleDeleteItem = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteProduct(id);
            fetchItems();
        } catch (err) {
            console.error("Failed to delete product:", err);
            alert("Could not delete product. It may be associated with existing orders.");
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All Categories" || p.category + "s" === selectedCategory || p.category === selectedCategory;
        
        const status = p.stockQuantity === 0 ? "Out of Stock" :
                      p.stockQuantity < p.minThreshold ? "Low Stock" : "In Stock";
        const matchesStatus = selectedStatus === "All Status" || status === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const lowStockItems = products.filter(p => p.stockQuantity < p.minThreshold);

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Inventory Management</h1>
                        <p className="text-text-secondary text-sm sm:text-base">Track stock levels and manage farm input catalogs.</p>
                    </div>
                    {user?.role === 'admin' && (
                        <Button onClick={() => setIsModalOpen(true)} className="gap-2 w-full sm:w-auto">
                            <Plus size={18} />
                            Add New Item
                        </Button>
                    )}
                </div>

                {/* Low Stock Alert Banner */}
                {lowStockItems.length > 0 && (
                    <div className="flex items-center gap-4 rounded-xl border border-amber-100 bg-amber-50 p-4 text-amber-800 shadow-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100/50">
                            <AlertCircle size={24} className="text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold">{lowStockItems.length} items are below minimum threshold</p>
                            <p className="text-sm opacity-90">Attention needed to avoid stockouts in your catalog.</p>
                        </div>
                        <Button variant="ghost" className="text-amber-700 hover:bg-amber-100 font-bold text-sm">View Items</Button>
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                    <div className="flex-1">
                        <Input
                            placeholder="Search by name..."
                            icon={<Search size={18} />}
                            className="h-10 bg-background-alt border-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="flex-1 sm:flex-none h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-text-secondary outline-none focus:ring-1 focus:ring-primary transition-all"
                        >
                            <option>All Categories</option>
                            <option>Fertilizer</option>
                            <option>Seeds</option>
                            <option>Pesticide</option>
                        </select>
                        <select 
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="flex-1 sm:flex-none h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-text-secondary outline-none focus:ring-1 focus:ring-primary transition-all"
                        >
                            <option>All Status</option>
                            <option>In Stock</option>
                            <option>Low Stock</option>
                            <option>Out of Stock</option>
                        </select>
                        <Button 
                            variant="outline" 
                            className={cn(
                                "flex-1 sm:flex-none h-10 px-4 gap-2 border-gray-200 transition-all",
                                showAdvancedFilters ? "bg-primary text-white border-primary" : "text-text-secondary hover:text-primary"
                            )}
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        >
                            <Filter size={16} />
                            More
                        </Button>
                    </div>
                </div>

                {showAdvancedFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl shadow-sm ring-1 ring-black/5 animate-in slide-in-from-top-2 duration-200">
                         <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Unit Type</label>
                            <select className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:ring-1 focus:ring-primary">
                                <option>All Units</option>
                                <option>kg</option>
                                <option>bag</option>
                                <option>litre</option>
                                <option>unit</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Stock Range</label>
                            <div className="flex items-center gap-2">
                                <input type="number" placeholder="Min" className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:ring-1 focus:ring-primary" />
                                <span className="text-gray-400">-</span>
                                <input type="number" placeholder="Max" className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Sort Rules</label>
                            <select className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:ring-1 focus:ring-primary">
                                <option>Name (A-Z)</option>
                                <option>Name (Z-A)</option>
                                <option>Stock: Low to High</option>
                                <option>Stock: High to Low</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Inventory Table */}
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <p className="animate-pulse text-text-secondary">Loading inventory...</p>
                        </div>
                    ) : error ? (
                        <div className="flex h-64 items-center justify-center text-status-rejected">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <Table
                            columns={[
                                {
                                    header: "Product Name",
                                    accessor: (item: APIProduct) => (
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "flex h-9 w-9 items-center justify-center rounded-lg shadow-sm border",
                                                item.category === "Fertilizer" ? "bg-green-50 text-green-600 border-green-100" :
                                                    item.category === "Seed" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                        "bg-orange-50 text-orange-600 border-orange-100"
                                            )}>
                                                {item.category === "Fertilizer" ? <Box size={18} /> :
                                                    item.category === "Seed" ? <Sprout size={18} /> : <Beaker size={18} />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-text-primary">{item.name}</p>
                                                <p className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">{item.category}</p>
                                            </div>
                                        </div>
                                    )
                                },
                                { header: "Unit", accessor: "unit", className: "text-text-secondary" },
                                {
                                    header: "Current Stock",
                                    accessor: (item: APIProduct) => (
                                        <span className={cn(
                                            "font-bold",
                                            item.stockQuantity < item.minThreshold ? "text-status-rejected" : "text-text-primary"
                                        )}>
                                            {item.stockQuantity.toLocaleString()}
                                        </span>
                                    )
                                },
                                { header: "Min Threshold", accessor: "minThreshold", className: "text-text-secondary font-medium" },
                                {
                                    header: "Price/Unit",
                                    accessor: (item: APIProduct) => (
                                        <span className="font-semibold text-primary">
                                            {item.price.toLocaleString()} FCFA
                                        </span>
                                    )
                                },
                                {
                                    header: "Status",
                                    accessor: (item: APIProduct) => {
                                        const status = item.stockQuantity === 0 ? "out-of-stock" :
                                            item.stockQuantity < item.minThreshold ? "low-stock" : "in-stock";
                                        return (
                                            <Badge status={
                                                status === "in-stock" ? "delivered" :
                                                    status === "low-stock" ? "pending" : "rejected"
                                            }>
                                                {status.replace("-", " ")}
                                            </Badge>
                                        );
                                    }
                                },
                                ...(user?.role === 'admin' ? [{
                                    header: "Actions",
                                    accessor: (item: APIProduct) => (
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => openEditModal(item)}
                                                className="rounded-lg p-2 text-text-secondary hover:bg-background-alt hover:text-primary transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteItem(item._id)}
                                                className="rounded-lg p-2 text-text-secondary hover:bg-red-50 hover:text-status-rejected transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )
                                }] : []),
                            ]}
                            data={filteredProducts}
                            totalPages={Math.ceil(filteredProducts.length / 10)}
                        />
                    )}
                </div>

                {/* Add Item Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingProduct(null);
                        resetForm();
                    }}
                    title={editingProduct ? "Edit Farm Input" : "Add New Farm Input"}
                >
                    <form className="space-y-4 py-2" onSubmit={handleCreateItem}>
                        <Input
                            label="Name*"
                            placeholder="e.g. Fertilizer NPK 15-15-15"
                            required
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-primary">Category*</label>
                                <select
                                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    value={newItemCategory}
                                    onChange={(e) => setNewItemCategory(e.target.value)}
                                >
                                    <option value="Fertilizer">Fertilizer</option>
                                    <option value="Seed">Seeds</option>
                                    <option value="Pesticide">Pesticide</option>
                                </select>
                            </div>
                            <Input
                                label="Unit*"
                                placeholder="kg, bag, litre..."
                                required
                                value={newItemUnit}
                                onChange={(e) => setNewItemUnit(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Initial Quantity*"
                                type="number"
                                placeholder="1000"
                                required
                                value={newItemInitialQuantity}
                                onChange={(e) => setNewItemInitialQuantity(e.target.value)}
                            />
                            <Input
                                label="Min threshold*"
                                type="number"
                                placeholder="200"
                                required
                                value={newItemThreshold}
                                onChange={(e) => setNewItemThreshold(e.target.value)}
                            />
                        </div>
                        <Input
                            label="Price per unit (optional)"
                            type="number"
                            step="1"
                            placeholder="0 FCFA"
                            value={newItemPrice}
                            onChange={(e) => setNewItemPrice(e.target.value)}
                        />

                        {createError && (
                            <div className="rounded-lg bg-status-rejected/10 p-3 text-center text-sm font-semibold text-status-rejected ring-1 ring-status-rejected/20">
                                {createError}
                            </div>
                        )}

                        <div className="flex flex-col gap-2 pt-4">
                            <Button type="submit" isLoading={isCreating}>
                                {editingProduct ? "Update Product" : "Save Product"}
                            </Button>
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingProduct(null);
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
