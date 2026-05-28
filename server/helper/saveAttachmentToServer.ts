import { join, normalize } from "@std/path";
import { exists } from "@std/fs";
import { getLogger } from "@logtape/logtape";

const logger = getLogger("prism-server");

export const saveAttachmentToServer = async (
  file: File,
  accessId: string,
  rename?: string,
) => {
  try {
    logger.trace(
      `Running function saveAttachmentToServer()`,
      { accessId: accessId },
    );

    const destDir = Deno.env.get("ATTACHMENTS_DIR_ABSOLUTE");
    logger.debug(`Value of destDir is ${destDir}`, { accessId: accessId });

    if (!file || !(file instanceof File)) {
      const errMessage = `No valid file was provided`;
      logger.error(errMessage, { accessId: accessId });
      throw new Error(errMessage);
    }

    if (!destDir) {
      const errMessage =
        `Empty file destination directory in the environment file of the server`;
      logger.error(errMessage, { accessId: accessId });
      throw new Error(errMessage);
    }

    // Path to attachments dir must exist before being used by the server
    const dest = normalize(destDir);
    logger.debug(`Value of dest is ${dest}`, { accessId: accessId });
    if (!(await exists(dest, { isReadable: true, isDirectory: true }))) {
      const errMessage = `File destination directory does not exist`;
      logger.error(errMessage, { accessId: accessId });
      throw new Error(errMessage);
    }

    logger.info(
      `Saving incoming file to destination ${dest}`,
      { accessId: accessId },
    );

    const newFilePath = join(dest, rename || file.name);
    const newFile = await Deno.open(newFilePath, {
      write: true,
      create: true,
      truncate: true,
    });
    await file.stream().pipeTo(newFile.writable);

    if (await exists(newFilePath, { isFile: true })) {
      logger.info(
        `Finished saving incoming file at ${newFilePath}`,
        { accessId: accessId },
      );
    } else {
      const errMessage =
        `Finished piping file to destination, but checking for if file exist did not pass.`;
      logger.error(errMessage, { accessId: accessId });
      throw new Error(errMessage);
    }
  } catch (err) {
    const errMessage =
      `An error occured during attachment saving to destination. Aborting operation.`;
    logger.error(errMessage, { accessId: accessId });
    logger.error(`Additional message: ${err}`, { accessId: accessId });
  }
};
