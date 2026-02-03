import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Submit from "./pages/Submit.tsx";
import Budget from "./pages/Budget.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/budget" element={<Budget />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
