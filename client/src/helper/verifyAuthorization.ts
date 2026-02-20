import { redirect } from "react-router-dom";

interface AuthResponse {
  message: string;
  verdict: boolean;
}

const verifyUserSession = async () => {
  const storedToken = localStorage.getItem("session_token");

  if (!storedToken) {
    console.error("No token found");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/auth", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storedToken}`,
        "Content-Type": "applications/json",
      },
    });
    const responseJson: AuthResponse = await response.json();

    if (response.ok) {
      console.log(responseJson.message);
      return responseJson.verdict;
    } else {
      console.error(responseJson.message);
      return responseJson.verdict;
    }
  } catch (err) {
    console.error("Network error during verification:", err);
    return false;
  }
};

const jwtAuthLoader = async () => {
  const isAuthorized = await verifyUserSession();
  if (!isAuthorized) {
    throw redirect("/login");
  }
  return null;
};

export default jwtAuthLoader;
