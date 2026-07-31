import postgres from "postgres";

const connectionString =
  process.env.DB_CONN_STRING ||
  "postgres://placeholder:placeholder@127.0.0.1:5432/placeholder";

const sql = postgres(connectionString, { transform: postgres.camel });

sql.options.parsers[1082] = (value) => Temporal.PlainDate.from(value);

export default sql;
