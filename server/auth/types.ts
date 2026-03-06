const RequestHeader = {
  "Content-Type": "application/json",
};

export interface RequestPayload {
  nrp: string;
  password: string;
}

// will be used in Login.tsx
export const request = (requestPayload: RequestPayload) => {
  const Request = {
    method: "POST",
    headers: RequestHeader,
    body: JSON.stringify(requestPayload),
  };
  return Request;
};

export interface Response {
  message: string;
  nrp: string;
  jwt: string;
}
