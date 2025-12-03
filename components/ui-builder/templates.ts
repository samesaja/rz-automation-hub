import { ComponentData } from "./BuilderContext";
import { v4 as uuidv4 } from "uuid";

export const TEMPLATES: Record<string, (x: number, y: number) => ComponentData> = {
    "login-form": (x, y) => ({
        id: `container-${uuidv4()}`,
        type: "container",
        props: {
            x,
            y,
            width: 400,
            height: 350,
            className: "bg-white shadow-lg rounded-lg p-6 flex flex-col gap-4",
        },
        style: {
            backgroundColor: "#ffffff",
            padding: "24px",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
        },
        children: [
            {
                id: `text-${uuidv4()}`,
                type: "text",
                props: {
                    text: "Login",
                    className: "text-2xl font-bold text-center mb-4",
                    position: "relative",
                },
                style: {
                    fontSize: "24px",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "16px",
                }
            },
            {
                id: `input-${uuidv4()}`,
                type: "input",
                props: {
                    placeholder: "Email",
                    className: "w-full border p-2 rounded",
                    position: "relative",
                },
            },
            {
                id: `input-${uuidv4()}`,
                type: "input",
                props: {
                    placeholder: "Password",
                    type: "password",
                    className: "w-full border p-2 rounded",
                    position: "relative",
                },
            },
            {
                id: `button-${uuidv4()}`,
                type: "button",
                props: {
                    label: "Sign In",
                    className: "w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700",
                    position: "relative",
                },
                style: {
                    backgroundColor: "#2563eb",
                    color: "white",
                    padding: "8px",
                    borderRadius: "4px",
                    width: "100%",
                }
            },
        ],
    }),
    "register-form": (x, y) => ({
        id: `container-${uuidv4()}`,
        type: "container",
        props: {
            x,
            y,
            width: 400,
            height: 450,
            className: "bg-white shadow-lg rounded-lg p-6 flex flex-col gap-4",
        },
        style: {
            backgroundColor: "#ffffff",
            padding: "24px",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
        },
        children: [
            {
                id: `text-${uuidv4()}`,
                type: "text",
                props: {
                    text: "Create Account",
                    className: "text-2xl font-bold text-center mb-4",
                    position: "relative",
                },
                style: {
                    fontSize: "24px",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "16px",
                }
            },
            {
                id: `input-${uuidv4()}`,
                type: "input",
                props: {
                    placeholder: "Full Name",
                    className: "w-full border p-2 rounded",
                    position: "relative",
                },
            },
            {
                id: `input-${uuidv4()}`,
                type: "input",
                props: {
                    placeholder: "Email",
                    className: "w-full border p-2 rounded",
                    position: "relative",
                },
            },
            {
                id: `input-${uuidv4()}`,
                type: "input",
                props: {
                    placeholder: "Password",
                    type: "password",
                    className: "w-full border p-2 rounded",
                    position: "relative",
                },
            },
            {
                id: `button-${uuidv4()}`,
                type: "button",
                props: {
                    label: "Register",
                    className: "w-full bg-green-600 text-white p-2 rounded hover:bg-green-700",
                    position: "relative",
                },
                style: {
                    backgroundColor: "#16a34a",
                    color: "white",
                    padding: "8px",
                    borderRadius: "4px",
                    width: "100%",
                }
            },
        ],
    }),
};
