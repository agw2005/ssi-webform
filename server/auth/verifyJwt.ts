import type { RouterContext } from "@oak/oak";
import getKey from "./getKey.ts";
import { verify } from "@zaubrik/djwt";
import type { VerifyResponse } from "./type.d.ts";
import { getLogger } from "@logtape/logtape";

const logger = getLogger("prism-server");

export const verifyJwt = async (ctx: RouterContext<"/verify">) => {
  const accessId = crypto.randomUUID();

  const route = "/jwt/verify";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );

  const jwtKey = await getKey();
  const headers: Headers = ctx.request.headers;
  const authHeader = headers.get("Authorization");

  if (!authHeader) {
    ctx.response.status = 401;
    ctx.response.body = { message: "No authorization detected" };
    logger.info(
      `Failure on route ${route} : authHeader is null`,
      { accessId: accessId },
    );
    return;
  }

  const clientJwtToken = authHeader.split(" ")[1];

  if (!clientJwtToken) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Invalid JWT" };
    logger.info(
      `Failure on route ${route} : clientJwtToken is null`,
      { accessId: accessId },
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
      { accessId: accessId },
    );
    logger.info(
      `exp : ${decoded.exp}`,
      { accessId: accessId },
    );
    logger.info(
      `iss : ${decoded.iss}`,
      { accessId: accessId },
    );
    logger.info(
      `nameUser : ${decoded.nameUser}`,
      { accessId: accessId },
    );
    logger.info(
      `nrp : ${decoded.nrp}`,
      { accessId: accessId },
    );
    logger.info(
      `userId : ${decoded.userId}`,
      { accessId: accessId },
    );
    logger.info(
      `userName : ${decoded.userName}`,
      { accessId: accessId },
    );

    if (decoded) {
      ctx.response.status = 200;
      ctx.response.body = decoded;
      logger.info(
        `Successfully verified JWT`,
        { accessId: accessId },
      );
    } else {
      ctx.response.status = 401;
      ctx.response.body = { message: "JWT is no longer valid" };
      logger.info(
        `Failure on route ${route} : JWT is no longer valid`,
        { accessId: accessId },
      );
    }
  } catch (err) {
    console.error(err);
    logger.warn(
      `Failure on route ${route} : Caught an error ${err}`,
      { accessId: accessId },
    );
  }
};
