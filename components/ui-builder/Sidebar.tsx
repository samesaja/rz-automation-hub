"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Box, Type, MousePointer2, Layout, Image as ImageIcon } from "lucide-react";
import { AIGenerator } from "./AIGenerator";

export function Sidebar() {
    return (
        <div className="w-full h-full flex flex-col bg-background">
            <AIGenerator />

            <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
                <div>
                    <h2 className="font-semibold text-lg mb-2">Components</h2>
                    <div className="grid grid-cols-2 gap-2">
                        <DraggableSidebarItem type="container" icon={<Layout size={20} />} label="Container" />
                        <DraggableSidebarItem type="card" icon={<Layout size={20} />} label="Card" />
                        <DraggableSidebarItem type="heading" icon={<Type size={20} />} label="Heading" />
                        <DraggableSidebarItem type="text" icon={<Type size={20} />} label="Text" />
                        <DraggableSidebarItem type="button" icon={<MousePointer2 size={20} />} label="Button" />
                        <DraggableSidebarItem type="input" icon={<Box size={20} />} label="Input" />
                        <DraggableSidebarItem type="image" icon={<ImageIcon size={20} />} label="Image" />
                        <DraggableSidebarItem type="link" icon={<Type size={20} />} label="Link" />
                        <DraggableSidebarItem type="icon" icon={<Box size={20} />} label="Icon" />
                        <DraggableSidebarItem type="avatar" icon={<ImageIcon size={20} />} label="Avatar" />
                    </div>
                </div>

                <div className="mt-4">
                    <h2 className="font-semibold text-lg mb-2">Templates</h2>
                    <div className="flex flex-col gap-2">
                        <DraggableSidebarItem type="login-form" icon={<Layout size={20} />} label="Login Form" />
                        <DraggableSidebarItem type="register-form" icon={<Layout size={20} />} label="Register Form" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function DraggableSidebarItem({ type, icon, label }: { type: string; icon: React.ReactNode; label: string }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `sidebar-${type}`,
        data: {
            type,
            isSidebarItem: true,
        },
    });

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="flex flex-col items-center justify-center p-4 border rounded-md cursor-grab hover:bg-accent transition-colors bg-card"
        >
            <div className="mb-2">{icon}</div>
            <span className="text-xs font-medium">{label}</span>
        </div>
    );
}
