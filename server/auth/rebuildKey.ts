import { decodeBase64 } from "@std/encoding";
import dotenv from "dotenv";
import process from "node:process";

dotenv.config();

const rebuildKey = async () => {
  const jwtKeyString = process.env.JWT_KEY;
  if (!jwtKeyString) {
    throw new Error("JWT_KEY environment variable is missing.");
  }
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

export default rebuildKey;
