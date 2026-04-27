import { getLogger } from "@logtape/logtape";
import databasePool from "../dbpool.ts";
import ssms from "mssql";
import type { RouterContext } from "@oak/oak/router";
import type { MsSqlResponse } from "@scope/server";

const logger = getLogger("webform-oak-server");

export const runSimpleQuery = async <T extends string, U>(
  ctx: RouterContext<T>,
  route: string,
  queryFunc: (
    transaction: ssms.Transaction,
  ) => Promise<MsSqlResponse<U>>,
  queryFuncName: string,
) => {
  logger.info(
    `User accessed route "${route}"`,
  );

  const transaction = new ssms.Transaction(databasePool);

  transaction.on("error", (err) => {
    logger.error(
      `Internal transaction error caught by listener = {value}`,
      { err },
    );
  });

  logger.info(
    `Beginning transaction`,
  );

  try {
    await transaction.begin();

    logger.trace(
      `Running function ${queryFuncName}()`,
    );

    const { rowsReturned, rowsAffected } = await queryFunc(
      transaction,
    );

    logger.trace(
      `Finished running function ${queryFuncName}()`,
    );

    logger.debug(
      `${rowsAffected[0]} rows affected`,
    );

    logger.info(
      `Comitting transaction`,
    );

    await transaction.commit();

    ctx.response.status = 200;
    ctx.response.body = rowsReturned;
  } catch (err) {
    logger.error(
      `Transaction failed for route "${route}". {value}`,
      { err },
    );
    ctx.response.status = 500;
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(
        `Failed rolling back transaction. {value}`,
        { rollbackErr },
      );
    }
  }
};
