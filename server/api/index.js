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

const RELATIONSHIP_OPTIONS = new Set([
  "Branch mate",
  "Junior",
  "Other"
]);

app.use(cors({ origin: "*" }));
app.use(express.json());

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(MONGODB_URI, {
    dbName: "galaxy-messages"
  });
  isConnected = true;
}

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6
});

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "Galaxy Messages backend is live.",
    health: "/api/health"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/messages", submitLimiter, async (req, res) => {
  try {
    await connectDB();

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

    const savedMessage = await Message.create({
      name: name?.trim() || "",
      relationship: relationship.trim(),
      relationshipOther: relationshipOther?.trim() || "",
      message: message.trim()
    });

    const senderName = savedMessage.name || "Anonymous";

    if (resend) {
      await resend.emails.send({
        from: RESEND_FROM,
        to: [NOTIFY_EMAIL],
        subject: `New Galaxy message from ${senderName}`,
        text: savedMessage.message
      });
    }

    res.status(201).json({
      message: "Memory saved successfully",
      data: savedMessage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong"
    });
  }
});

export default app;
