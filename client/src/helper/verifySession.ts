import serverDomain from "./serverDomain.ts";
import { verifyJwtPayload } from "@scope/server";
import type { VerifyResponse } from "@scope/server";

const VERIFY_JWT_URL = `${serverDomain}/jwt/verify`;

export const verifySession = async (): Promise<VerifyResponse | null> => {
  const storedToken = sessionStorage.getItem("session_token");

  if (!storedToken) return null;

  try {
    const response = await fetch(VERIFY_JWT_URL, verifyJwtPayload(storedToken));
    const responseJson: VerifyResponse = await response.json();

    if (response.ok) {
      return responseJson;
    } else {
      console.error(response.status);
      sessionStorage.removeItem("session_token");
      return null;
    }
  } catch (err) {
    console.error("Network error during verification:", err);
    sessionStorage.removeItem("session_token");
    return null;
  }
};
