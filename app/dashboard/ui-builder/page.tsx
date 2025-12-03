"use client";

import React from "react";
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { BuilderProvider, useBuilder } from "@/components/ui-builder/BuilderContext";
import { Sidebar } from "@/components/ui-builder/Sidebar";
import { Canvas } from "@/components/ui-builder/Canvas";
import { PropertyPanel } from "@/components/ui-builder/PropertyPanel";
import { v4 as uuidv4 } from "uuid";
import { TEMPLATES } from "@/components/ui-builder/templates";
import { Resizable } from "re-resizable"; // We might need uuid, but for now I'll use a simple random generator if uuid isn't installed, or install it.

// Wrapper component to use the context
function UIBuilderContent() {
    const { addComponent, updateComponent, components, selectComponent, setComponents } = useBuilder(); // Added selectComponent
    const [layoutName, setLayoutName] = React.useState("My Layout");
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // LocalStorage implementation
            const savedLayouts = JSON.parse(localStorage.getItem('ui_builder_layouts') || '[]');
            const newLayout = { name: layoutName, data: components, updatedAt: new Date().toISOString() };

            // Check if layout with same name exists, update it
            const existingIndex = savedLayouts.findIndex((l: any) => l.name === layoutName);
            if (existingIndex >= 0) {
                savedLayouts[existingIndex] = newLayout;
            } else {
                savedLayouts.push(newLayout);
            }

            localStorage.setItem('ui_builder_layouts', JSON.stringify(savedLayouts));
            alert('Layout saved successfully to LocalStorage!');
        } catch (error) {
            console.error(error);
            alert('Failed to save layout');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoad = async () => {
        setIsLoading(true);
        try {
            const savedLayouts = JSON.parse(localStorage.getItem('ui_builder_layouts') || '[]');
            if (savedLayouts && savedLayouts.length > 0) {
                // For now, just load the last modified or first one
                // Ideally we'd show a list, but let's just load the one matching current name or the last one
                const layoutToLoad = savedLayouts.find((l: any) => l.name === layoutName) || savedLayouts[savedLayouts.length - 1];

                if (layoutToLoad) {
                    setLayoutName(layoutToLoad.name);
                    setComponents(layoutToLoad.data || []);
                    alert('Loaded layout: ' + layoutToLoad.name);
                } else {
                    alert('Layout not found');
                }
            } else {
                alert('No layouts found in LocalStorage');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to load layout');
        } finally {
            setIsLoading(false);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over, delta } = event;

        if (!over) return;

        // If dropping a sidebar item onto the canvas
        if (active.data.current?.isSidebarItem && over.id === "canvas-root") {
            const type = active.data.current.type;

            if (TEMPLATES[type]) {
                addComponent(TEMPLATES[type](50, 50));
            } else {
                // Calculate drop position relative to canvas
                // This is a simplification. Ideally we'd map screen coords to canvas coords.
                // For now, we'll just use a default or try to estimate based on delta if possible, 
                // but delta is 0 for new items usually.
                // Let's just place it at 0,0 or center for now, or use a random offset.
                addComponent({
                    id: `component-${uuidv4()}`,
                    type,
                    props: {
                        x: 50, // Default start position
                        y: 50,
                        width: 200, // Default width
                        height: type === 'container' ? 200 : 'auto',
                    },
                    children: [],
                });
            }
        }
        // If moving an existing component
        else if (active.data.current?.isComponent) {
            const componentId = active.id;
            const component = active.data.current.component;

            // Calculate new position
            const newX = (component.props.x || 0) + delta.x;
            const newY = (component.props.y || 0) + delta.y;

            updateComponent(componentId, {
                props: {
                    ...component.props,
                    x: newX,
                    y: newY,
                }
            });
        }
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="flex flex-col h-[calc(100vh-4rem)]">
                <div className="h-14 border-b bg-background flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <input
                            className="font-semibold bg-transparent border-none focus:outline-none"
                            value={layoutName}
                            onChange={(e) => setLayoutName(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleLoad}
                            disabled={isLoading}
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/90 disabled:opacity-50"
                        >
                            Load Latest
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save Layout'}
                        </button>
                    </div>
                </div>
                <div className="flex flex-1 overflow-hidden">
                    <Resizable
                        defaultSize={{ width: 256, height: '100%' }}
                        minWidth={200}
                        maxWidth={400}
                        enable={{ right: true }}
                        className="border-r bg-background flex flex-col"
                    >
                        <div className="h-full overflow-auto">
                            <Sidebar />
                        </div>
                    </Resizable>

                    <Canvas />

                    <Resizable
                        defaultSize={{ width: 320, height: '100%' }}
                        minWidth={250}
                        maxWidth={500}
                        enable={{ left: true }}
                        className="border-l bg-background flex flex-col"
                    >
                        <div className="h-full overflow-auto">
                            <PropertyPanel />
                        </div>
                    </Resizable>
                </div>
            </div>
            <DragOverlay>
                {/* We can add a drag preview here later */}
            </DragOverlay>
        </DndContext>
    );
}

export default function UIBuilderPage() {
    return (
        <BuilderProvider>
            <UIBuilderContent />
        </BuilderProvider>
    );
}
