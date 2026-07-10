import postgres from "postgres";

if (!process.env.DB_CONN_STRING) {
  throw new Error("Missing env variable: DB_CONN_STRING");
}

const sql = postgres(process.env.DB_CONN_STRING, { transform: postgres.camel });

// If column is DATE, return raw string rather than JS Date Object
sql.options.parsers[1082] = (value) => value;

export default sql;
