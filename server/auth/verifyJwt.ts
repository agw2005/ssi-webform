import type { RouterContext } from "@oak/oak";
import getKey from "./getKey.ts";
import { verify } from "@zaubrik/djwt";
import type { VerifyResponse } from "./type.d.ts";

export const verifyJwt = async (ctx: RouterContext<"/jwt/verify">) => {
  const jwtKey = await getKey();
  const headers: Headers = ctx.request.headers;
  const authHeader = headers.get("Authorization");

  if (!authHeader) {
    ctx.response.status = 401;
    ctx.response.body = { message: "No authorization detected" };
    return;
  }

  const clientJwtToken = authHeader.split(" ")[1];

  if (!clientJwtToken) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Invalid JWT" };
    return;
  }

  try {
    const decoded = (await verify(
      clientJwtToken,
      jwtKey,
    )) as unknown as VerifyResponse;

    if (decoded) {
      ctx.response.status = 200;
      ctx.response.body = decoded;
    } else {
      ctx.response.status = 401;
      ctx.response.body = { message: "JWT is no longer valid" };
    }
  } catch (err) {
    console.error(err);
  }
};
