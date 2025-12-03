"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { useBuilder } from "./BuilderContext";
import { DraggableComponent } from "./DraggableComponent";


export function Canvas() {
    const { setNodeRef } = useDroppable({
        id: "canvas-root",
    });

    const { components } = useBuilder();

    return (
        <div className="flex-1 bg-muted/20 p-8 overflow-auto relative">
            <div
                ref={setNodeRef}
                className="min-h-[800px] w-full bg-background border border-dashed border-border rounded-lg shadow-sm relative"
            >
                {components.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none">
                        Drag components here
                    </div>
                )}
                {/* Render components here */}
                {components.map((component) => (
                    <DraggableComponent key={component.id} component={component} />
                ))}
            </div>
        </div>
    );
}
