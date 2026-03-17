import { useEffect, useState } from "react";
import { verifySession } from "../helper/verifySession.ts";
import type { VerifyResponse } from "@scope/server";

const useAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [authIsLoading, setAuthIsLoading] = useState<boolean>(true);
  const [authInfo, setAuthInfo] = useState<VerifyResponse | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const response = await verifySession();
      setAuthInfo(response);
      setIsAuthorized(!!response);
      setAuthIsLoading(false);
    };

    checkSession();
  }, []);

  return { isAuthorized, authIsLoading, authInfo };
};

export default useAuth;
