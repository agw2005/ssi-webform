import { getFileSink } from "@logtape/file";
import { configure, type LogRecord } from "@logtape/logtape";

export async function setupLogger() {
  await configure({
    sinks: {
      file: getFileSink(`${Deno.cwd()}/logs/server.log`, {
        lazy: true,
        bufferSize: 8192,
        flushInterval: 5000,
        nonBlocking: true,
      }),
      console: (record: LogRecord) => {
        console.log(`[${record.level}] ${record.message}`);
      },
    },
    loggers: [
      {
        category: "webform-oak-server",
        lowestLevel: "trace",
        sinks: ["file", "console"],
      },
    ],
  });
}
