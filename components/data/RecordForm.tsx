"use client";

import { useState, useEffect } from "react";
import { X, Save, Calendar as CalendarIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface Field {
    name: string;
    type: string;
    required: boolean;
    options?: any;
}

interface RecordFormProps {
    collectionName: string;
    schema: Field[];
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    onCancel: () => void;
}

export function RecordForm({ collectionName, schema, initialData, onSave, onCancel }: RecordFormProps) {
    const [formData, setFormData] = useState<any>(initialData || {});
    const [loading, setLoading] = useState(false);

    // Initialize default values for new records
    useEffect(() => {
        if (!initialData) {
            const defaults: any = {};
            schema.forEach(field => {
                if (field.type === 'bool') defaults[field.name] = false;
            });
            setFormData(defaults);
        }
    }, [schema, initialData]);

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderField = (field: Field) => {
        const value = formData[field.name];

        switch (field.type) {
            case 'bool':
                return (
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!value}
                            onChange={(e) => handleChange(field.name, e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{field.name}</span>
                    </div>
                );
            case 'number':
                return (
                    <input
                        type="number"
                        value={value || ''}
                        onChange={(e) => handleChange(field.name, e.target.valueAsNumber)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter ${field.name}`}
                    />
                );
            case 'email':
                return (
                    <input
                        type="email"
                        value={value || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter ${field.name}`}
                    />
                );
            case 'url':
                return (
                    <input
                        type="url"
                        value={value || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://..."
                    />
                );
            case 'date':
                return (
                    <div className="relative">
                        <input
                            type="datetime-local"
                            value={value ? new Date(value).toISOString().slice(0, 16) : ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                );
            case 'select':
                return (
                    <select
                        value={value || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="">Select option</option>
                        {field.options?.values?.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                );
            case 'json':
                return (
                    <textarea
                        value={typeof value === 'object' ? JSON.stringify(value, null, 2) : (value || '')}
                        onChange={(e) => {
                            // Try to parse JSON on change, or just keep string if invalid
                            try {
                                const parsed = JSON.parse(e.target.value);
                                handleChange(field.name, parsed);
                            } catch (err) {
                                handleChange(field.name, e.target.value);
                            }
                        }}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs h-32"
                        placeholder="{ ... }"
                    />
                );
            case 'file':
                return (
                    <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">File upload not supported in this simplified editor yet.</p>
                    </div>
                );
            case 'text':
            default:
                if (field.options?.max && field.options?.max > 255) {
                    return (
                        <textarea
                            value={value || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                            placeholder={`Enter ${field.name}`}
                        />
                    );
                }
                return (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter ${field.name}`}
                    />
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {initialData ? 'Edit Record' : 'New Record'}
                        <span className="text-xs font-normal text-gray-500 ml-2">in {collectionName}</span>
                    </h3>
                    <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {schema.map(field => (
                        <div key={field.name} className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                {field.name}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {renderField(field)}
                        </div>
                    ))}
                    {schema.length === 0 && (
                        <p className="text-gray-500 italic text-center py-4">No custom fields in this collection.</p>
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50 rounded-b-xl flex items-center justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Record
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
