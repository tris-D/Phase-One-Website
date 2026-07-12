import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getContact, postContact } from "../controllers/contact.controller.js";

const router = Router();

// Limit how often a single IP can submit the contact form, to curb spam/abuse.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max submissions per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).render("3_contact.ejs", {
      title: "Contact | Phase 1",
      description:
        "Get in touch with Phase 1 in Ottawa — visit us, call, or send us a message.",
      success: null,
      error:
        "You've sent several messages in a short time. Please wait a few minutes and try again.",
    });
  },
});

router.get("/", getContact);
router.post("/", contactLimiter, postContact);

export default router;
