const pgp = require("pg-promise")();
const path = require("path");
require("dotenv").config({path: path.resolve(process.cwd(), "src/.env")});
const host = (process.argv[2] === "production") ? process.env.DB_HOST : "localhost";
const database = (process.argv[2] === "production") ? process.env.DB_NAME : "FateGrandOrder";
const cn = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host,
  port: parseInt(process.env.DB_PORT),
  database
};
const db = pgp(cn);

module.exports = db;