import { decodeBase64 } from "@std/encoding/base64";

const getKey = async () => {
  const jwtKeyString = Deno.env.get("JWT_KEY");

  if (!jwtKeyString) throw new Error("JWT_KEY environment variable is missing");

  const jwtKeyBytes = decodeBase64(jwtKeyString);

  const jwtKey = await crypto.subtle.importKey(
    "raw",
    jwtKeyBytes,
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"],
  );

  return jwtKey;
};

export default getKey;
