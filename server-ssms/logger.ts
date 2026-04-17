import { getFileSink } from "@logtape/file";
import { configure, getConsoleSink, type LogRecord } from "@logtape/logtape";
import { loggerDate } from "./helper/loggerDate.ts";

const webformLogFormatter = (record: LogRecord): string => {
  const levelMap: Record<string, string> = {
    "trace": "TRC",
    "debug": "DBG",
    "info": "INF",
    "warn": "WRN",
    "error": "ERR",
    "fatal": "FTL",
  };
  const level = levelMap[record.level] || record.level.toUpperCase();

  return `[${level}] ${loggerDate()}=> ${record.message}\n`;
};

export async function setupLogger() {
  await configure({
    sinks: {
      file: getFileSink(`${Deno.cwd()}/logs/server.log`, {
        lazy: true,
        bufferSize: 8192,
        flushInterval: 5000,
        nonBlocking: true,
        formatter: webformLogFormatter,
      }),
      console: getConsoleSink({
        nonBlocking: true,
        formatter: webformLogFormatter,
      }),
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
