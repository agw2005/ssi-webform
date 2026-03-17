import type { RouterContext } from "@oak/oak";
import { create, getNumericDate } from "@zaubrik/djwt";
import type { Payload, Header } from "@zaubrik/djwt";
import getKey from "./getKey.ts";
import type { AuthInfo } from "../models/UserMaster.d.ts";
import type { LoginPayload, LoginResponse } from "./type.d.ts";
const ENCRYPTION_ALGORITHM = "HS512";
const AUTHORIZED_MESSAGE = "Valid credentials";
const UNAUTHORIZED_MESSAGE = "Invalid credentials";
const GEN_ERR_MESSAGE = "There was an error in generating the token";

const jwtKey = await getKey();
const jwtHeader: Header = { alg: ENCRYPTION_ALGORITHM, type: "JWT" };
const nineHourExpiration = getNumericDate(60 * 60 * 9);

const requestJwt = async (ctx: RouterContext<"/jwt/request">) => {
  const request: LoginPayload = await ctx.request.body.json();
  const response = await fetch(
    `http://${Deno.env.get("SERVER_HOST")}:${Deno.env.get("SERVER_PORT")}/usermaster/auth`,
  );
  const credentials: AuthInfo[] = await response.json();

  for (const credential of credentials) {
    const validNrp = credential.NRP === request.nrp;
    const validPassword = credential.Password === request.password;

    if (validNrp && validPassword) {
      const jwtPayload: Payload = {
        iss: credential.NRP,
        exp: nineHourExpiration,
        userId: credential.IDUser,
        userName: credential.UserName,
        nameUser: credential.NameUser,
        nrp: credential.NRP,
      };

      const jwt = await create(jwtHeader, jwtPayload, jwtKey);

      if (jwt) {
        const authorizedResponse: LoginResponse = {
          message: AUTHORIZED_MESSAGE,
          nrp: credential.NRP,
          jwt: jwt,
        };
        ctx.response.status = 200;
        ctx.response.body = authorizedResponse;
      } else {
        const errResponse: LoginResponse = {
          message: GEN_ERR_MESSAGE,
          nrp: credential.NRP,
          jwt: "",
        };
        ctx.response.status = 500;
        ctx.response.body = errResponse;
      }
      return;
    }
  }

  const unauthorizedResponse: LoginResponse = {
    message: UNAUTHORIZED_MESSAGE,
    nrp: "",
    jwt: "",
  };

  ctx.response.status = 401;
  ctx.response.body = unauthorizedResponse;
};

export default requestJwt;
