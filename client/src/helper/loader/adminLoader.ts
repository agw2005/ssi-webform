import { redirect } from "react-router-dom";
import { verifySession } from "../verifySession.ts";

export const adminLoader = async () => {
  const isAuthorized = await verifySession();
  const isAdmin = isAuthorized?.userId === 1;
  if (!isAuthorized) throw redirect("/login");
  if (!isAdmin) throw redirect("/approve");

  return null;
};
