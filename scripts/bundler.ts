import { copy, exists } from "@std/fs";
import { fromFileUrl, join } from "@std/path";

const ROOT = fromFileUrl(import.meta.resolve("../"));
const envDest = Deno.env.get("BUILD_DEST");
const serverExecutable = "webform-oak-server";

const dest = envDest && await exists(envDest, { isDirectory: true })
  ? envDest
  : join(ROOT, "build");

await Deno.mkdir(dest, { recursive: true });
console.log(`📦 Bundling to: ${dest}`);

const clientDist = join(ROOT, "client", "dist");
if (await exists(clientDist)) {
  await copy(clientDist, dest, { overwrite: true });
  console.log("✅ Client assets copied");
}

const serverExeLocation = join(ROOT, "server", serverExecutable);
if (await exists(serverExeLocation)) {
  await Deno.copyFile(serverExeLocation, join(dest, serverExecutable));
  console.log("✅ Server executable copied");
}

console.log(`📦 Application finished bundling to ${dest}`);
