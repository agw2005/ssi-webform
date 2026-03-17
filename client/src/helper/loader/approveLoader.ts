import { redirect } from "react-router-dom";
import { verifySession } from "../verifySession.ts";

export const approveLoader = async () => {
  const isAuthorized = await verifySession();
  if (!isAuthorized) {
    throw redirect("/login");
  }
  return null;
};
