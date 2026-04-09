import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./globals.css";
import TanStackQueryProvider from "./lib/TanStackQuery";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TanStackQueryProvider>
      <App />
    </TanStackQueryProvider>
  </StrictMode>,
);
