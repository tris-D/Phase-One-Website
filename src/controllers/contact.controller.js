import logger from "../utils/logger.js";
import { sendContactEmail } from "../utils/mailer.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function renderContact(res, status, locals = {}) {
  return res.status(status).render("3_contact.ejs", {
    title: "Contact | Phase 1",
    description:
      "Get in touch with Phase 1 in Ottawa — visit us, call, or send us a message.",
    success: null,
    error: null,
    ...locals,
  });
}

export function getContact(req, res) {
  renderContact(res, 200);
}

export async function postContact(req, res) {
  // Honeypot: real users never see or fill this field; bots usually do.
  // Silently pretend success so spammers don't learn they were blocked.
  if (String(req.body.website ?? "").trim() !== "") {
    logger.warn(`Blocked spam contact submission (honeypot) from IP ${req.ip}`);
    return renderContact(res, 200, {
      success: "Thanks for reaching out! We'll get back to you soon.",
    });
  }

  const name = String(req.body.name ?? "").trim();
  const email = String(req.body.email ?? "").trim();
  const phone = String(req.body.phone ?? "").trim();
  const message = String(req.body.message ?? "").trim();

  if (!name || !email || !message) {
    return renderContact(res, 400, {
      error: "Please fill in your name, email, and message.",
    });
  }

  if (!EMAIL_RE.test(email)) {
    return renderContact(res, 400, {
      error: "Please enter a valid email address.",
    });
  }

  if (name.length > 100 || email.length > 200 || phone.length > 40 || message.length > 5000) {
    return renderContact(res, 400, {
      error: "One or more fields are too long. Please shorten your message and try again.",
    });
  }

  try {
    await sendContactEmail({ name, email, phone, message });
    return renderContact(res, 200, {
      success: "Thanks for reaching out! We'll get back to you soon.",
    });
  } catch (err) {
    logger.error(`Failed to send contact email: ${err.message}`);
    return renderContact(res, 500, {
      error: "Sorry, we couldn't send your message right now. Please try again or email us directly.",
    });
  }
}
