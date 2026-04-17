import { encodeBase64 } from "@std/encoding";
import { getLogger } from "@logtape/logtape";
import { loggerDate } from "../helper/loggerDate.ts";

const logger = getLogger("webform-oak-server");

const ENV_PATH = ".env";

const generateJWTKey = async () => {
  const key = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"],
  );

  const exportedKey = await crypto.subtle.exportKey("raw", key);
  const base64Key = encodeBase64(new Uint8Array(exportedKey));

  const envContent = await Deno.readTextFile(ENV_PATH);
  const updatedEnv = envContent.replace(
    /^JWT_KEY=.*$/m,
    `JWT_KEY=${base64Key}`,
  );

  await Deno.writeTextFile(ENV_PATH, updatedEnv);
  logger.info(
    `${loggerDate()} : JWT_KEY successfully appended to .env file"`,
  );
};

generateJWTKey();
