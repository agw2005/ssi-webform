import type { RouterContext } from "@oak/oak";
import getKey from "./getKey.ts";
import { verify } from "@zaubrik/djwt";
import type { VerifyResponse } from "./type.d.ts";
import { getLogger } from "@logtape/logtape";

const logger = getLogger("webform-oak-server");

export const verifyJwt = async (ctx: RouterContext<"/verify">) => {
  const route = "/jwt/verify";
  logger.info(
    `User accessed route "${route}"`,
  );

  const jwtKey = await getKey();
  const headers: Headers = ctx.request.headers;
  const authHeader = headers.get("Authorization");

  if (!authHeader) {
    ctx.response.status = 401;
    ctx.response.body = { message: "No authorization detected" };
    logger.info(
      `Failure on route ${route} : authHeader is null`,
    );
    return;
  }

  const clientJwtToken = authHeader.split(" ")[1];

  if (!clientJwtToken) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Invalid JWT" };
    logger.info(
      `Failure on route ${route} : clientJwtToken is null`,
    );
    return;
  }

  try {
    const decoded = (await verify(
      clientJwtToken,
      jwtKey,
    )) as unknown as VerifyResponse;

    logger.info(
      `Values of decoded are...`,
    );
    logger.info(
      `exp : ${decoded.exp}`,
    );
    logger.info(
      `iss : ${decoded.iss}`,
    );
    logger.info(
      `nameUser : ${decoded.nameUser}`,
    );
    logger.info(
      `nrp : ${decoded.nrp}`,
    );
    logger.info(
      `userId : ${decoded.userId}`,
    );
    logger.info(
      `userName : ${decoded.userName}`,
    );

    if (decoded) {
      ctx.response.status = 200;
      ctx.response.body = decoded;
      logger.info(
        `Successfully verified JWT`,
      );
    } else {
      ctx.response.status = 401;
      ctx.response.body = { message: "JWT is no longer valid" };
      logger.info(
        `Failure on route ${route} : JWT is no longer valid`,
      );
    }
  } catch (err) {
    console.error(err);
    logger.warn(
      `Failure on route ${route} : Caught an error ${err}`,
    );
  }
};
