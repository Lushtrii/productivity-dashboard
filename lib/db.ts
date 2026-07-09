import postgres from "postgres";

if (!process.env.DB_CONN_STRING) {
  throw new Error("Missing env variable: DB_CONN_STRING");
}

const sql = postgres(process.env.DB_CONN_STRING, { transform: postgres.camel });

export default sql;
