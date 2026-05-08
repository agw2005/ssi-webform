import { copy, exists, move } from "@std/fs";
import { fromFileUrl, join } from "@std/path";

const ROOT = fromFileUrl(import.meta.resolve("../"));
const envDest = Deno.env.get("BUILD_DEST");
const serverName = "prism-server";

const dest = envDest && await exists(envDest, { isDirectory: true })
  ? envDest
  : join(ROOT, "build");

await Deno.mkdir(dest, { recursive: true });
console.log(`📦 Bundling to: ${dest}`);

const clientDist = join(ROOT, "client", "dist");
if (await exists(clientDist)) {
  await move(clientDist, dest, { overwrite: true });
  console.log("✅ Client assets copied");
}

const serverBundleDir = join(dest, serverName);
await Deno.mkdir(serverBundleDir, { recursive: true });

const serverExeLocation = join(ROOT, "server", serverName);
if (await exists(serverExeLocation)) {
  await move(
    serverExeLocation,
    join(serverBundleDir, serverName),
  );
  console.log(`✅ Server executable copied to ${serverName}`);
}

const serverPublicSource = join(ROOT, "server", "public");
if (await exists(serverPublicSource)) {
  await copy(serverPublicSource, join(serverBundleDir, "public"), {
    overwrite: true,
  });
  console.log(`✅ Server public folder copied to ${serverName}`);
}

const logsDir = join(serverBundleDir, "logs");
await Deno.mkdir(logsDir, { recursive: true });
await Deno.writeTextFile(join(logsDir, "server.log"), "");
console.log(`✅ Logs directory and server.log initialized in ${serverName}`);

console.log(`📦 Application finished bundling to ${dest}`);
