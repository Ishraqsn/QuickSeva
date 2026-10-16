import React from "react";
import { createRoot } from "react-dom/client";
import MobileApp from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MobileApp />
  </React.StrictMode>,
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("QuickSeva offline support could not be registered:", error);
    });
  });
}
