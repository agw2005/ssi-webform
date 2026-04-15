import { verifyJwtPayload } from "@scope/server-ssms";
import type { VerifyResponse } from "@scope/server-ssms";
import { webformAPI } from "./apis.ts";

export const verifySession = async (): Promise<VerifyResponse | null> => {
  const storedToken = sessionStorage.getItem("session_token");

  if (!storedToken) return null;

  try {
    const response = await fetch(
      webformAPI.VerifyToken,
      verifyJwtPayload(storedToken),
    );
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
