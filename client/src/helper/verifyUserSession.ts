import type { AuthResponse } from "@scope/server";

const verifyUserSession = async () => {
  const storedToken = sessionStorage.getItem("session_token");

  if (!storedToken) {
    // console.error("No token found");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/auth", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storedToken}`,
        "Content-Type": "application/json",
      },
    });
    const responseJson: AuthResponse = await response.json();

    if (response.ok) {
      // console.log(responseJson.message);
      return responseJson.message || "Session expired";
    } else {
      // console.error(responseJson.message);
      sessionStorage.removeItem("session_token");
      return responseJson.message;
    }
  } catch (err) {
    console.error("Network error during verification:", err);
    sessionStorage.removeItem("session_token");
    return false;
  }
};

export default verifyUserSession;
