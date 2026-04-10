import type { Context } from "@oak/oak/context";

/**
 * Function that adds necessary headers to handle CORS in Oak.
 * @param ctx Oak context object
 */
export const handleCors = (ctx: Context) => {
  ctx.response.headers.set(
    "Access-Control-Allow-Origin",
    `http://${Deno.env.get("CLIENT_HOST")}:${Deno.env.get("CLIENT_PORT")}`,
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  ctx.response.headers.set("Access-Control-Max-Age", "86400");

  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204;
    return;
  }
};
