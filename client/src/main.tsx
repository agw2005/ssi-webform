import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Submit from "./pages/Submit.tsx";
import Budget from "./pages/Budget.tsx";
import Login from "./pages/Login.tsx";
import Manual from "./pages/Manual.tsx";
import Request from "./pages/Request.tsx";
import Approve from "./pages/Approve.tsx";
import { verifyIsNotAuthorized } from "./helper/verifyIsNotAuthorized.ts";
import { verifyIsAuthorized } from "./helper/verifyIsAuthorized.ts";
import LoadingFallback from "./components/LoadingFallback.tsx";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/submit", element: <Submit /> },
  { path: "/budget", element: <Budget /> },
  {
    path: "/login",
    element: <Login />,
    loader: verifyIsAuthorized,
    hydrateFallbackElement: <LoadingFallback />,
  },
  { path: "/manual", element: <Manual /> },
  {
    path: "/approve",
    element: <Approve />,
    loader: verifyIsNotAuthorized,
    hydrateFallbackElement: <LoadingFallback />,
  },
  { path: "/request/:requestId", element: <Request /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
