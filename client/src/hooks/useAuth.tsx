import { useState, useEffect } from "react";
import verifyUserSession from "../helper/verifyUserSession.ts";

export const useAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSession = async () => {
      const status = await verifyUserSession();
      setIsAuthorized(status ?? false);
      setIsLoading(false);
    };

    checkSession();
  }, []);

  return { isAuthorized, isLoading };
};
