import { getFileSink } from "@logtape/file";
import { configure } from "@logtape/logtape";

await configure({
  sinks: {
    file: getFileSink(`${Deno.cwd()}/logs/server.log`, {
      lazy: true,
      bufferSize: 8192,
      flushInterval: 5000,
      nonBlocking: true,
    }),
  },
  loggers: [
    { category: "webform-oak-server", lowestLevel: "trace", sinks: ["file"] },
  ],
});
