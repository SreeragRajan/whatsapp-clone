/**
 * Usage: node scripts/process_payloads.js <payloads-folder>
 * This script reads webhook JSON files and inserts/updates messages in MongoDB.
 * It expects files with the structure similar to the uploaded samples:
 * - metaData.entry[].changes[].value containing contacts, messages, and/or statuses
 */
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { connect as _connect } from "mongoose";
import Message from "../src/models/Message.js";
import dotenv from "dotenv";
dotenv.config();

async function connect() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/whatsapp";
  await _connect(uri, {});
}

function tsToDate(tsStr) {
  try {
    const n = Number(tsStr);
    if (!isNaN(n)) {
      // treat as seconds if length <= 10 else milliseconds
      if (tsStr.length <= 10) return new Date(n * 1000);
      return new Date(n);
    }
  } catch (e) {}
  return new Date();
}

async function processFile(filePath) {
  const raw = readFileSync(filePath, "utf8");
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (e) {
    console.error("Invalid JSON", filePath);
    return;
  }

  const entries =
    payload.metaData && payload.metaData.entry
      ? payload.metaData.entry
      : payload.entry || [];
  for (const entry of entries) {
    const changes = entry.changes || [];
    for (const change of changes) {
      const value = change.value || {};
      const contacts = value.contacts || [];
      const contact = contacts[0] || {};
      const wa_id = contact.wa_id || (contact && contact.id) || null;
      // Messages
      if (Array.isArray(value.messages)) {
        for (const m of value.messages) {
          const msgObj = {
            message_id: m.id || m.message_id || `msg-${Date.now()}`,
            meta_msg_id: m.meta_msg_id || m.context?.id || null,
            wa_id: wa_id || m.from || null,
            from: m.from || null,
            to: m.to || null,
            text: (m.text && (m.text.body || m.text)) || m.body || null,
            type: m.type || "text",
            timestamp: tsToDate(m.timestamp || payload.timestamp),
            status: "sent",
            raw: m,
          };
          await Message.findOneAndUpdate(
            { message_id: msgObj.message_id },
            { $set: msgObj },
            { upsert: true, new: true }
          );
          console.log("Upserted message", msgObj.message_id);
        }
      }
      // Statuses
      if (Array.isArray(value.statuses)) {
        for (const s of value.statuses) {
          const id = s.id || s.meta_msg_id || null;
          const status = s.status || s.event || null;
          const recipient = s.recipient_id || s.recipient || null;
          const ts = tsToDate(s.timestamp || payload.timestamp);
          if (id) {
            // Update by message_id or meta_msg_id
            const q = { $or: [{ message_id: id }, { meta_msg_id: id }] };
            const upd = {
              $set: { status: status || "delivered", timestamp: ts },
            };
            const r = await Message.findOneAndUpdate(q, upd, { new: true });
            if (r) console.log("Updated status for", id, "->", status);
            else {
              // If not found, create a placeholder message with status
              const placeholder = new Message({
                message_id: id,
                meta_msg_id: id,
                wa_id: recipient || wa_id,
                from: null,
                to: recipient || wa_id,
                text: null,
                type: "status",
                timestamp: ts,
                status: status || "delivered",
                raw: s,
              });
              await placeholder.save();
              console.log("Created placeholder for status", id);
            }
          }
        }
      }
    }
  }
}

async function main() {
  const folder = process.argv[2] || "./payloads";
  await connect();
  const files = readdirSync(folder).filter((f) => f.endsWith(".json"));
  for (const f of files) {
    await processFile(join(folder, f));
  }
  console.log("Done processing payloads");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
