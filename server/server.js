import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { rateLimit } from "express-rate-limit";
import mongoose from "mongoose";
import { Resend } from "resend";
import Message from "./models/Message.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const DATABASE_NAME = process.env.DATABASE_NAME || "galaxy-messages";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM =
  process.env.RESEND_FROM || "Galaxy Messages <onboarding@resend.dev>";
const NOTIFY_EMAIL =
  process.env.NOTIFY_EMAIL || "ashishkumarmishra4904@gmail.com";
const RELATIONSHIP_OPTIONS = new Set([
  "Branch mate",
  "Lab partner",
  "Project teammate",
  "Late-night coder",
  "Hostel wingmate",
  "Hostel roommate",
  "Event squad",
  "Campus wanderer",
  "Junior",
  "Other"
]);

const allowedOrigins = new Set(
  CLIENT_URL.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

allowedOrigins.add("http://localhost:5173");
allowedOrigins.add("http://127.0.0.1:5173");

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json());

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 6,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message:
      "Too many memories were sent from this connection. Please try again in a few minutes."
  }
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true, message: "Galaxy 2026 API is running." });
});

app.post("/api/messages", submitLimiter, async (req, res) => {
  try {
    const { name, relationship, relationshipOther, message } = req.body;

    if (!relationship?.trim() || !message?.trim()) {
      return res.status(400).json({
        message: "Relationship and message are required."
      });
    }

    if (!RELATIONSHIP_OPTIONS.has(relationship.trim())) {
      return res.status(400).json({
        message: "Please choose a valid connection."
      });
    }

    if (name?.trim() && name.trim().length > 60) {
      return res.status(400).json({
        message: "Name must be 60 characters or fewer."
      });
    }

    if (
      relationship.trim().toLowerCase() === "other" &&
      !relationshipOther?.trim()
    ) {
      return res.status(400).json({
        message: "Please specify your connection if you choose Other."
      });
    }

    if (relationshipOther?.trim() && relationshipOther.trim().length > 120) {
      return res.status(400).json({
        message: "Custom relationship must be 120 characters or fewer."
      });
    }

    if (message.trim().length > 1200) {
      return res.status(400).json({
        message: "Message must be 1200 characters or fewer."
      });
    }

    const savedMessage = await Message.create({
      name: name?.trim() || "",
      relationship: relationship.trim(),
      relationshipOther: relationshipOther?.trim() || "",
      message: message.trim()
    });

    const senderName = savedMessage.name || "Anonymous";
    const connectionLabel =
      savedMessage.relationship === "Other" && savedMessage.relationshipOther
        ? savedMessage.relationshipOther
        : savedMessage.relationship;

    let notificationMessage = "Your memory has been sent.";

    if (resend) {
      const { error } = await resend.emails.send({
        from: RESEND_FROM,
        to: [NOTIFY_EMAIL],
        subject: `New Galaxy message from ${senderName}`,
        text: [
          `You received a new Galaxy message.`,
          ``,
          `Name: ${senderName}`,
          `Connection: ${connectionLabel}`,
          ``,
          `Message:`,
          savedMessage.message,
          ``,
          `Received at: ${savedMessage.createdAt.toISOString()}`
        ].join("\n"),
        html: `
          <div style="font-family: Arial, sans-serif; background:#0f0d0c; color:#f5f5f4; padding:24px;">
            <div style="max-width:640px; margin:0 auto; background:#171311; border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:28px;">
              <p style="margin:0 0 8px; letter-spacing:0.3em; text-transform:uppercase; font-size:12px; color:#fcd68a;">Galaxy Messages</p>
              <h1 style="margin:0 0 20px; font-size:28px; color:#fff7ed;">You received a new memory</h1>
              <p style="margin:0 0 10px;"><strong>Name:</strong> ${senderName}</p>
              <p style="margin:0 0 10px;"><strong>Connection:</strong> ${connectionLabel}</p>
              <p style="margin:20px 0 8px;"><strong>Message:</strong></p>
              <div style="white-space:pre-wrap; line-height:1.7; background:#0d0b0a; border-radius:16px; padding:18px; color:#e7e5e4;">${savedMessage.message
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")}</div>
              <p style="margin:18px 0 0; color:#a8a29e; font-size:13px;">Received at ${savedMessage.createdAt.toISOString()}</p>
            </div>
          </div>
        `
      });

      if (error) {
        notificationMessage =
          "Your memory has been saved. Email delivery is temporarily unavailable.";
      }
    } else {
      notificationMessage =
        "Your memory has been saved. Email delivery is temporarily unavailable.";
    }

    return res.status(201).json({
      message: notificationMessage,
      data: savedMessage
    });
  } catch (error) {
    console.error("Unable to save memory", error);
    return res.status(500).json({
      message: "Something went wrong while sending your memory. Please try again."
    });
  }
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DATABASE_NAME
    });
    console.log("Connected to MongoDB");
    await Message.createCollection().catch(() => {});
    console.log(`Using database: ${DATABASE_NAME}`);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

startServer();
