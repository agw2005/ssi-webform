import { getFileSink } from "@logtape/file";
import { configure, getConsoleSink, type LogRecord } from "@logtape/logtape";
import { loggerDate } from "./helper/loggerDate.ts";

const logFormatter = (record: LogRecord): string => {
  return `[${record.level}] ${loggerDate()}=> ${record.message}\n`;
};

export async function setupLogger() {
  await configure({
    sinks: {
      file: getFileSink(`${Deno.cwd()}/logs/server.log`, {
        lazy: true,
        bufferSize: 8192,
        flushInterval: 5000,
        nonBlocking: true,
        formatter: logFormatter,
      }),
      console: getConsoleSink({
        nonBlocking: true,
        formatter: logFormatter,
      }),
    },
    loggers: [
      {
        category: "prism-server",
        lowestLevel: "trace",
        sinks: ["file", "console"],
      },
    ],
  });
}
