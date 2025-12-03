"use client";

import React from "react";
import { useBuilder } from "./BuilderContext";

export function PropertyPanel() {
    const { selectedId, components, updateComponent, removeComponent } = useBuilder();

    // Helper to find component by ID (recursive)
    const findComponent = (nodes: any[], id: any): any => {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = findComponent(node.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedComponent = selectedId ? findComponent(components, selectedId) : null;

    if (!selectedComponent) {
        return (
            <div className="w-full h-full bg-background p-4">
                <h2 className="font-semibold text-lg mb-4">Properties</h2>
                <p className="text-sm text-muted-foreground">Select a component to edit its properties.</p>
            </div>
        );
    }

    const handlePropChange = (key: string, value: any) => {
        updateComponent(selectedComponent.id, {
            props: {
                ...selectedComponent.props,
                [key]: value,
            },
        });
    };

    const handleStyleChange = (key: string, value: any) => {
        updateComponent(selectedComponent.id, {
            style: {
                ...selectedComponent.style,
                [key]: value,
            }
        });
    };

    return (
        <div className="w-full h-full bg-background p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Properties</h2>
                <button
                    onClick={() => removeComponent(selectedComponent.id)}
                    className="text-xs text-destructive hover:underline"
                >
                    Delete
                </button>
            </div>

            <div className="space-y-6">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Component ID</p>
                    <p className="text-xs font-mono truncate">{selectedComponent.id}</p>
                    <p className="text-xs text-muted-foreground uppercase font-bold mt-2">Type</p>
                    <p className="text-sm capitalize">{selectedComponent.type}</p>
                </div>

                {/* Common Props */}
                <div className="space-y-4 border-t pt-4">
                    <h3 className="text-sm font-medium">Basic</h3>

                    {/* Conditional inputs based on type */}
                    {(selectedComponent.type === 'button' || selectedComponent.type === 'text') && (
                        <div className="space-y-2">
                            <label className="text-xs font-medium">Text / Label</label>
                            <input
                                className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                                value={selectedComponent.props.label || selectedComponent.props.text || ""}
                                onChange={(e) => handlePropChange(selectedComponent.type === 'button' ? 'label' : 'text', e.target.value)}
                            />
                        </div>
                    )}

                    {selectedComponent.type === 'input' && (
                        <div className="space-y-2">
                            <label className="text-xs font-medium">Placeholder</label>
                            <input
                                className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                                value={selectedComponent.props.placeholder || ""}
                                onChange={(e) => handlePropChange('placeholder', e.target.value)}
                            />
                        </div>
                    )}

                    {selectedComponent.type === 'image' && (
                        <div className="space-y-2">
                            <label className="text-xs font-medium">Image URL</label>
                            <input
                                className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                                value={selectedComponent.props.src || ""}
                                onChange={(e) => handlePropChange('src', e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* Visual Style Editor */}
                <div className="space-y-4 border-t pt-4">
                    <h3 className="text-sm font-medium">Visual Style</h3>

                    <div className="space-y-2">
                        <label className="text-xs font-medium">Background Color</label>
                        <div className="flex flex-wrap gap-2">
                            {['transparent', '#ffffff', '#f3f4f6', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#000000'].map(color => (
                                <button
                                    key={color}
                                    className={`w-6 h-6 rounded-full border ${selectedComponent.style?.backgroundColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                                    style={{ backgroundColor: color === 'transparent' ? 'white' : color }}
                                    onClick={() => handleStyleChange('backgroundColor', color)}
                                    title={color}
                                >
                                    {color === 'transparent' && <div className="w-full h-full border-red-500 border-t transform rotate-45" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium">Text Color</label>
                        <div className="flex flex-wrap gap-2">
                            {['inherit', '#ffffff', '#000000', '#ef4444', '#3b82f6', '#22c55e'].map(color => (
                                <button
                                    key={color}
                                    className={`w-6 h-6 rounded-full border ${selectedComponent.style?.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                                    style={{ backgroundColor: color === 'inherit' ? 'gray' : color }}
                                    onClick={() => handleStyleChange('color', color)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium">Padding</label>
                        <select
                            className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                            value={selectedComponent.style?.padding || ""}
                            onChange={(e) => handleStyleChange('padding', e.target.value)}
                        >
                            <option value="">None</option>
                            <option value="8px">Small (8px)</option>
                            <option value="16px">Medium (16px)</option>
                            <option value="32px">Large (32px)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium">Border Radius</label>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={parseInt(selectedComponent.style?.borderRadius || "0")}
                            onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
                            className="w-full"
                        />
                        <div className="text-xs text-right text-muted-foreground">{selectedComponent.style?.borderRadius || "0px"}</div>
                    </div>
                </div>

                {/* Advanced Customization */}
                <div className="space-y-4 border-t pt-4">
                    <h3 className="text-sm font-medium">Advanced</h3>
                    <div className="space-y-2">
                        <label className="text-xs font-medium">Tailwind Classes</label>
                        <textarea
                            className="w-full px-3 py-2 border rounded-md text-sm font-mono bg-background min-h-[80px]"
                            placeholder="e.g. shadow-xl hover:opacity-80"
                            value={selectedComponent.props.className || ""}
                            onChange={(e) => handlePropChange('className', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
