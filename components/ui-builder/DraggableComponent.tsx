"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "re-resizable";
import { useBuilder, ComponentData } from "./BuilderContext";
import { cn } from "@/lib/utils"; // Assuming cn utility exists, otherwise I'll use clsx/tailwind-merge directly or create it

// Placeholder components
const ButtonComponent = ({ props }: { props: any }) => (
    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 transition-colors">
        {props.label || "Button"}
    </button>
);

const TextComponent = ({ props }: { props: any }) => (
    <p className="text-foreground">{props.text || "Text Block"}</p>
);

const InputComponent = ({ props }: { props: any }) => (
    <input
        className="px-3 py-2 border rounded-md w-full bg-background text-foreground"
        placeholder={props.placeholder || "Input field"}
    />
);

const ImageComponent = ({ props }: { props: any }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
        src={props.src || "https://placehold.co/600x400"}
        alt="Placeholder"
        className="max-w-full h-auto rounded-md border"
    />
);

const ContainerComponent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("min-h-[100px] min-w-[100px] border border-dashed border-muted-foreground/50 p-4 rounded-md bg-background/50", className)}>
        {children}
    </div>
);

export function DraggableComponent({ component }: { component: ComponentData }) {
    const { selectComponent, selectedId, updateComponent } = useBuilder();
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: component.id,
        data: {
            type: component.type,
            isComponent: true,
            component,
        },
    });

    const isRelative = component.props.position === 'relative';

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        position: isRelative ? 'relative' : 'absolute',
        left: isRelative ? 'auto' : (component.props.x || 0),
        top: isRelative ? 'auto' : (component.props.y || 0),
        zIndex: isDragging ? 1000 : 1,
        ...component.style,
    };

    const isSelected = selectedId === component.id;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectComponent(component.id);
    };

    const handleResizeStop = (e: any, direction: any, ref: any, d: any) => {
        updateComponent(component.id, {
            props: {
                ...component.props,
                width: (component.props.width || 0) + d.width,
                height: (component.props.height || 0) + d.height,
            }
        });
    };

    const renderContent = () => {
        switch (component.type) {
            case "button":
                return <ButtonComponent props={component.props} />;
            case "text":
                return <TextComponent props={component.props} />;
            case "input":
                return <InputComponent props={component.props} />;
            case "image":
                return <ImageComponent props={component.props} />;
            case "container":
                return <ContainerComponent>{component.children?.map(child => <DraggableComponent key={child.id} component={child} />)}</ContainerComponent>;
            default:
                return <div>Unknown component</div>;
        }
    };

    // If we are dragging, we disable resizing to avoid conflicts
    // Also, we only enable resizing if selected

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                className={cn(
                    "cursor-move absolute",
                    isSelected && "ring-2 ring-primary ring-offset-2",
                    "opacity-50"
                )}
            >
                {renderContent()}
            </div>
        );
    }

    return (
        <div
            style={style}
            className="absolute"
            onClick={handleClick}
        >
            <Resizable
                size={{ width: component.props.width || 'auto', height: component.props.height || 'auto' }}
                onResizeStop={handleResizeStop}
                enable={isSelected ? undefined : false} // Only resize when selected
                className={cn(
                    isSelected && "ring-2 ring-primary ring-offset-2"
                )}
            >
                <div
                    ref={setNodeRef}
                    {...listeners}
                    {...attributes}
                    className="w-full h-full cursor-move"
                >
                    {renderContent()}
                </div>
                {isSelected && (
                    <div className="absolute -top-6 left-0 bg-primary text-primary-foreground text-[10px] px-1 rounded pointer-events-none">
                        {component.type}
                    </div>
                )}
            </Resizable>
        </div>
    );
}
