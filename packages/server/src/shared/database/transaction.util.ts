import { type Database, db, type DbClient } from "@workspace/database";

export const withTransactionFactory = (client: DbClient) => {
  return async <T>(callback: (tx: DbClient) => Promise<T>): Promise<T> => {
    if ("transaction" in client && typeof client.transaction === "function") {
      return await (client as Database).transaction(callback);
    }

    return callback(client);
  };
};

export type WithTransactionType = ReturnType<typeof withTransactionFactory>;

export const withTransaction = withTransactionFactory(db);
