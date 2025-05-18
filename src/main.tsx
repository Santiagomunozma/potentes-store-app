import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Providers } from "./components/providers.tsx";
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers />
    </BrowserRouter>
  </StrictMode>
);
