"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";

export type ComponentType = "container" | "button" | "text" | "input" | "image";

export interface ComponentData {
    id: UniqueIdentifier;
    type: ComponentType;
    props: Record<string, any>;
    children?: ComponentData[];
    parentId?: UniqueIdentifier | null;
    style?: React.CSSProperties;
    className?: string; // For Tailwind classes
}

interface BuilderContextType {
    components: ComponentData[];
    selectedId: UniqueIdentifier | null;
    selectComponent: (id: UniqueIdentifier | null) => void;
    addComponent: (component: ComponentData, parentId?: UniqueIdentifier | null) => void;
    updateComponent: (id: UniqueIdentifier, updates: Partial<ComponentData>) => void;
    removeComponent: (id: UniqueIdentifier) => void;
    moveComponent: (id: UniqueIdentifier, newParentId: UniqueIdentifier | null, index?: number) => void;
    setComponents: (components: ComponentData[]) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
    const [components, setComponents] = useState<ComponentData[]>([]);
    const [selectedId, setSelectedId] = useState<UniqueIdentifier | null>(null);

    const selectComponent = useCallback((id: UniqueIdentifier | null) => {
        setSelectedId(id);
    }, []);

    const addComponent = useCallback((component: ComponentData, parentId: UniqueIdentifier | null = null) => {
        setComponents((prev) => {
            // If adding to root
            if (!parentId) {
                return [...prev, { ...component, parentId: null }];
            }

            // Helper to recursively find parent and add child
            const addToParent = (nodes: ComponentData[]): ComponentData[] => {
                return nodes.map((node) => {
                    if (node.id === parentId) {
                        return {
                            ...node,
                            children: [...(node.children || []), { ...component, parentId }],
                        };
                    }
                    if (node.children) {
                        return {
                            ...node,
                            children: addToParent(node.children),
                        };
                    }
                    return node;
                });
            };

            return addToParent(prev);
        });
    }, []);

    const updateComponent = useCallback((id: UniqueIdentifier, updates: Partial<ComponentData>) => {
        setComponents((prev) => {
            const updateNode = (nodes: ComponentData[]): ComponentData[] => {
                return nodes.map((node) => {
                    if (node.id === id) {
                        return { ...node, ...updates };
                    }
                    if (node.children) {
                        return {
                            ...node,
                            children: updateNode(node.children),
                        };
                    }
                    return node;
                });
            };
            return updateNode(prev);
        });
    }, []);

    const removeComponent = useCallback((id: UniqueIdentifier) => {
        setComponents((prev) => {
            const removeNode = (nodes: ComponentData[]): ComponentData[] => {
                return nodes
                    .filter((node) => node.id !== id)
                    .map((node) => {
                        if (node.children) {
                            return {
                                ...node,
                                children: removeNode(node.children),
                            };
                        }
                        return node;
                    });
            };
            return removeNode(prev);
        });
        if (selectedId === id) setSelectedId(null);
    }, [selectedId]);

    const moveComponent = useCallback((id: UniqueIdentifier, newParentId: UniqueIdentifier | null, index?: number) => {
        // This is a complex operation, simplified for now to just "move"
        // In a real implementation, we'd need to extract the node and insert it elsewhere
        // For now, we'll leave this as a placeholder or implement basic reordering later
        console.log("moveComponent not fully implemented yet", id, newParentId, index);
    }, []);

    return (
        <BuilderContext.Provider
            value={{
                components,
                selectedId,
                selectComponent,
                addComponent,
                updateComponent,
                removeComponent,
                moveComponent,
                setComponents,
            }}
        >
            {children}
        </BuilderContext.Provider>
    );
}

export function useBuilder() {
    const context = useContext(BuilderContext);
    if (context === undefined) {
        throw new Error("useBuilder must be used within a BuilderProvider");
    }
    return context;
}
