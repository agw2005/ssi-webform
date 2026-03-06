import type { RouterContext } from "@oak/oak";
import type { UserMasterAuthInformation } from "../models/UserMaster.d.ts";
import { create, getNumericDate } from "@zaubrik/djwt";
import type { Payload, Header } from "@zaubrik/djwt";
import rebuildKey from "./rebuildKey.ts";
import type { RequestPayload, Response } from "./types.ts";

const ENCRYPTION_ALGORITHM = "HS512";
const AUTHORIZED_MESSAGE = "Valid credentials";
const UNAUTHORIZED_MESSAGE = "Invalid credentials";
const GEN_ERR_MESSAGE = "There was an error in generating the token";

const jwtKey = await rebuildKey();

const jwtHeader: Header = { alg: ENCRYPTION_ALGORITHM, type: "JWT" };

const login = async (ctx: RouterContext<"/login">) => {
  const request: RequestPayload = await ctx.request.body.json();
  let page = 1;
  let response = await fetch(`http://localhost:8000/authInfo/${page}`);
  let userMasters: UserMasterAuthInformation[] = await response.json();
  while (userMasters.length !== 0) {
    for (const userMaster of userMasters) {
      const correctNrp = request.nrp === userMaster.NRP;
      const correctPassword = request.password === userMaster.Password;
      if (correctNrp && correctPassword) {
        const oneHourExpiration = getNumericDate(60);
        const jwtPayload: Payload = {
          iss: userMaster.NRP,
          exp: oneHourExpiration,
        };
        const jwt = await create(jwtHeader, jwtPayload, jwtKey);
        if (jwt) {
          const validResponse: Response = {
            message: AUTHORIZED_MESSAGE,
            nrp: userMaster.NRP,
            jwt,
          };
          ctx.response.status = 200;
          ctx.response.body = validResponse;
        } else {
          const generationErrResponse: Response = {
            message: GEN_ERR_MESSAGE,
            nrp: userMaster.NRP,
            jwt: "",
          };
          ctx.response.status = 500;
          ctx.response.body = generationErrResponse;
        }
        return;
      }
    }
    page += 1;
    response = await fetch(`http://localhost:8000/authInfo/${page}`);
    userMasters = await response.json();
  }
  const responseBody: Response = {
    message: UNAUTHORIZED_MESSAGE,
    nrp: "",
    jwt: "",
  };
  ctx.response.status = 401;
  ctx.response.body = responseBody;
};

export default login;
