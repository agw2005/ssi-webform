import type { Context, Next } from "@oak/oak";
import { verify } from "@zaubrik/djwt";
import rebuildKey from "./rebuildKey.ts";

const UNAUTHORIZED_RESPONSE_CODE = 401;
const UNAUTHORIZED_RESPONSE_MESSAGE = "Invalid JWT token";

const serverJwtKey = await rebuildKey();

const isAuthenticated = async (ctx: Context, next: Next) => {
  const headers: Headers = ctx.request.headers;
  const authorizationHeader = headers.get("Authorization");

  if (!authorizationHeader) {
    ctx.response.status = UNAUTHORIZED_RESPONSE_CODE;
    return;
  }

  const clientJwtToken = authorizationHeader.split(" ")[1];

  if (!clientJwtToken) {
    ctx.response.status = UNAUTHORIZED_RESPONSE_CODE;
    return;
  }

  if (await verify(clientJwtToken, serverJwtKey)) {
    await next();
    return;
  }
  ctx.response.status = UNAUTHORIZED_RESPONSE_CODE;
  ctx.response.body = { message: UNAUTHORIZED_RESPONSE_MESSAGE };
};

export default isAuthenticated;
