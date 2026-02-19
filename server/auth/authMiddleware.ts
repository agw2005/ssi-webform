import type { Context, Next } from "@oak/oak";
import { verify } from "@zaubrik/djwt";
import rebuildKey from "./rebuildKey.ts";

const serverJwtKey = await rebuildKey();

const isAuthenticated = async (ctx: Context, next: Next) => {
  const headers: Headers = ctx.request.headers;
  const authorizationHeader = headers.get("Authorization");
  if (!authorizationHeader) {
    ctx.response.status = 401;
    return;
  }
  const clientJwtToken = authorizationHeader.split(" ")[1];
  if (!clientJwtToken) {
    ctx.response.status = 401;
    return;
  }
  if (await verify(clientJwtToken, serverJwtKey)) {
    await next();
    return;
  }
  ctx.response.status = 401;
  ctx.response.body = { message: "Invalid JWT Token." };
};

export default isAuthenticated;
