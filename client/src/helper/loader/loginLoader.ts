import { redirect } from "react-router-dom";
import { verifySession } from "../verifySession.ts";

export const loginLoader = async () => {
  const isAuthorized = await verifySession();
  if (isAuthorized) {
    throw redirect("/approve");
  }
  return null;
};
