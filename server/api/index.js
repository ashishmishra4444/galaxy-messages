import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { Resend } from "resend";
import Message from "../models/Message.js";

dotenv.config();

const app = express();

const MONGODB_URI = process.env.MONGODB_URI;
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM =
  process.env.RESEND_FROM || "Galaxy Messages <onboarding@resend.dev>";
const NOTIFY_EMAIL =
  process.env.NOTIFY_EMAIL || "ashishkumarmishra4904@gmail.com";

const RELATIONSHIP_OPTIONS = new Set(["Branch mate", "Junior", "Other"]);

app.use(cors({ origin: "*" }));
app.use(express.json());

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(MONGODB_URI, {
    dbName: "galaxy-messages",
  });
  isConnected = true;
}

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
});

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "Galaxy Messages backend is live.",
    health: "/api/health",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/messages", submitLimiter, async (req, res) => {
  try {
    await connectDB();

    const { name, relationship, relationshipOther, message } = req.body;

    const normalizedRelationship = relationship?.trim() || "";
    const normalizedOther = relationshipOther?.trim() || "";
    const normalizedMessage = message?.trim() || "";
    const normalizedName = name?.trim() || "Anonymous";

    if (!normalizedRelationship || !normalizedMessage) {
      return res.status(400).json({
        success: false,
        message: "Relationship and message are required.",
      });
    }

    if (!RELATIONSHIP_OPTIONS.has(normalizedRelationship)) {
      return res.status(400).json({
        success: false,
        message: "Please choose a valid connection.",
      });
    }

    const savedMessage = await Message.create({
      name: normalizedName,
      relationship: normalizedRelationship,
      relationshipOther: normalizedOther,
      message: normalizedMessage,
    });

    const senderName = savedMessage.name || "Anonymous";

    const relationshipLabel =
      savedMessage.relationship === "Other" && savedMessage.relationshipOther
        ? `Other - ${savedMessage.relationshipOther}`
        : savedMessage.relationship;

    if (resend && NOTIFY_EMAIL) {
      await resend.emails.send({
        from: RESEND_FROM,
        to: [NOTIFY_EMAIL],
        subject: `New Galaxy message from ${senderName}`,
        text: `New Galaxy 2026 memory\n\nFrom: ${senderName}\nRelationship: ${relationshipLabel}\n\nMessage:\n${savedMessage.message}`,
        html: `
<div style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #e7e5e4; max-width: 640px; margin: 0 auto; padding: 28px; background: linear-gradient(145deg,#030303 10%,#0d0a09 45%,#140f0d 75%,#040404 100%); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px;">

  <h2 style="margin: 0 0 18px; color: #fde68a; letter-spacing: 0.08em;">
    ✨ New Galaxy 2026 Memory
  </h2>

  <p style="margin: 0 0 6px; color: #d6d3d1;">
    <strong style="color:#fcd34d;">From:</strong> ${senderName}
  </p>

  <p style="margin: 0 0 18px; color: #d6d3d1;">
    <strong style="color:#fcd34d;">Connection:</strong> ${relationshipLabel}
  </p>

  <div style="padding: 18px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; white-space: pre-wrap; color: #e5e5e5;">
    ${savedMessage.message
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}
  </div>

  <div style="margin-top: 22px; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #a8a29e;">
    Galaxy 2026 • VSSUT Farewell
  </div>

</div>
`,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Memory Captured!",
      data: savedMessage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while saving your memory.",
    });
  }
});

export default app;
