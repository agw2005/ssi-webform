export const verifyJwtPayload = (storedToken: string): {
  method: string;
  headers: {
    Authorization: string;
  };
} => {
  const Request = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  };

  return Request;
};
