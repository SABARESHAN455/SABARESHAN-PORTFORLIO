const express = require("express");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, "data");
const messagesFile = path.join(dataDir, "messages.json");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(messagesFile)) fs.writeFileSync(messagesFile, "[]", "utf8");

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "Sabareshan M Portfolio API" });
});

app.post("/api/contact", (req, res) => {
  const name = String(req.body.name || "").trim().slice(0, 80);
  const email = String(req.body.email || "").trim().slice(0, 120);
  const message = String(req.body.message || "").trim().slice(0, 2000);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 5) {
    return res.status(400).json({ ok: false, message: "Please enter a valid name, email and message." });
  }

  const messages = JSON.parse(fs.readFileSync(messagesFile, "utf8"));
  messages.push({ name, email, message, createdAt: new Date().toISOString() });
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), "utf8");
  res.status(201).json({ ok: true, message: "Thanks! Your message has been received." });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Portfolio running on http://localhost:${PORT}`));
