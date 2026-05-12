import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// @ts-expect-error: Allow side-effect import of CSS without type declarations
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
