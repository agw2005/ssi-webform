import type { RouterContext } from "@oak/oak";
import type { UserMasterAuthInformation } from "../models/UserMaster.d.ts";
import { create, getNumericDate } from "@zaubrik/djwt";
import type { Payload, Header } from "@zaubrik/djwt";
import rebuildKey from "./rebuildKey.ts";

const jwtKey = await rebuildKey();

const jwtHeader: Header = { alg: "HS512", type: "JWT" };

const expirationOneHour = getNumericDate(60 * 60);

const login = async (ctx: RouterContext<"/login">) => {
  const { value } = await ctx.request.body.json();
  let page = 1;
  let response = await fetch(`http://localhost:8000/authInfo/${page}`);
  let userMasters: UserMasterAuthInformation[] = await response.json();
  while (userMasters.length !== 0) {
    for (const userMaster of userMasters) {
      if (
        value.NRP === userMaster.NRP &&
        value.Password === userMaster.Password
      ) {
        const jwtPayload: Payload = {
          iss: userMaster.NRP,
          exp: expirationOneHour,
        };
        const jwt = await create(jwtHeader, jwtPayload, jwtKey);
        if (jwt) {
          ctx.response.status = 200;
          ctx.response.body = {
            NRP: userMaster.NRP,
            jwt,
          };
        } else {
          ctx.response.status = 500;
          ctx.response.body = {
            message: "JWT Token did not exist despite correct credentials.",
          };
        }
        return;
      }
    }
    page += 1;
    response = await fetch(`http://localhost:8000/authInfo/${page}`);
    userMasters = await response.json();
  }
  ctx.response.status = 422;
  ctx.response.body = {
    message: "Invalid Credentials.",
  };
};

export default login;
