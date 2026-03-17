import type { LoginPayload } from "./type.d.ts";

export const jwtRequestPayload = (payload: LoginPayload) => {
  const Request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  return Request;
};
