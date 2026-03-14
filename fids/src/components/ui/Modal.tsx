import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    className,
}) => {
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleEsc);
        }
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div
                className={cn(
                    "relative w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl transition-all",
                    className
                )}
            >
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    {title && (
                        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                    )}
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-text-secondary hover:bg-background-alt transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="px-6 py-4">{children}</div>
            </div>
        </div>
    );
};

export { Modal };
