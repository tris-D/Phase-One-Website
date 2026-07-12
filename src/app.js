import express from "express";
import cookieParser from "cookie-parser";
import morganCustom from "./middlewares/morgan.middleware.js";
import contactRoutes from "./routes/contact.routes.js";

// INITIALIZING APP
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// MIDDLEWARES
// basic configurations of express
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // makes sure it can ready req.body in the form of x-www-urlencoded
app.use(express.json({ limit: "16kb" })); // prevents overload of server or crash by putting a size limit on undertsanding sent in JSONs
// Custom morgan middleware // to log requests coming in
app.use(morganCustom);
// User cookieParser for cookies and short data processing // to send and receive cookies
app.use(cookieParser());

// OFFICIAL ROUTES

// Index route
app.get("/", (req, res) => {
  res.render("1_index.ejs");
});

app.get("/about", (req, res) => {
  res.render("2_about.ejs");
});

app.use("/contact", contactRoutes);

app.get("/events", (req, res) => {
  res.render("4_events.ejs");
});

app.get("/programs", (req, res) => {
  res.render("5_programs.ejs");
});

app.get("/test", (req, res) => {
  res.render("test.ejs");
});

export default app;
