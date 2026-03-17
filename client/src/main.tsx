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
import Usage from "./pages/Usage.tsx";
import Report from "./pages/Report.tsx";
import LoadingFallback from "./components/reusable/LoadingFallback.tsx";
import { approveLoader } from "./helper/loader/approveLoader.ts";
import { loginLoader } from "./helper/loader/loginLoader.ts";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/submit", element: <Submit /> },
  { path: "/budget", element: <Budget /> },
  { path: "/manual", element: <Manual /> },
  { path: "/request/:requestId", element: <Request /> },
  { path: "/usage", element: <Usage /> },
  { path: "/report", element: <Report /> },
  {
    path: "/approve",
    element: <Approve />,
    loader: approveLoader,
    hydrateFallbackElement: <LoadingFallback />,
  },
  {
    path: "/login",
    element: <Login />,
    loader: loginLoader,
    hydrateFallbackElement: <LoadingFallback />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
