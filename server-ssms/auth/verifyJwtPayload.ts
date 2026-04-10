export const verifyJwtPayload = (storedToken: string) => {
  const Request = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  };

  return Request;
};
