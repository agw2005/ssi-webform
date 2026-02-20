import { redirect } from "react-router-dom";
import verifyUserSession from "./verifyUserSession.ts";

export const verifyIsAuthorized = async () => {
  const isAuthorized = await verifyUserSession();
  if (isAuthorized) {
    throw redirect("/approve");
  }
  return null;
};
