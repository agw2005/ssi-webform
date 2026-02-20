import type { RouterContext } from "@oak/oak";
import type { UserMasterAuthInformation } from "../models/UserMaster.d.ts";
import { create, getNumericDate } from "@zaubrik/djwt";
import type { Payload, Header } from "@zaubrik/djwt";
import rebuildKey from "./rebuildKey.ts";

interface ResponseBody {
  message: string;
  NRP: string;
  jwt: string;
}

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
          const responseBody: ResponseBody = {
            message: "Valid credentials",
            NRP: userMaster.NRP,
            jwt,
          };
          ctx.response.status = 200;
          ctx.response.body = responseBody;
        } else {
          const responseBody: ResponseBody = {
            message:
              "Token was not successfully generated despite correct credentials",
            NRP: userMaster.NRP,
            jwt: "",
          };
          ctx.response.status = 500;
          ctx.response.body = responseBody;
        }
        return;
      }
    }
    page += 1;
    response = await fetch(`http://localhost:8000/authInfo/${page}`);
    userMasters = await response.json();
  }
  const responseBody: ResponseBody = {
    message: "Invalid credentials",
    NRP: "",
    jwt: "",
  };
  ctx.response.status = 422;
  ctx.response.body = responseBody;
};

export default login;
