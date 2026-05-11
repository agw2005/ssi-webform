import { getLogger } from "@logtape/logtape";
import databasePool from "../dbpool.ts";
import ssms from "mssql";
import type { RouterContext } from "@oak/oak/router";
import type { MsSqlResponse } from "@scope/server";

const logger = getLogger("prism-server");

export const runSimpleQuery = async <T extends string, U>(
  ctx: RouterContext<T>,
  route: string,
  queryFunc: (
    transaction: ssms.Transaction,
  ) => Promise<MsSqlResponse<U>>,
  queryFuncName: string,
  successCode: number,
) => {
  const accessId = crypto.randomUUID();

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );

  const transaction = new ssms.Transaction(databasePool);

  transaction.on("error", (err) => {
    logger.error(
      `Internal transaction error caught by listener = ${err}`,
      { accessId: accessId },
    );
  });

  logger.info(
    `Beginning transaction`,
    { accessId: accessId },
  );

  try {
    await transaction.begin();

    logger.trace(
      `Running function ${queryFuncName}()`,
      { accessId: accessId },
    );

    const { rowsReturned, rowsAffected } = await queryFunc(
      transaction,
    );

    logger.trace(
      `Finished running function ${queryFuncName}()`,
      { accessId: accessId },
    );

    logger.debug(
      `${rowsAffected[0]} rows affected`,
      { accessId: accessId },
    );

    logger.info(
      `Comitting transaction`,
      { accessId: accessId },
    );

    await transaction.commit();

    ctx.response.status = successCode;
    ctx.response.body = rowsReturned;
  } catch (err) {
    logger.error(
      `Transaction failed for route "${route}". ${err}`,
      { accessId: accessId },
    );
    ctx.response.status = 500;
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(
        `Failed rolling back transaction. ${rollbackErr}`,
        { accessId: accessId },
      );
    }
  }
};
