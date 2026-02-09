import mysql from "mysql2/promise";
import type { TestTable } from "../models/Test.d.ts";

export const testConnection = async (pool: mysql.Pool) => {
  const [rows, _] = await pool.query<TestTable[]>("SELECT * FROM test");
  console.log(rows[0].first_word + " " + rows[0].second_word);
};
