import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LazyMotion, domMax } from "motion/react";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LazyMotion features={domMax}>
      <App />
    </LazyMotion>
  </StrictMode>,
);
