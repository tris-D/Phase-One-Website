import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morganCustom from "./middlewares/morgan.middleware.js";
import contactRoutes from "./routes/contact.routes.js";
import logger from "./utils/logger.js"

// INITIALIZING APP
const app = express();

// Trust the first proxy (e.g. Nginx / a PaaS load balancer) so req.ip and the
// rate limiter see the real visitor IP rather than the proxy's.
app.set("trust proxy", 1);

app.set("view engine", "ejs");
app.set("views", "views");

// MIDDLEWARES
// Security headers. CSP is disabled because the theme relies on inline styles,
// external fonts/CDNs, and a Google Maps iframe; a tailored CSP can be added later.
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
  })
);
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
  res.render("1_index.ejs", {
    title: "Phase 1 | One Goal, One Purpose",
    description:
      "Phase 1 is an Ottawa-based nonprofit empowering youth through mentorship, education, and community programs.",
  });
});

app.get("/about", (req, res) => {
  res.render("2_about.ejs", {
    title: "About Us | Phase 1",
    description:
      "Learn about Phase 1's mission, team, and community impact supporting youth in Ottawa.",
  });
});

app.use("/contact", contactRoutes);

app.get("/events", (req, res) => {
  res.render("4_events.ejs", {
    title: "Events | Phase 1",
    description:
      "Upcoming and past events, programs, and gallery highlights from Phase 1 in Ottawa.",
  });
});

app.get("/programs", (req, res) => {
  res.render("5_programs.ejs", {
    title: "Programs | Phase 1",
    description:
      "Explore the programs Phase 1 offers to support and empower youth across Ottawa.",
  });
});

// 404 - no route matched
app.use((req, res) => {
  res.status(404).render("6_404.ejs", {
    code: 404,
    message: "Sorry, we couldn't find the page you were looking for.",
  });
});
// 500 - unhandled errors
app.use((err, req, res, next) => {
  logger.error(`Unhandled error on ${req.method} ${req.originalUrl}: ${err.stack || err.message}`);
  res.status(500).render("6_404.ejs", {
    code: 500,
    message: "Something went wrong on our end. Please try again in a moment.",
  });
});

export default app;
