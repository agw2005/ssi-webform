import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Submit from "./pages/Submit.tsx";
import Budget from "./pages/Budget.tsx";
import Login from "./pages/Login.tsx";
import Manual from "./pages/Manual.tsx";
import Request from "./pages/Request.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/login" element={<Login />} />
        <Route path="/manual" element={<Manual />} />
        <Route path="/request/:requestId" element={<Request />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
