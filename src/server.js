const express = require("express");
const hbs = require("express-handlebars");
const session = require("express-session");
const path = require("path");
const routes = require("./routes/index");
// connect to postgreSQL database
const db = require("./database/postgreSQL");
const passport = require("passport");
const pgSession = require("connect-pg-simple")(session);
require("dotenv").config({path: path.resolve(process.cwd(), "src/.env")});
require("./config//passport");
const app = express();
const port = parseInt(process.env.PORT) || 8080;
const host = (process.argv[2] === "production") ? process.env.HOST_DOMAIN : "localhost";
const database = (process.argv[2] === "production") ? process.env.DB_NAME : "FateGrandOrder";

app.engine(".hbs", hbs.engine({
  extname : ".hbs",
  helpers : require("./config/handlebars-helpers")
}));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "resources", "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: new pgSession({
    pgPromise: db,
    tableName: "sessions",
    conObject: {
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host,
      port: process.env.DB_PORT,
      database
    }
  }),
  cookie: {maxAge: 6*60*60*1000} //6 hours
}));
app.use(passport.initialize());
app.use(passport.session());

//split routes
routes(app);

app.use((err,req,res,next) => {
  console.log(err.stack);
  res.status(500).send("something is wrong here");
})

app.listen(port, () => {console.log(`the server is listening on http://localhost:${port}`)});