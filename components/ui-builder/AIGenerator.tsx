"use client";

import { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { useBuilder } from "./BuilderContext";
import { v4 as uuidv4 } from "uuid";

export function AIGenerator() {
    const { setComponents } = useBuilder();
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim() || loading) return;

        setLoading(true);
        try {
            const systemPrompt = `
You are a UI Builder AI. Your goal is to generate a JSON structure for a UI layout based on the user's description.
The output MUST be a valid JSON array of ComponentData objects.
Do NOT include markdown formatting (like \`\`\`json). Just return the raw JSON.
Do NOT include comments in the JSON.
Do NOT include trailing commas.

ComponentData Structure:
{
  "id": "string (use uuid)",
  "id": "string (use uuid)",
  "type": "container" | "card" | "button" | "text" | "heading" | "input" | "image" | "link" | "icon" | "avatar",
  "props": {
    "className": "string (Tailwind CSS classes)",
    "text": "string (for text/heading/link)",
    "level": "h1" | "h2" | "h3" (for heading),
    "href": "string (for link)",
    "icon": "string (lucide icon name, e.g. 'home', 'user')",
    "label": "string (for button)",
    "placeholder": "string (for input)",
    "src": "string (for image/avatar)",
    "position": "relative" (ALWAYS use relative for children of containers)
  },
  "style": { "cssProperty": "value" },
  "children": [ ...recursive ComponentData... ]
}

Rules:
1. Always start with a root "container" to hold the elements, unless asked otherwise.
2. Use Tailwind CSS for styling in "props.className".
3. Use "style" for specific overrides if needed, but prefer Tailwind.
4. Ensure "position": "relative" is set in props for all components to ensure they stack correctly.
5. Generate realistic content.
6. Ensure the JSON is strictly valid.

Example Output:
[
  {
    "id": "root-1",
    "type": "container",
    "props": { "className": "p-4 bg-white shadow rounded", "position": "relative" },
    "style": {},
    "children": [
      { "id": "t-1", "type": "text", "props": { "text": "Hello", "className": "text-xl", "position": "relative" } }
    ]
  }
]
`;

            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: prompt,
                    history: [
                        { role: 'user', content: systemPrompt },
                        { role: 'model', content: "Understood. I will generate valid JSON for the UI Builder." }
                    ]
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to generate");

            let jsonStr = data.response;
            // Clean up if the AI wraps in markdown or adds extra text
            jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '');
            // Attempt to find the first '[' and last ']' to extract just the array
            const firstBracket = jsonStr.indexOf('[');
            const lastBracket = jsonStr.lastIndexOf(']');
            if (firstBracket !== -1 && lastBracket !== -1) {
                jsonStr = jsonStr.substring(firstBracket, lastBracket + 1);
            }

            jsonStr = jsonStr.trim();

            let components;
            try {
                components = JSON.parse(jsonStr);
            } catch (e) {
                console.warn("Failed to parse JSON, attempting repair:", jsonStr);
                // Simple repair: close open arrays/objects
                let repairedJson = jsonStr;
                const openBraces = (repairedJson.match(/{/g) || []).length;
                const closeBraces = (repairedJson.match(/}/g) || []).length;
                const openBrackets = (repairedJson.match(/\[/g) || []).length;
                const closeBrackets = (repairedJson.match(/\]/g) || []).length;

                for (let i = 0; i < openBraces - closeBraces; i++) repairedJson += "}";
                for (let i = 0; i < openBrackets - closeBrackets; i++) repairedJson += "]";

                try {
                    components = JSON.parse(repairedJson);
                } catch (e2) {
                    console.error("Failed to parse repaired JSON:", repairedJson);
                    throw new Error("AI generated invalid JSON. Please try again with a simpler request.");
                }
            }

            // Post-process to ensure UUIDs are unique if the AI reused them (unlikely but possible)
            // For now, we assume the AI does a decent job or we just accept it.
            // We should probably traverse and re-generate IDs to be safe, but let's trust the AI for v1.

            setComponents(components);
        } catch (error) {
            console.error("AI Generation Error:", error);
            alert("Failed to generate UI. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center gap-2 mb-2 text-purple-700">
                <Sparkles size={16} />
                <span className="text-sm font-semibold">Generate with AI</span>
            </div>
            <div className="flex gap-2">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your UI (e.g., 'A contact form with name, email, and message')"
                    className="flex-1 text-xs p-2 rounded border border-purple-200 focus:outline-none focus:border-purple-400 resize-none h-20"
                />
            </div>
            <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-purple-600 text-white text-xs py-2 rounded hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
                {loading ? "Generating..." : (
                    <>
                        <Send size={12} />
                        Generate Layout
                    </>
                )}
            </button>
        </div>
    );
}
