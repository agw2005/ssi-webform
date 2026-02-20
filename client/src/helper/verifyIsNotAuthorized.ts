import { redirect } from "react-router-dom";
import verifyUserSession from "./verifyUserSession.ts";

export const verifyIsNotAuthorized = async () => {
  const isAuthorized = await verifyUserSession();
  if (!isAuthorized) {
    throw redirect("/login");
  }
  return null;
};
