import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { analyticsPromise } from "@/lib/firebase";

void analyticsPromise;

createRoot(document.getElementById("root")!).render(<App />);
